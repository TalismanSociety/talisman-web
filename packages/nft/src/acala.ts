import '@acala-network/types'
import '@acala-network/types/lookup/types-acala'

import { ApiPromise, WsProvider } from '@polkadot/api'
import { type Option } from '@polkadot/types-codec'
import { OrmlNftClassInfo } from '@polkadot/types/lookup'
import { hexToString } from '@polkadot/util'

import type { AcalaNft, CreateNftAsyncGenerator, IpfsMetadata } from './types'

const fetchNftFromIpfs = (metadata: string): Promise<IpfsMetadata> =>
  fetch(new URL(metadata + '/metadata.json', 'https://talisman.mypinata.cloud/ipfs/')).then(res => res.json())

export const createAcalaNftAsyncGenerator: CreateNftAsyncGenerator<AcalaNft> = async function* (
  address,
  { batchSize }
) {
  const apiPromise = new ApiPromise({ provider: new WsProvider('wss://acala-rpc-0.aca-api.network') })
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
        storageKey.map(async ({ args: [_, classId, tokenId] }): Promise<AcalaNft | undefined> => {
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

          const classMetadataHex = hexToString(ormlNftClass.metadata.toHex())
          const tokenMetadataHex = hexToString(ormlNftToken.metadata.toHex())

          const [classMetadata, tokenMetadata] = await Promise.all([
            classMetadataHex === '' ? Promise.resolve(undefined) : fetchNftFromIpfs(classMetadataHex),
            tokenMetadataHex === '' ? Promise.resolve(undefined) : fetchNftFromIpfs(tokenMetadataHex),
          ])

          return {
            type: 'acala',
            id: `${classId.toString()}-${tokenId.toString()}`,
            name: tokenMetadata?.name ?? classMetadata?.name ?? '',
            description: tokenMetadata?.name ?? classMetadata?.name ?? '',
            media: tokenMetadata?.image ?? classMetadata?.image,
            serialNumber: tokenId.toNumber(),
            collection: {
              id: classId.toString(),
              name: classMetadata?.name,
              maxSupply: ormlNftClass.totalIssuance.toNumber(),
            },
            attributes: undefined,
          }
        })
      ).then(x => x.filter((y): y is Exclude<typeof y, undefined> => x !== undefined))
    }
  } finally {
    await apiPromise.disconnect()
  }
}
