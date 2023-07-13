import * as Sentry from '@sentry/react'
import { type Nft as BaseNft } from '@talismn/nft'
import { toast } from '@talismn/ui'
import { atomFamily, selectorFamily } from 'recoil'
import { bufferTime, filter, last, Observable, scan, tap } from 'rxjs'
import { spawn, Thread } from 'threads'
import { favoriteNftIdsState, hiddenNftIdsState, nftsByTagState } from './tags'
import { type SubscribeNfts } from './worker'

export type NftTag = 'favorite' | 'hidden'

export type Nft = BaseNft & {
  tags: Set<NftTag>
}

const _nftsState = atomFamily<BaseNft[], string>({
  key: '_Nfts',
  effects: (address: string) => [
    ({ setSelf }) => {
      const batchSize = 100

      let initialResolve = (_value: BaseNft[]) => {}
      let initialReject = (_reason?: any) => {}

      const initialPromise = new Promise<BaseNft[]>((resolve, reject) => {
        initialResolve = resolve
        initialReject = reject
      })

      setSelf(initialPromise)

      const workerPromise = spawn<SubscribeNfts>(new Worker(new URL('./worker', import.meta.url), { type: 'module' }))

      const subscriptionPromise = workerPromise.then(worker =>
        new Observable<BaseNft | { error: unknown }>(observer => worker(address, { batchSize }).subscribe(observer))
          .pipe(
            bufferTime(1000, null, batchSize),
            filter(nfts => nfts.length > 0),
            scan(
              (prev, nftsOrErrors) => {
                const errors = nftsOrErrors.filter((nft): nft is { error: unknown } => 'error' in nft).map(x => x.error)
                const nfts = nftsOrErrors.filter((nft): nft is BaseNft => !('error' in nft))

                errors.forEach(error => Sentry.captureException(error))

                return { nfts: [...prev.nfts, ...nfts], errors: [...prev.errors, ...errors] }
              },
              { nfts: [] as BaseNft[], errors: [] as unknown[] }
            ),
            tap(({ nfts }) => {
              initialResolve(nfts)
              setSelf(nfts)
            }),
            last(null, { nfts: [], errors: [] }),
            tap(({ errors }) => {
              if (errors.length > 0) {
                toast.error('Failed to fetch some NFTs', {
                  // Prevent spamming of toasts when multiple accounts fail to fetch NFTs
                  id: 'nfts-fetching-error',
                })
              }
            })
          )
          .subscribe({
            complete: () => {
              initialResolve([])
              void Thread.terminate(worker)
            },
            error: error => {
              Sentry.captureException(error)
              initialReject(error)
              void Thread.terminate(worker)
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
      [...get(_nftsState(address))]
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
