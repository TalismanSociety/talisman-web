import request from 'graphql-request'
import { graphql } from '../../generated/gql/onfinality/index.js'
import type { CreateNftAsyncGenerator, Nft } from '../types.js'

export const createOnfinalityNftGenerator: CreateNftAsyncGenerator<Nft<'erc721' | 'erc1155', string>> =
  async function* (address, { batchSize }) {
    let after: string
    while (true) {
      const response = await request(
        'https://nft-beta.api.onfinality.io/public',
        graphql(`
          query nfts($address: String!, $after: Cursor, $first: Int) {
            nfts(after: $after, first: $first, filter: { currentOwner: { equalTo: $address } }) {
              edges {
                node {
                  id
                  tokenId
                  collection {
                    id
                    name
                    contractType
                    contractAddress
                    networkId
                    totalSupply
                  }
                  metadata {
                    name
                    description
                    imageUri
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `),
        {
          address: address.toLowerCase(),
          // @ts-expect-error
          after,
          first: batchSize,
        }
      )

      yield* response.nfts?.edges
        .map(x => x.node)
        .filter((x): x is NonNullable<typeof x> => x !== null && x !== undefined)
        .map(
          nft =>
            ({
              id: `${nft.collection?.contractType}-${nft.collection?.networkId}-${nft.collection?.contractAddress}-${nft.tokenId}`.toLowerCase(),
              type: nft.collection?.contractType.toLowerCase() ?? '',
              chain: nft.collection?.networkId ?? '',
              name: nft.metadata?.name ?? undefined,
              description: nft.metadata?.description ?? undefined,
              media: nft.metadata?.imageUri ?? undefined,
              thumbnail: nft.metadata?.imageUri ?? undefined,
              serialNumber: Number(nft.tokenId),
              properties: undefined,
              externalLinks: undefined,
              collection: !nft.collection
                ? undefined
                : {
                    id: nft.collection.id,
                    name: nft.collection.name,
                    totalSupply: Number(nft.collection.totalSupply),
                  },
            } as Nft<'erc721' | 'erc1155', string>)
        ) ?? []

      if (!response.nfts?.pageInfo.hasNextPage) {
        break
      }

      after = response.nfts.pageInfo.endCursor
    }
  }
