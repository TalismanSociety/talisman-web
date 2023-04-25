import '@polkadot/api-augment/substrate'
import { encodeAddress } from '@polkadot/util-crypto'
import { request } from 'graphql-request'
import { graphql } from './gql/statemine/index'
import type { CreateNftAsyncGenerator, IpfsMetadata, SubstrateNft } from './types'

const fetchIpfsMetadata = (metadata: string): Promise<IpfsMetadata> =>
  fetch(new URL(metadata, 'https://talisman.mypinata.cloud/ipfs/')).then(res => res.json())

export const createStatemineNftAsyncGenerator: CreateNftAsyncGenerator<SubstrateNft> = async function* (
  address,
  { batchSize }
) {
  let after: string
  while (true) {
    const response = await request(
      'https://squid.subsquid.io/statemine-uniques/v/3/graphql',
      graphql(`
        query nfts($addresses: [String!], $after: String, $first: Int) {
          uniqueInstancesConnection(
            orderBy: id_ASC
            after: $after
            first: $first
            where: { owner: { id_in: $addresses } }
          ) {
            edges {
              node {
                id
                innerID
                metadata
                price
                uniqueClass {
                  id
                  metadata
                  maxSupply
                }
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      `),
      {
        addresses: [encodeAddress(address, 2)],
        // @ts-expect-error
        after,
        first: batchSize,
      }
    )

    yield* await Promise.all(
      response.uniqueInstancesConnection.edges.map(async (nft): Promise<SubstrateNft> => {
        const [classMetadata, instanceMetadata] = await Promise.all([
          nft.node.uniqueClass.metadata ? fetchIpfsMetadata(nft.node.uniqueClass.metadata) : Promise.resolve(undefined),
          nft.node.metadata ? fetchIpfsMetadata(nft.node.metadata) : Promise.resolve(undefined),
        ])

        return {
          type: 'substrate',
          chain: 'statemine',
          id: nft.node.id,
          name: instanceMetadata?.name,
          description: instanceMetadata?.description,
          media: instanceMetadata?.image,
          thumbnail: instanceMetadata?.image,
          serialNumber: nft.node.innerID,
          collection: {
            id: nft.node.uniqueClass.id,
            name: classMetadata?.name,
            maxSupply: nft.node.uniqueClass.maxSupply ?? undefined,
          },
          attributes: undefined,
        }
      })
    )

    if (!response.uniqueInstancesConnection.pageInfo.hasNextPage) {
      break
    }

    after = response.uniqueInstancesConnection.pageInfo.endCursor
  }
}
