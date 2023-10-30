import { Chain } from '@domains/chains'
import { ChangeConfigDetails } from '@domains/multisig'
import { Address } from '@util/addresses'
import { gql, request } from 'graphql-request'

import { METADATA_SERVICE_URL } from '.'

interface InsertTxMetadataArgs {
  timepoint_height: number
  timepoint_index: number
  call_data: string
  call_hash: string
  chain: Chain
  multisig_address: Address
  proxy_address: Address
  description: string
  change_config_details?: ChangeConfigDetails
  team_id: string
}

interface InsertTxMetadataGqlVariables {
  timepoint_height: number
  timepoint_index: number
  call_data: string
  call_hash: string
  chain: string
  multisig_address: string
  proxy_address: string
  description: string
  change_config_details?: {
    newThreshold: number
    newMembers: string[]
  }
  team_id: string
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
    call_hash: args.call_hash,
    chain: args.chain.squidIds.chainData,
    multisig_address: args.multisig_address.toSs58(args.chain),
    proxy_address: args.proxy_address.toSs58(args.chain),
    description: args.description,
    change_config_details: args.change_config_details
      ? {
          newThreshold: args.change_config_details.newThreshold,
          newMembers: args.change_config_details.newMembers.map(address => address.toSs58(args.chain)),
        }
      : undefined,
    team_id: args.team_id,
  }

  const mutation = gql`
    mutation InsertTxMetadataValidated(
      $timepoint_height: Int!
      $timepoint_index: Int!
      $call_data: String!
      $call_hash: String!
      $chain: String!
      $multisig_address: String!
      $proxy_address: String!
      $description: String!
      $change_config_details: json
      $team_id: String!
    ) {
      InsertTxMetadataValidated(
        timepoint_height: $timepoint_height
        timepoint_index: $timepoint_index
        call_data: $call_data
        call_hash: $call_hash
        chain: $chain
        multisig_address: $multisig_address
        proxy_address: $proxy_address
        description: $description
        change_config_details: $change_config_details
        team_id: $team_id
      ) {
        success
        timestamp
      }
    }
  `

  return request(METADATA_SERVICE_URL, mutation, variables as Record<string, any>)
}
