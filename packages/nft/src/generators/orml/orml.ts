import '@acala-network/types/index.js'
import '@acala-network/types/lookup/types-acala.js'
import { ApiPromise } from '@polkadot/api'
import { type ProviderInterface } from '@polkadot/rpc-provider/types'
import { type Bytes, type Option, type u32, type u64 } from '@polkadot/types-codec'
import { type OrmlNftClassInfo } from '@polkadot/types/lookup'
import type { CreateNftAsyncGenerator, IpfsMetadata, Nft } from '../../types.js'

type Config<T> = {
  chain: T
  provider: ProviderInterface
  getMetadata: (classId: u32, tokenId: u64, metadata: Bytes) => Promise<IpfsMetadata | undefined>
  getExternalLinks: (classId: u32, tokenId: u64) => Array<{ name: string; url: string }>
}

export const createOrmlNftAsyncGenerator = <const T extends string>({
  chain: chainId,
  provider,
  getMetadata,
  getExternalLinks: getExternalLink,
}: Config<T>): CreateNftAsyncGenerator<Nft<'orml', T>> =>
  async function* (address, { batchSize }) {
    const apiPromise = new ApiPromise({ provider, initWasm: false })
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
          storageKey.map(async ({ args: [_, classId, tokenId] }) => {
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

            const type = 'orml' as const
            const chain = chainId

            return {
              type,
              chain,
              id: `${type}-${chain}-${classId.toString()}-${tokenId.toString()}`,
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
