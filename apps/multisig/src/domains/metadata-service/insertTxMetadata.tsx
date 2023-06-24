import { ChangeConfigDetails } from '@domains/multisig'
import { gql, request } from 'graphql-request'

import { METADATA_SERVICE_URL } from '.'

interface InsertTxMetadataVariables {
  timepoint_height: number
  timepoint_index: number
  call_data: string
  chain: string
  multisig: string
  description: string
  change_config_details?: ChangeConfigDetails
}

interface InsertTxMetadataResponse {
  insert_tx_metadata: {
    affected_rows: number
    returning: {
      created: string
    }[]
  }
}

export async function insertTxMetadata(variables: InsertTxMetadataVariables): Promise<InsertTxMetadataResponse> {
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
