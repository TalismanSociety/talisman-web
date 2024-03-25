import '@polkadot/api-augment/substrate'
import { encodeAddress } from '@polkadot/util-crypto'
import { request } from 'graphql-request'

import { graphql } from '../../generated/gql/rmrk2/index.js'
import type { CreateNftAsyncGenerator, Nft } from '../types.js'

export const createRmrk2NftAsyncGenerator: CreateNftAsyncGenerator<Nft<'rmrk2', 'kusama'>> = async function* (
  address,
  { batchSize }
) {
  let offset = 0

  while (true) {
    const response = await request(
      'https://ksm.gql.api.kodadot.xyz/',
      graphql(`
        query nftListWithSearch(
          $first: Int!
          $offset: Int
          $orderBy: [NFTEntityOrderByInput!] = [blockNumber_DESC]
          $search: [NFTEntityWhereInput!]
        ) {
          nfts: nftEntities(
            limit: $first
            offset: $offset
            orderBy: $orderBy
            where: { burned_eq: false, metadata_not_eq: "", AND: $search }
          ) {
            id
            sn
            currentOwner
            collection {
              id
              name
              max
            }
            meta {
              name
              description
              image
              attributes {
                trait
                value
              }
            }
            resources {
              thumb
            }
          }
        }
      `),
      {
        first: batchSize,
        offset,
        search: [{ currentOwner_eq: encodeAddress(address, 2) }],
      }
    )

    if (response.nfts.length === 0) {
      break
    }

    yield* response.nfts.map((nft): Nft<'rmrk2', 'kusama'> => {
      const type = 'rmrk2' as const
      const chain = 'kusama' as const

      return {
        type,
        chain,
        id: `${type}-${chain}-${nft.id}`,
        name: nft.meta?.name ?? undefined,
        description: nft.meta?.description ?? undefined,
        media: { url: nft.meta?.image || nft.resources[0]?.thumb || undefined },
        thumbnail: nft.resources[0]?.thumb || nft.meta?.image || undefined,
        serialNumber: Number(nft.sn),
        properties: nft.meta?.attributes
          ? Object.fromEntries(
              (nft.meta?.attributes ?? []).flatMap(({ trait, value }) => (trait ? [[trait, value]] : []))
            )
          : undefined,
        externalLinks: [
          {
            name: 'Singular',
            url: `https://singular.app/collectibles/kusama/${[nft.collection?.id, nft.id]
              .filter((x): x is NonNullable<typeof x> => x !== undefined)
              .join('/')}`,
          },
          { name: 'Kodadot', url: `https://kodadot.xyz/ksm/gallery/${nft.id}` },
        ],
        collection: !nft.collection
          ? undefined
          : {
              id: nft.collection.id,
              name: nft.collection.name ?? undefined,
              totalSupply: nft.collection.max,
            },
      }
    })

    offset += batchSize
  }
}
