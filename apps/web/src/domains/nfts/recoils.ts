import { type Nft } from '@talismn/nft'
import { atomFamily, DefaultValue, selectorFamily } from 'recoil'
import { spawn, Thread } from 'threads'
import { type SubscribeNfts } from './worker'
import { Observable, tap, catchError, bufferTime, filter } from 'rxjs'

export type NftCollection = NonNullable<Nft['collection']> & { items: Nft[] }

export const nftsState = atomFamily<Nft[], string>({
  key: 'Nfts',
  effects: (address: string) => [
    ({ setSelf }) => {
      const batchSize = 50

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
            }),
            catchError((error, caught) => {
              initialReject(error)
              return caught
            })
          )
          .subscribe({
            complete: async () => {
              initialResolve([])
              await initialPromise
              setSelf(self => (self instanceof DefaultValue || self.length === 0 ? [] : self))
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

export const nftCollectionsState = selectorFamily({
  key: 'NftCollections',
  get:
    (address: string) =>
    ({ get }) => {
      const map = new Map<string, NftCollection>()

      for (const nft of get(nftsState(address))) {
        if (nft.collection !== undefined) {
          if (map.has(nft.collection.id)) {
            map.get(nft.collection.id)?.items.push(nft)
          } else {
            map.set(nft.collection.id, { ...nft.collection, items: [nft] })
          }
        }
      }

      return map
    },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})
