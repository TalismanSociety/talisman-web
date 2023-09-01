import '@polkadot/api-augment/substrate'
import { encodeAddress } from '@polkadot/util-crypto'
import { request } from 'graphql-request'
import { graphql } from '../../generated/gql/statemine/index.js'
import type { CreateNftAsyncGenerator, IpfsMetadata, Nft } from '../types.js'

const fetchIpfsMetadata = (metadata: string): Promise<IpfsMetadata> =>
  fetch(
    new URL(
      // Some metadata are corrupted and contains an actual IPFS link
      metadata.replace('ipfs://ipfs/', ''),
      'https://talisman.mypinata.cloud/ipfs/'
    )
  ).then(res => res.json())

export const createStatemineNftAsyncGenerator: CreateNftAsyncGenerator<Nft<'substrate-unique', 'statemine'>> =
  async function* (address, { batchSize }) {
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
        response.uniqueInstancesConnection.edges.map(async nft => {
          const [classMetadata, instanceMetadata] = await Promise.all([
            nft.node.uniqueClass.metadata
              ? fetchIpfsMetadata(nft.node.uniqueClass.metadata)
              : Promise.resolve(undefined),
            nft.node.metadata ? fetchIpfsMetadata(nft.node.metadata) : Promise.resolve(undefined),
          ])

          const type = 'substrate-unique' as const
          const chain = 'statemine' as const

          return {
            type,
            chain,
            id: `${type}-${chain}-${nft.node.id}`,
            name: instanceMetadata?.name || nft.node.innerID.toString(),
            description: instanceMetadata?.description || classMetadata?.description,
            media: instanceMetadata?.image || classMetadata?.image,
            thumbnail: instanceMetadata?.image || classMetadata?.image,
            serialNumber: nft.node.innerID,
            properties: undefined,
            externalLinks: undefined,
            collection: {
              id: nft.node.uniqueClass.id,
              name: classMetadata?.name,
              totalSupply: nft.node.uniqueClass.maxSupply ?? undefined,
            },
          }
        })
      )

      if (!response.uniqueInstancesConnection.pageInfo.hasNextPage) {
        break
      }

      after = response.uniqueInstancesConnection.pageInfo.endCursor
    }
  }
