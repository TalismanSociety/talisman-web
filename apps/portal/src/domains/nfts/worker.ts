import {
  createAcalaNftAsyncGenerator,
  createArtZeroNftAsyncGenerator,
  createBitCountryNftAsyncGenerator,
  createRmrk2NftAsyncGenerator,
  createSimpleHashNftAsyncGenerator,
  createSubstrateNftKusamaAssetHubNftAsyncGenerator,
  createSubstrateNftPolkadotAssetHubNftAsyncGenerator,
  createUniqueNetworkNftAsyncGenerator,
  type Nft,
} from '@talismn/nft'
import { Observable } from 'rxjs'
import { expose } from 'threads/worker'

const subscribeNfts = (
  address: string,
  options: { batchSize: number; simpleHashApiToken: string; acalaRpc: string; bitcountryRpc: string }
) =>
  new Observable<Nft | { error: unknown }>(observer => {
    const promises = (
      address.startsWith('0x')
        ? [createSimpleHashNftAsyncGenerator({ apiToken: options.simpleHashApiToken })]
        : [
            createAcalaNftAsyncGenerator({ rpc: options.acalaRpc }),
            createBitCountryNftAsyncGenerator({ rpc: options.bitcountryRpc }),
            createRmrk2NftAsyncGenerator,
            createSubstrateNftKusamaAssetHubNftAsyncGenerator,
            createSubstrateNftPolkadotAssetHubNftAsyncGenerator,
            createUniqueNetworkNftAsyncGenerator,
            createArtZeroNftAsyncGenerator,
          ]
    ).map(async createNftAsyncGenerator => {
      try {
        for await (const nft of createNftAsyncGenerator(address, { batchSize: options.batchSize })) {
          if (nft instanceof Error) {
            observer.next({ error: nft })
          } else {
            observer.next(nft)
          }
        }
      } catch (error: unknown) {
        observer.next({ error })
      }
    })

    Promise.all(promises)
      .catch(error => observer.error(error))
      .finally(() => observer.complete())
  })

export type SubscribeNfts = typeof subscribeNfts

expose(subscribeNfts)
