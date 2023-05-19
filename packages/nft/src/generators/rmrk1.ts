import '@polkadot/api-augment/substrate'
import { encodeAddress } from '@polkadot/util-crypto'
import { request } from 'graphql-request'
import { graphql } from '../../generated/gql/rmrk1/index.js'
import type { CreateNftAsyncGenerator, Nft } from '../types.js'

export const createRmrk1NftAsyncGenerator: CreateNftAsyncGenerator<Nft<'rmrk1', 'kusama'>> = async function* (
  address,
  { batchSize }
) {
  let offset = 0

  while (true) {
    const response = await request(
      'https://gql-rmrk1.rmrk.link/v1/graphql',
      graphql(`
        query nfts($addresses: [String!], $limit: Int, $offset: Int) {
          nfts(limit: $limit, offset: $offset, where: { owner: { _in: $addresses }, burned: { _eq: "" } }) {
            id
            metadata_name
            metadata_description
            metadata_animation_url
            metadata_image
            sn
            collection {
              id
              name
              max
            }
          }
        }
      `),
      { addresses: [encodeAddress(address, 2)], limit: batchSize, offset }
    )

    if (response.nfts.length === 0) {
      break
    }

    yield* response.nfts.map(nft => ({
      id: nft.id,
      type: 'rmrk1' as const,
      chain: 'kusama' as const,
      name: nft.metadata_name ?? undefined,
      description: nft.metadata_description ?? undefined,
      media: nft.metadata_animation_url || nft.metadata_image || undefined,
      thumbnail: nft.metadata_image || nft.metadata_animation_url || undefined,
      serialNumber: Number(nft.sn),
      properties: undefined,
      externalLinks: [{ name: 'Singular', url: `https://singular.rmrk.app/collectibles/${nft.id}` }],
      collection: !nft.collection
        ? undefined
        : {
            id: nft.collection.id,
            name: nft.collection.name,
            totalSupply: nft.collection.max,
          },
    }))

    offset += batchSize
  }
}
