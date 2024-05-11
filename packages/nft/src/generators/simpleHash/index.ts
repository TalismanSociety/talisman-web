import * as viemChains from 'viem/chains'
import type { CreateNftAsyncGenerator, Nft } from '../../types.js'
import type { Chain, Nft as SimpleHashNft } from './types.js'

const URL_ENDPOINT = 'https://api.simplehash.com/api/v0/'

export const createSimpleHashNftAsyncGenerator = (options: {
  apiToken: string
}): CreateNftAsyncGenerator<Nft<'erc721' | 'erc1155', string>> =>
  async function* (address, { batchSize }) {
    const headers = { 'X-API-KEY': options.apiToken }

    const chainsResponse = await fetch(new URL('./chains', URL_ENDPOINT), {
      headers,
    })

    if (!chainsResponse.ok) {
      throw new Error('Failed to fetch chains', { cause: chainsResponse })
    }

    const chains = (await chainsResponse.json()) as Array<Chain>

    const nftsUrl = new URL('./nfts/owners_v2', URL_ENDPOINT)

    nftsUrl.searchParams.set(
      'chains',
      chains
        .filter(chain => !chain.is_testnet)
        .map(chain => chain.chain)
        .join(',')
    )
    nftsUrl.searchParams.set('wallet_addresses', address)
    nftsUrl.searchParams.set('filters', 'spam_score__lte=50')
    nftsUrl.searchParams.set('limit', Math.max(batchSize, 50).toString())

    while (true) {
      const nftsResponse = await fetch(nftsUrl, {
        headers,
      })

      if (!nftsResponse.ok) {
        throw new Error('Failed to fetch NFTs', { cause: nftsResponse })
      }

      const nftsResult = (await nftsResponse.json()) as {
        next_cursor: string | null
        next: string | null
        previous: string | null
        nfts: SimpleHashNft[]
      }

      yield* nftsResult.nfts.map((nft): Nft<'erc721' | 'erc1155', string> => {
        const chain = chains.find(x => x.chain === nft.chain)
        const viemChain =
          chain === undefined
            ? undefined
            : Object.values(viemChains).find(x => 'id' in x && x.id === chain.eip155_network_id)

        return {
          type: nft.contract.type.toLowerCase() as 'erc721' | 'erc1155',
          chain: nft.chain,
          id: nft.nft_id,
          name: nft.name ?? undefined,
          description: nft.description ?? undefined,
          media: {
            url: nft.model_url ?? nft.video_url ?? nft.audio_url ?? nft.image_url ?? nft.other_url ?? undefined,
          },
          thumbnail: nft.previews.image_medium_url ?? undefined,
          serialNumber: Number.isNaN(Number(nft.token_id)) ? undefined : Number(nft.token_id),
          properties: Object.fromEntries(
            nft.extra_metadata.attributes.map(attribute => [attribute.trait_type, attribute.value] as const)
          ),
          externalLinks: [
            nft.external_url === null ? undefined : { name: 'Homepage', url: nft.external_url },
            viemChain === undefined || !('blockExplorers' in viemChain && viemChain.blockExplorers !== undefined)
              ? undefined
              : {
                  name: viemChain.blockExplorers.default.name,
                  url: `${viemChain.blockExplorers.default.url}/nft/${nft.contract_address}/${nft.token_id}`,
                },
          ].filter((x): x is NonNullable<typeof x> => x !== undefined),
          collection:
            nft.collection === null
              ? undefined
              : {
                  id: nft.collection.collection_id ?? undefined,
                  name: nft.collection.name ?? undefined,
                  totalSupply: nft.collection.total_quantity ?? undefined,
                },
        }
      })

      if (nftsResult.next_cursor === null) {
        break
      }

      nftsUrl.searchParams.set('cursor', nftsResult.next_cursor)
    }
  }
