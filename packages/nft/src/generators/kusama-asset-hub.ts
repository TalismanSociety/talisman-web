import '@polkadot/api-augment/substrate'
import { encodeAddress } from '@polkadot/util-crypto'
import { request } from 'graphql-request'

import { graphql } from '../../generated/gql/kusama-asset-hub/index.js'
import type { CreateNftAsyncGenerator, Nft } from '../types.js'

export const createKusamaAssetHubNftAsyncGenerator: CreateNftAsyncGenerator<Nft<'asset-hub', 'kusama'>> =
  async function* (address, { batchSize }) {
    let offset = 0

    while (true) {
      const response = await request(
        'https://query-stick.stellate.sh/',
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
          address: encodeAddress(address, 2),
        }
      )

      if (response.collections.length === 0) {
        break
      }

      yield* response.collections.flatMap(collection =>
        collection.nfts.map((nft): Nft<'asset-hub', 'kusama'> => {
          const type = 'asset-hub' as const
          const chain = 'kusama' as const

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
            externalLinks: [{ name: 'Kodadot', url: `https://kodadot.xyz/ksm/gallery/${nft.id}` }],
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
