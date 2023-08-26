import { Chain } from '@domains/chains'
import { ChangeConfigDetails } from '@domains/multisig'
import { Address } from '@util/addresses'
import { gql, request } from 'graphql-request'

import { METADATA_SERVICE_URL } from '.'

interface InsertTxMetadataArgs {
  timepoint_height: number
  timepoint_index: number
  call_data: string
  chain: Chain
  multisig: Address
  description: string
  change_config_details?: ChangeConfigDetails
}

interface InsertTxMetadataGqlVariables {
  timepoint_height: number
  timepoint_index: number
  call_data: string
  chain: string
  multisig: string
  description: string
  change_config_details?: {
    newThreshold: number
    newMembers: string[]
  }
}

interface InsertTxMetadataResponse {
  insert_tx_metadata: {
    affected_rows: number
    returning: {
      created: string
    }[]
  }
}

export async function insertTxMetadata(args: InsertTxMetadataArgs): Promise<InsertTxMetadataResponse> {
  const variables: InsertTxMetadataGqlVariables = {
    timepoint_height: args.timepoint_height,
    timepoint_index: args.timepoint_index,
    call_data: args.call_data,
    chain: args.chain.squidIds.chainData,
    multisig: args.multisig.toSs58(args.chain),
    description: args.description,
    change_config_details: args.change_config_details
      ? {
          newThreshold: args.change_config_details.newThreshold,
          newMembers: args.change_config_details.newMembers.map(address => address.toSs58(args.chain)),
        }
      : undefined,
  }

  const mutation = gql`
    mutation InsertTxMetadata(
      $timepoint_height: Int!
      $timepoint_index: Int!
      $call_data: String!
      $chain: String!
      $multisig: String!
      $description: String!
      $change_config_details: json
    ) {
      insert_tx_metadata(
        objects: {
          timepoint_height: $timepoint_height
          timepoint_index: $timepoint_index
          call_data: $call_data
          chain: $chain
          multisig: $multisig
          description: $description
          change_config_details: $change_config_details
        }
      ) {
        affected_rows
        returning {
          created
        }
      }
    }
  `

  return request(METADATA_SERVICE_URL, mutation, variables as Record<string, any>)
}
