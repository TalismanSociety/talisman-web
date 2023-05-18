import '@polkadot/api-augment/substrate'
import { encodeAddress } from '@polkadot/util-crypto'
import { request } from 'graphql-request'

import { graphql } from './gql/rmrk2/index'
import type { CreateNftAsyncGenerator, Rmrk2Nft } from './types'

export const createRmrk2NftAsyncGenerator: CreateNftAsyncGenerator<Rmrk2Nft> = async function* (
  address,
  { batchSize }
) {
  let offset = 0

  while (true) {
    const response = await request(
      'https://gql-rmrk2-prod.graphcdn.app',
      graphql(`
        query nfts($addresses: [String!], $limit: Int, $offset: Int) {
          nfts(limit: $limit, offset: $offset, where: { owner: { _in: $addresses }, burned: { _eq: "" } }) {
            id
            symbol
            metadata
            metadata_name
            metadata_description
            metadata_image
            children {
              id
              metadata_name
              metadata_image
              sn
            }
            resources {
              metadata_content_type
              thumb
              src
            }
            sn
            metadata_properties
            collection {
              id
              metadata_name
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

    yield* response.nfts.map(
      (nft): Rmrk2Nft => ({
        type: 'rmrk2',
        id: nft.id,
        name: nft.metadata_name ?? undefined,
        description: nft.metadata_description ?? undefined,
        media: nft.metadata_image || nft.resources[0]?.thumb || undefined,
        thumbnail: nft.resources[0]?.thumb || nft.metadata_image || undefined,
        serialNumber: Number(nft.sn),
        properties: nft.metadata_properties,
        externalLinks: [{ name: 'Singular', url: `https://singular.app/collectibles/${nft.id}` }],
        collection: !nft.collection
          ? undefined
          : {
              id: nft.collection.id,
              name: nft.collection.metadata_name ?? undefined,
              totalSupply: nft.collection.max,
            },
      })
    )

    offset += batchSize
  }
}
