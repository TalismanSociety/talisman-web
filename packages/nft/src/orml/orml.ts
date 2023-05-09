import '@acala-network/types'
import '@acala-network/types/lookup/types-acala'

import { ApiPromise, WsProvider } from '@polkadot/api'
import { type Option, type Bytes, type u32, type u64 } from '@polkadot/types-codec'
import { OrmlNftClassInfo } from '@polkadot/types/lookup'

import type { CreateNftAsyncGenerator, IpfsMetadata, OrmlNft } from '../types'

type Config<T> = {
  chain: T
  endpoint: string
  getMetadata: (classId: u32, tokenId: u64, metadata: Bytes) => Promise<IpfsMetadata | undefined>
  getExternalLinks: (classId: u32, tokenId: u64) => Array<{ name: string; url: string }>
}

export const createOrmlNftAsyncGenerator = <const T extends string>({
  chain: chainId,
  endpoint,
  getMetadata,
  getExternalLinks: getExternalLink,
}: Config<T>): CreateNftAsyncGenerator<OrmlNft<T>> =>
  async function* (address, { batchSize }) {
    const apiPromise = new ApiPromise({ provider: new WsProvider(endpoint) })
    try {
      let startKey: string
      while (true) {
        const api = await apiPromise.isReadyOrError
        const storageKey = await api.query.ormlNFT.tokensByOwner.keysPaged({
          args: [address],
          pageSize: batchSize,
          // @ts-expect-error
          startKey,
        })

        const last = storageKey.at(-1)
        if (last === undefined) {
          break
        }

        startKey = api.query.ormlNFT.tokensByOwner.key(...last.args)

        const classMap = new Map<string, Option<OrmlNftClassInfo>>()

        yield* await Promise.all(
          storageKey.map(async ({ args: [_, classId, tokenId] }): Promise<OrmlNft<T> | undefined> => {
            const [ormlNftClassOption, ormlNftTokenOption] = await Promise.all([
              classMap.get(classId.toString()) ??
                api.query.ormlNFT.classes(classId).then(x => {
                  classMap.set(classId.toString(), x)
                  return x
                }),
              api.query.ormlNFT.tokens(classId, tokenId),
            ])

            if (ormlNftClassOption.isNone || ormlNftTokenOption.isNone) {
              return undefined
            }

            const ormlNftClass = ormlNftClassOption.unwrap()
            const ormlNftToken = ormlNftTokenOption.unwrap()

            const [classMetadata, tokenMetadata] = await Promise.all([
              getMetadata(classId, tokenId, ormlNftClass.metadata),
              getMetadata(classId, tokenId, ormlNftToken.metadata),
            ])

            return {
              type: 'orml',
              chain: chainId,
              id: `${classId.toString()}-${tokenId.toString()}`,
              name: tokenMetadata?.name || classMetadata?.name,
              description: tokenMetadata?.name || classMetadata?.name,
              media: tokenMetadata?.image || classMetadata?.image,
              thumbnail: tokenMetadata?.image || classMetadata?.image,
              serialNumber: tokenId.toNumber(),
              properties: undefined,
              externalLinks: getExternalLink(classId, tokenId),
              collection: {
                id: classId.toString(),
                name: classMetadata?.name,
                totalSupply: ormlNftClass.totalIssuance.toNumber(),
              },
            }
          })
        ).then(x => x.filter((y): y is Exclude<typeof y, undefined> => x !== undefined))
      }
    } finally {
      await apiPromise.disconnect()
    }
  }
