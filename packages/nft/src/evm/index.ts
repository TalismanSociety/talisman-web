import { createPublicClient, http } from 'viem'
import { CreateNftAsyncGenerator, EvmNft } from '../types'
import { erc721Abi } from './abi'
import chains from './chains'

const range = (start: number, stop: number, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

const isEvmAddress = (address: string): address is `0x${string}` => address.startsWith('0x')

export const createEvmNftAsyncGenerator: CreateNftAsyncGenerator<EvmNft> = async function* (address, { batchSize }) {
  if (!isEvmAddress(address)) {
    throw new Error(`Invalid EVM address: ${address}`)
  }

  for (const config of chains) {
    const publicClient = createPublicClient({ chain: config.chain, transport: http() })

    const balances = await publicClient.multicall({
      contracts: Object.values(config.erc721ContractAddress).map(erc721Address => ({
        address: erc721Address,
        abi: erc721Abi,
        functionName: 'balanceOf',
        args: [address],
      })),
      allowFailure: false,
    })
    const erc721AddressesWithBalance = balances
      .map((balance, index) => ({
        erc721Address: Object.values(config.erc721ContractAddress)[index]!,
        balance,
      }))
      .filter(x => x.balance > 0n)

    for (const { erc721Address, balance } of erc721AddressesWithBalance) {
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

        const tokenUris = await publicClient.multicall({
          contracts: tokenIds.map(tokenId => ({ ...wagmiContract, functionName: 'tokenURI', args: [tokenId] })),
          allowFailure: false,
        })

        const metadatum: Array<{
          name: string
          description: string
          image: string
          animation_url?: string
          attributes?: Array<{ trait_type: string; value: unknown }>
        }> = await Promise.all(
          tokenUris.map(uri =>
            fetch(uri.replace('ipfs://', 'https://talisman.mypinata.cloud/ipfs/')).then(x => x.json())
          )
        )

        yield* tokenIds.map((tokenId, index) => {
          const metadata = metadatum[index]

          return {
            type: 'evm' as const,
            chain: config.chain.name,
            id: `${erc721Address}-${tokenId.toString()}`,
            name: metadata?.name,
            description: metadata?.description,
            media: metadata?.animation_url || metadata?.image || undefined,
            thumbnail: metadata?.image || undefined,
            serialNumber: Number(tokenId),
            properties: !metadata?.attributes
              ? undefined
              : Object.fromEntries(metadata.attributes?.map(x => [x.trait_type, x.value])),
            collection: { id: erc721Address, name: collectionName, maxSupply: Number(totalSupply) },
          }
        })
      }
    }
  }
}
