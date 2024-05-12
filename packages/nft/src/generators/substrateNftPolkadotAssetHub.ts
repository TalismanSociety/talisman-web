import { graphql } from '../../generated/gql/substrateNftPolkadotAssetHub/index.js'
import type { CreateNftAsyncGenerator, Nft } from '../types.js'
import '@polkadot/api-augment/substrate'
import { encodeAddress } from '@polkadot/util-crypto'
import { request } from 'graphql-request'

export const createSubstrateNftPolkadotAssetHubNftAsyncGenerator: CreateNftAsyncGenerator<
  Nft<'substrate-nft', 'polkadot-asset-hub'>
> = async function* (address, { batchSize }) {
  let offset = 0

  while (true) {
    const response = await request(
      'https://ahp.gql.api.kodadot.xyz/',
      graphql(`
        query collectionListWithSearch(
          $first: Int!
          $offset: Int
          $orderBy: [CollectionEntityOrderByInput!] = [blockNumber_DESC]
          $address: String!
        ) {
          collections: collectionEntities(
            limit: $first
            offset: $offset
            orderBy: $orderBy
            where: { nfts_some: { burned_eq: false, currentOwner_eq: $address } }
          ) {
            id
            name
            max
            nfts(where: { burned_eq: false, currentOwner_eq: $address }) {
              id
              sn
              currentOwner
              meta {
                name
                description
                image
                attributes {
                  trait
                  value
                }
              }
            }
          }
        }
      `),
      {
        first: batchSize,
        offset,
        address: encodeAddress(address, 0),
      }
    )

    if (response.collections.length === 0) {
      break
    }

    yield* response.collections.flatMap(collection =>
      collection.nfts.map((nft): Nft<'substrate-nft', 'polkadot-asset-hub'> => {
        const type = 'substrate-nft' as const
        const chain = 'polkadot-asset-hub' as const

        return {
          type,
          chain,
          id: `${type}-${chain}-${nft.id}`,
          name: nft.meta?.name ?? undefined,
          description: nft.meta?.description ?? undefined,
          media: { url: nft.meta?.image || undefined },
          thumbnail: nft.meta?.image || undefined,
          serialNumber: Number(nft.sn),
          properties: nft.meta?.attributes
            ? Object.fromEntries(
                (nft.meta?.attributes ?? []).flatMap(({ trait, value }) => (trait ? [[trait, value]] : []))
              )
            : undefined,
          externalLinks: [{ name: 'Kodadot', url: `https://kodadot.xyz/ahp/gallery/${nft.id}` }],
          collection: !collection
            ? undefined
            : {
                id: collection.id,
                name: collection.name ?? undefined,
                totalSupply: collection.max ?? undefined,
              },
        }
      })
    )

    offset += batchSize
  }
}
