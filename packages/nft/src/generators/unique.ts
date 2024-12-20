import '@polkadot/api-augment/substrate'

import { request } from 'graphql-request'

import type { CreateNftAsyncGenerator, Nft } from '../types.js'
import { graphql } from '../generated/gql/unique/index.js'

export const createUniqueNetworkNftAsyncGenerator: CreateNftAsyncGenerator<Nft<'unique', 'unique'>> = async function* (
  address,
  { batchSize }
) {
  let offset = 0
  while (true) {
    const response = await request(
      'https://api-unique.uniquescan.io/v1/graphql',
      graphql(`
        query nfts($address: String, $offset: Int, $limit: Int) {
          tokens(
            offset: $offset
            limit: $limit
            where: {
              _or: [
                { owner: { _eq: $address } }
                { owner_normalized: { _eq: $address } }
                { tokens_owner: { _eq: $address } }
              ]
            }
          ) {
            data {
              token_id
              token_name
              image
              collection_id
              collection {
                name
                description
              }
            }
          }
        }
      `),
      {
        address: address.toLowerCase(),
        offset,
        limit: batchSize,
      }
    )

    if (!response.tokens.data || response.tokens.data.length === 0) {
      break
    }

    yield* await Promise.all(
      response.tokens.data?.map(async nft => {
        const type = 'unique' as const
        const chain = 'unique' as const
        return {
          type: 'unique' as const,
          chain: 'unique' as const,
          id: `${type}-${chain}-${nft.collection_id}-${nft.token_id}`,
          name: nft.token_name ?? undefined,
          description: nft.collection?.description ?? undefined,
          media: { url: typeof nft.image === 'string' ? nft.image : undefined },
          thumbnail: typeof nft.image === 'string' ? nft.image : undefined,
          serialNumber: nft.token_id,
          properties: undefined,
          externalLinks: [
            {
              name: 'Unique Scan',
              url: `https://uniquescan.io/unique/tokens/${nft.collection_id}/${nft.token_id}`,
            },
          ],
          collection: !nft.collection
            ? undefined
            : {
                id: nft.collection_id.toString(),
                name: nft.collection.name,
                totalSupply: undefined,
              },
        }
      }) ?? []
    )

    offset += batchSize
  }
}
