import { Chain } from '@domains/chains'
import { ChangeConfigDetails, TxOffchainMetadata } from '@domains/multisig'
import { Address } from '@util/addresses'
import { gql, request } from 'graphql-request'

import { METADATA_SERVICE_URL } from '.'

interface TxMetadataByPkArgs {
  timepoint_height: number
  timepoint_index: number
  proxy_address: Address
  chain: Chain
}

interface TxMetadataByPkVariables {
  timepoint_height: number
  timepoint_index: number
  proxy_address: string
  chain: string
}

interface TxMetadataByPkResponseRaw {
  tx_metadata_by_pk: {
    call_data: string
    description: string
    change_config_details?: {
      newThreshold: number
      newMembers: string[]
    }
  } | null
}

// store nulls in a transient cache to avoid hitting the metadata service multiple times in the
// same session for the same key it doesn't have
const cache = new Map<string, TxOffchainMetadata | null>()

export async function getTxMetadataByPk(
  transactionID: string,
  args: TxMetadataByPkArgs
): Promise<TxOffchainMetadata | null> {
  const variables: TxMetadataByPkVariables = {
    timepoint_height: args.timepoint_height,
    timepoint_index: args.timepoint_index,
    proxy_address: args.proxy_address.toSs58(args.chain),
    chain: args.chain.squidIds.chainData,
  }
  if (cache.has(transactionID)) return cache.get(transactionID)!

  const valueFromMetadataService = await new Promise<TxOffchainMetadata | null>(async (resolve, reject) => {
    try {
      const query = gql`
        query TxMetadataByPk(
          $timepoint_height: Int!
          $timepoint_index: Int!
          $proxy_address: String!
          $chain: String!
        ) {
          tx_metadata_by_pk(
            proxy_address: $proxy_address
            timepoint_height: $timepoint_height
            timepoint_index: $timepoint_index
            chain: $chain
          ) {
            call_data
            description
            change_config_details
          }
        }
      `

      const res = (await request(
        METADATA_SERVICE_URL,
        query,
        variables as Record<string, any>
      )) as TxMetadataByPkResponseRaw
      if (res.tx_metadata_by_pk === null) {
        console.warn(`Metadata service has no value for ${transactionID}`)
        resolve(null)
        return
      }

      const changeConfigDetails: ChangeConfigDetails | undefined = res.tx_metadata_by_pk.change_config_details
        ? {
            newThreshold: res.tx_metadata_by_pk.change_config_details.newThreshold,
            newMembers: res.tx_metadata_by_pk.change_config_details.newMembers.map(m => {
              const address = Address.fromSs58(m)
              if (!address) throw new Error(`Invalid address returned from tx_metadata!`)
              return address
            }),
          }
        : undefined

      resolve({
        callData: res.tx_metadata_by_pk.call_data as `0x${string}`,
        description: res.tx_metadata_by_pk.description,
        changeConfigDetails,
      })
    } catch (error) {
      console.error(error)
      reject("Couldn't fetch metadata")
    }
  })

  // metadata not yet stored to metadata service
  if (!valueFromMetadataService) return null

  // only set to cache if there is a value
  cache.set(transactionID, valueFromMetadataService)
  return cache.get(transactionID)!
}
