import request from 'graphql-request'
import { graphql } from '../../generated/gql/onfinality/index.js'
import type { CreateNftAsyncGenerator, Nft } from '../types.js'

export const createOnfinalityNftGenerator: (options?: {
  chaindataUrl: string
}) => CreateNftAsyncGenerator<Nft<'erc721' | 'erc1155', string>> = options =>
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

      const chainEtherscan = new Map<string, string | undefined>()
      const getEtherscanUrl = async (chainId: string, contractAddress: string, tokenId: string) => {
        chainEtherscan.set(
          chainId,
          chainEtherscan.get(chainId) ??
            (await fetch(
              new URL(
                `./evmNetworks/byId/${chainId}.json`,
                options?.chaindataUrl ?? 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/dist/'
              )
            )
              .then(x => x.json())
              .then(x => x.explorerUrl as string | undefined)
              .catch())
        )

        if (!chainEtherscan.has(chainId)) {
          return
        }

        return new URL(`./nft/${contractAddress}/${tokenId}`, chainEtherscan.get(chainId)).toString()
      }

      yield* await Promise.all(
        response.nfts?.edges
          .map(x => x.node)
          .filter(
            (
              x
            ): x is Omit<NonNullable<typeof x>, 'collection'> & {
              collection: NonNullable<NonNullable<typeof x>['collection']>
            } => x !== null && x !== undefined && x.collection !== null && x.collection !== undefined
          )
          .map(async nft => {
            const etherscanUrl = await getEtherscanUrl(
              nft.collection.networkId,
              nft.collection.contractAddress,
              nft.tokenId
            )
            return {
              id: `${nft.collection.contractType}-${nft.collection.networkId}-${nft.collection.contractAddress}-${nft.tokenId}`.toLowerCase(),
              type: nft.collection.contractType.toLowerCase() ?? '',
              chain: nft.collection.networkId ?? '',
              name: nft.metadata?.name ?? undefined,
              description: nft.metadata?.description ?? undefined,
              media: nft.metadata?.imageUri ?? undefined,
              thumbnail: nft.metadata?.imageUri ?? undefined,
              serialNumber: Number(nft.tokenId),
              properties: undefined,
              externalLinks: etherscanUrl === undefined ? undefined : [{ name: 'Etherscan', url: etherscanUrl }],
              collection: {
                id: nft.collection.contractAddress,
                name: nft.collection.name,
                totalSupply: Number(nft.collection.totalSupply),
              },
            } as Nft<'erc721' | 'erc1155', string>
          }) ?? []
      )

      if (!response.nfts?.pageInfo.hasNextPage) {
        break
      }

      after = response.nfts.pageInfo.endCursor
    }
  }
