import {
  createAcalaNftAsyncGenerator,
  createBitCountryNftAsyncGenerator,
  createEvmNftAsyncGenerator,
  createRmrk2NftAsyncGenerator,
  createStatemineNftAsyncGenerator,
  createUniqueNetworkNftAsyncGenerator,
  type Nft,
} from '@talismn/nft'
import { Observable } from 'rxjs'
import { expose } from 'threads/worker'

const subscribeNfts = (address: string, options: { batchSize: number }) =>
  new Observable<Nft | { error: unknown }>(observer => {
    const promises = (
      address.startsWith('0x')
        ? [createEvmNftAsyncGenerator]
        : [
            createAcalaNftAsyncGenerator,
            createBitCountryNftAsyncGenerator,
            createRmrk2NftAsyncGenerator,
            createStatemineNftAsyncGenerator,
            createUniqueNetworkNftAsyncGenerator,
          ]
    ).map(async createNftAsyncGenerator => {
      try {
        for await (const nft of createNftAsyncGenerator(address, { batchSize: options.batchSize })) {
          observer.next(nft)
        }
      } catch (error: unknown) {
        observer.next({ error })
      }
    })

    Promise.all(promises)
      .then(() => observer.complete())
      .catch(error => observer.error(error))
  })

export type SubscribeNfts = typeof subscribeNfts

expose(subscribeNfts)
