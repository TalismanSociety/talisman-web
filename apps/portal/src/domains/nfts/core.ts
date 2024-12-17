import type { SetterOrUpdater } from 'recoil'
import { array, jsonParser, string } from '@recoiljs/refine'
import * as Sentry from '@sentry/react'
import { type Nft as BaseNft } from '@talismn/nft'
import { toast } from '@talismn/ui/organisms/Toaster'
import { partial } from 'lodash'
import { useCallback, useMemo } from 'react'
import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
  waitForNone,
} from 'recoil'
import { bufferTime, filter, last, Observable, scan, tap } from 'rxjs'
import { spawn, Thread } from 'threads'

import { selectedAccountsState } from '@/domains/accounts/recoils'
import { chainState } from '@/domains/chains/recoils'
import { storageEffect } from '@/domains/common/effects'

import type { SubscribeNfts } from './worker'

export type NftTag = 'favorite' | 'hidden'

export type Nft = BaseNft & {
  tags: Set<NftTag>
}

type NftsProgress = { nfts: BaseNft[]; hasMore: boolean }

const _nftsState = atomFamily<NftsProgress, string>({
  key: '_Nfts',
  effects: (address: string) => [
    ({ setSelf, getPromise }) => {
      const batchSize = 100

      let initialResolve = (_value: NftsProgress) => {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let initialReject = (_reason?: any) => {}

      const initialPromise = new Promise<NftsProgress>((resolve, reject) => {
        initialResolve = resolve
        initialReject = reject
      })

      setSelf(initialPromise)

      const acalaPromise = getPromise(
        chainState({ genesisHash: '0xfc41b9bd8ef8fe53d58c7ea67c794c7ec9a73daf05e6d54b14ff6342c99ba64c' })
      )
      const bitcountryPromise = getPromise(
        chainState({ genesisHash: '0xf22b7850cdd5a7657bbfd90ac86441275bbc57ace3d2698a740c7b0ec4de5ec3' })
      )
      const workerPromise = spawn<SubscribeNfts>(new Worker(new URL('./worker', import.meta.url), { type: 'module' }))

      const subscriptionPromise = Promise.all([workerPromise, acalaPromise, bitcountryPromise]).then(
        ([worker, acala, bitcountry]) =>
          new Observable<BaseNft | { error: unknown }>(observer => {
            if (acala.rpc === undefined) {
              throw new Error('No RPC available for fetching Acala NFTs')
            }

            if (bitcountry.rpc === undefined) {
              throw new Error('No RPC available for fetching Bitcountry NFTs')
            }

            return worker(address, { batchSize, acalaRpc: acala.rpc, bitcountryRpc: bitcountry.rpc }).subscribe(
              observer
            )
          })
            .pipe(
              bufferTime(1000, null, batchSize),
              filter(nfts => nfts.length > 0),
              scan(
                (prev, nftsOrErrors) => {
                  const errors = nftsOrErrors
                    .filter((nft): nft is { error: unknown } => 'error' in nft)
                    .map(x => x.error)
                  const nfts = nftsOrErrors.filter((nft): nft is BaseNft => !('error' in nft))

                  errors.forEach(error => Sentry.captureException(error))

                  return { nfts: [...prev.nfts, ...nfts], errors: [...prev.errors, ...errors] }
                },
                { nfts: [] as BaseNft[], errors: [] as unknown[] }
              ),
              tap(({ nfts }) => {
                initialResolve({ nfts, hasMore: true })
                setSelf({ nfts, hasMore: true })
              }),
              last(null, { nfts: [], errors: [] }),
              tap(({ errors }) => {
                if (errors.length > 0) {
                  toast.error('Failed to fetch some NFTs', {
                    // Prevent spamming of toasts when multiple accounts fail to fetch NFTs
                    id: 'nfts-fetching-error',
                  })
                }

                errors.forEach(error => {
                  console.error(error)
                  Sentry.captureException(new Error('Failed to fetch NFT', { cause: error }))
                })
              })
            )
            .subscribe({
              complete: () => {
                void Thread.terminate(worker)
                initialResolve({ nfts: [], hasMore: false })

                try {
                  setSelf(x => (x instanceof DefaultValue ? { nfts: [], hasMore: false } : { ...x, hasMore: false }))
                } catch (error) {
                  // Happen only if state is still pending somehow, which we want to ignore anyway
                  if (!(error instanceof Error && error.message.includes('this is not currently supported'))) {
                    throw error
                  }
                }
              },
              error: error => {
                void Thread.terminate(worker)
                initialReject(error)
                Sentry.captureException(error)
              },
            })
      )

      return () => {
        void workerPromise.then(async worker => await Thread.terminate(worker))
        void subscriptionPromise.then(subscription => subscription.unsubscribe())
      }
    },
  ],
})

export const nftsState = selectorFamily({
  key: 'Nfts',
  get:
    (address: string) =>
    ({ get }): Nft[] =>
      [...get(_nftsState(address)).nfts]
        .map(x => {
          const tags = new Set<'favorite' | 'hidden'>()

          if (get(favoriteNftIdsState).includes(x.id)) {
            tags.add('favorite')
          }

          if (get(hiddenNftIdsState).includes(x.id)) {
            tags.add('hidden')
          }

          return { ...x, tags }
        })
        .sort(
          (a, b) =>
            Number(get(favoriteNftIdsState).includes(b.id)) - Number(get(favoriteNftIdsState).includes(a.id)) ||
            (a.name ?? '').localeCompare(b.name ?? '')
        ),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const nftsLoadingState = selectorFamily({
  key: 'NftsLoading',
  get:
    (address: string) =>
    ({ get }) =>
      get(waitForNone([_nftsState(address)]))[0].valueMaybe()?.hasMore ?? true,
})

type Type = string
type Chain = string
type CollectionId = string
export type CollectionKey = `${Type}-${Chain}-${CollectionId}` | 'unknown'
export type NftCollection = NonNullable<Nft['collection']> & { key: CollectionKey; items: Nft[] }
type CollectionMap = ReadonlyMap<CollectionKey, NftCollection>

export const getNftCollectionKey = (nft: Nft) =>
  `${nft.type}-${nft.chain}-${nft.collection?.id ?? ''}` satisfies CollectionKey

export const nftCollectionMapState = selectorFamily({
  key: 'NftCollectionMap',
  get:
    (address: string) =>
    ({ get }) => {
      const map = new Map<CollectionKey, NftCollection>()

      for (const nft of get(nftsByTagState({ address, blacklist: 'hidden' }))) {
        if (nft.collection !== undefined) {
          const key = getNftCollectionKey(nft)

          if (map.has(key)) {
            map.get(key)?.items.push(nft)
          } else {
            map.set(key, { ...nft.collection, key, items: [nft] })
          }
        } else {
          if (map.has('unknown')) {
            map.get('unknown')?.items.push(nft)
          } else {
            map.set('unknown', {
              key: 'unknown',
              id: 'unknown',
              name: 'Unknown',
              totalSupply: undefined,
              items: [nft],
            })
          }
        }
      }

      return map as CollectionMap
    },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const nftCollectionsState = selectorFamily<readonly NftCollection[], string>({
  key: `NftCollections`,
  get:
    address =>
    ({ get }) =>
      Array.from(get(nftCollectionMapState(address)).values()).sort(
        (a, b) => b.items.length - a.items.length || (a.name ?? '').localeCompare(b.name ?? '')
      ),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const nftCollectionState = selectorFamily<
  NftCollection | undefined,
  { address: string; collectionKey: CollectionKey }
>({
  key: 'NftCollection',
  get:
    ({ address, collectionKey }) =>
    ({ get }) =>
      get(nftCollectionMapState(address)).get(collectionKey),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const nftCollectionItemsState = selectorFamily<Nft[], { address: string; collectionKey: CollectionKey }>({
  key: 'NftCollectionItems',
  get:
    ({ address, collectionKey }) =>
    ({ get }) =>
      get(nftCollectionState({ address, collectionKey }))?.items ?? [],
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const favoriteNftIdsState = atom<readonly string[]>({
  key: 'favorite-nft-ids',
  default: [],
  effects: [storageEffect(localStorage, { parser: jsonParser(array(string())) })],
})

export const hiddenNftIdsState = atom<readonly string[]>({
  key: 'hidden-nft-ids',
  default: [],
  effects: [storageEffect(localStorage, { parser: jsonParser(array(string())) })],
})

export const selectedAccountsFavoriteNftsState = selector({
  key: 'SelectedAccountsFavoriteNfts',
  get: ({ get }) =>
    get(waitForNone(get(selectedAccountsState).map(x => nftsState(x.address))))
      .flatMap(x => x.valueMaybe() ?? [])
      .filter(x => get(favoriteNftIdsState).includes(x.id)),
})

export const selectedAccountsHiddenNftsState = selector({
  key: 'SelectedAccountsHiddenNfts',
  get: ({ get }) =>
    get(waitForNone(get(selectedAccountsState).map(x => nftsState(x.address))))
      .flatMap(x => x.valueMaybe() ?? [])
      .filter(x => get(hiddenNftIdsState).includes(x.id)),
})

export const nftsByTagState = selectorFamily<
  readonly Nft[],
  {
    address: string
    whitelist?: NftTag[] | NftTag | undefined
    blacklist?: NftTag[] | NftTag | undefined
  }
>({
  key: 'NftsByTag',
  get:
    ({ address, whitelist, blacklist }) =>
    ({ get }) =>
      get(nftsState(address))
        .filter(x =>
          Array.isArray(whitelist) ? whitelist.every(x.tags.has) : whitelist === undefined || x.tags.has(whitelist)
        )
        .filter(x =>
          Array.isArray(blacklist) ? !blacklist.some(x.tags.has) : blacklist === undefined || !x.tags.has(blacklist)
        ),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

const useSetTaggedNfts = (setNfts: SetterOrUpdater<readonly string[]>) => ({
  add: useCallback((nft: Nft) => setNfts(x => [...x.filter(y => y !== nft.id), nft.id]), [setNfts]),
  remove: useCallback((nft: Nft) => setNfts(x => x.filter(y => y !== nft.id)), [setNfts]),
  toggle: useCallback(
    (nft: Nft) =>
      setNfts(ids => {
        if (ids.includes(nft.id)) {
          return ids.filter(x => x !== nft.id)
        } else {
          return [...ids, nft.id]
        }
      }),
    [setNfts]
  ),
})

const useSetTaggedNft = (nft: Nft, setNfts: SetterOrUpdater<readonly string[]>) => {
  const { add, remove, toggle } = useSetTaggedNfts(setNfts)

  return {
    add: useMemo(() => partial(add, nft), [add, nft]),
    remove: useMemo(() => partial(remove, nft), [nft, remove]),
    toggle: useMemo(() => partial(toggle, nft), [nft, toggle]),
  }
}

export const useSetFavoriteNfts = () => useSetTaggedNfts(useSetRecoilState(favoriteNftIdsState))

export const useSetFavoriteNft = (nft: Nft) => useSetTaggedNft(nft, useSetRecoilState(favoriteNftIdsState))

export const useFavoriteNfts = () => [useRecoilValue(selectedAccountsFavoriteNftsState), useSetFavoriteNfts()] as const

export const useFavoriteNft = (nft: Nft) =>
  [useRecoilValue(favoriteNftIdsState).includes(nft.id), useSetFavoriteNft(nft)] as const

export const useSetHiddenNfts = () => useSetTaggedNfts(useSetRecoilState(hiddenNftIdsState))

export const useSetHiddenNft = (nft: Nft) => useSetTaggedNft(nft, useSetRecoilState(hiddenNftIdsState))

export const useHiddenNfts = () => [useRecoilValue(selectedAccountsHiddenNftsState), useSetHiddenNfts()] as const

export const useHiddenNft = (nft: Nft) =>
  [useRecoilValue(hiddenNftIdsState).includes(nft.id), useSetHiddenNft(nft)] as const
