import { createPublicClient, erc721Abi, http, isAddress as isEvmAddress } from 'viem'
import { type CreateNftAsyncGenerator, type Nft } from '../../types.js'

import chains from './chains.js'

const range = (start: number, stop: number, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

export const createEvmNftAsyncGenerator: CreateNftAsyncGenerator<Nft<'erc721', string>> = async function* (
  address,
  { batchSize }
) {
  if (!isEvmAddress(address)) {
    throw new Error(`Invalid EVM address: ${address}`)
  }

  for (const config of chains) {
    try {
      const publicClient = createPublicClient({ chain: config.chain, transport: http() })

      const balances = (await publicClient.multicall({
        contracts: Object.values(config.erc721ContractAddress).map(erc721Address => ({
          address: erc721Address,
          abi: erc721Abi,
          functionName: 'balanceOf',
          args: [address],
        })),
        allowFailure: false,
      })) as bigint[]

      const erc721AddressesWithBalance = balances
        .map((balance, index) => ({
          erc721Address: Object.values(config.erc721ContractAddress)[index]!,
          balance,
        }))
        .filter(x => x.balance > 0n)

      for (const { erc721Address, balance } of erc721AddressesWithBalance) {
        try {
          const wagmiContract = {
            address: erc721Address,
            abi: erc721Abi,
          } as const

          const [collectionName, totalSupply] = await publicClient.multicall({
            contracts: [
              { ...wagmiContract, functionName: 'name' },
              { ...wagmiContract, functionName: 'totalSupply' },
            ],
            allowFailure: false,
          })

          for (let start = 0; start < Number(balance); start += batchSize) {
            try {
              const target = start + batchSize
              const end = target < Number(balance) ? target : Number(balance) - 1

              const tokenIds = await publicClient.multicall({
                contracts: range(start, end).map(index => ({
                  ...wagmiContract,
                  functionName: 'tokenOfOwnerByIndex',
                  args: [address, BigInt(index)],
                })),
                allowFailure: false,
              })

              const tokenUris = (await publicClient.multicall({
                contracts: tokenIds.map(tokenId => ({ ...wagmiContract, functionName: 'tokenURI', args: [tokenId] })),
                allowFailure: false,
              })) as string[]

              const metadatum: Array<
                | {
                    name: string
                    description: string
                    image: string
                    animation_url?: string
                    attributes?: Array<{ trait_type: string; value: unknown }>
                  }
                | undefined
              > = await Promise.all(
                tokenUris.map(uri =>
                  fetch(uri.replace('ipfs://', 'https://talisman.mypinata.cloud/ipfs/'))
                    .then(x => x.json())
                    .catch(() => undefined)
                )
              )

              yield* tokenIds.map((tokenId, index) => {
                const metadata = metadatum[index]

                const type = 'erc721' as const
                const chain = config.chain.name
                const chainId = config.chain.id

                return {
                  type,
                  chain,
                  id: `${type}-${chainId}-${erc721Address}-${tokenId.toString()}`,
                  name: metadata?.name,
                  description: metadata?.description,
                  media: { url: metadata?.animation_url || metadata?.image || undefined },
                  thumbnail: metadata?.image || undefined,
                  serialNumber: Number(tokenId),
                  properties: !metadata?.attributes
                    ? undefined
                    : Object.fromEntries(metadata.attributes?.map(x => [x.trait_type, x.value])),
                  externalLinks:
                    config.chain.blockExplorers?.default !== undefined
                      ? [
                          {
                            name: config.chain.blockExplorers.default.name,
                            url: `${config.chain.blockExplorers.default.url}/token/${erc721Address}?a=${tokenId}`,
                          },
                        ]
                      : undefined,
                  collection: { id: erc721Address, name: collectionName, totalSupply: Number(totalSupply) },
                }
              })
            } catch (error) {
              yield new Error(`Fail to fetch ${erc721Address} NFTs batch`, { cause: error })
            }
          }
        } catch (error) {
          yield new Error(`Fail to fetch ${erc721Address} NFTs`, { cause: error })
        }
      }
    } catch (error) {
      yield new Error(`Fail to fetch ${config.chain.name} NFTs`, { cause: error })
    }
  }
}
