import * as Sentry from '@sentry/react'
import { type Nft } from '@talismn/nft'
import { atomFamily, DefaultValue, selectorFamily } from 'recoil'
import { bufferTime, filter, Observable, tap } from 'rxjs'
import { spawn, Thread } from 'threads'
import { type SubscribeNfts } from './worker'

const _nftsState = atomFamily<Nft[], string>({
  key: '_Nfts',
  effects: (address: string) => [
    ({ setSelf }) => {
      const batchSize = 25

      let initialResolve = (value: Nft[]) => {}
      let initialReject = (reason?: any) => {}

      const initialPromise = new Promise<Nft[]>((resolve, reject) => {
        initialResolve = resolve
        initialReject = reject
      })

      setSelf(initialPromise)

      const workerPromise = spawn<SubscribeNfts>(new Worker(new URL('./worker', import.meta.url)))

      const subscriptionPromise = workerPromise.then(worker =>
        new Observable<Nft>(observer => worker(address, { batchSize }).subscribe(observer))
          .pipe(
            bufferTime(1000, null, batchSize),
            filter(nfts => nfts.length > 0),
            tap(async nfts => {
              initialResolve(nfts)
              await initialPromise
              setSelf(self => [...(self instanceof DefaultValue ? [] : self), ...nfts])
            })
          )
          .subscribe({
            complete: async () => {
              initialResolve([])
              await initialPromise
              setSelf(self => (self instanceof DefaultValue || self.length === 0 ? [] : self))
              Thread.terminate(worker)
            },
            error: error => {
              Sentry.captureException(error)
              initialReject(error)
              Thread.terminate(worker)
            },
          })
      )

      return () => {
        workerPromise.then(worker => Thread.terminate(worker))
        subscriptionPromise.then(subscription => subscription.unsubscribe())
      }
    },
  ],
})

export const nftsState = selectorFamily({
  key: 'Nfts',
  get:
    (address: string) =>
    ({ get }) =>
      [...get(_nftsState(address))].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

type Type = string
type Chain = string
type CollectionId = string
export type CollectionKey = `${Type}-${Chain}-${CollectionId}` | 'unknown'
export type NftCollection = NonNullable<Nft['collection']> & { key: CollectionKey; items: Nft[] }
type CollectionMap = ReadonlyMap<CollectionKey, NftCollection>

export const getNftCollectionKey = (nft: Nft) =>
  `${nft.type}-${nft.chain}-${nft.collection?.id}` satisfies CollectionKey

export const nftCollectionMapState = selectorFamily({
  key: 'NftCollectionMap',
  get:
    (address: string) =>
    ({ get }) => {
      const map = new Map<CollectionKey, NftCollection>()

      for (const nft of get(nftsState(address))) {
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

export const nftCollectionsState = selectorFamily({
  key: `NftCollections`,
  get:
    (address: string) =>
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
