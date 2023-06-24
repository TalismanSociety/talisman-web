import { ChangeConfigDetails, TxOffchainMetadata } from '@domains/multisig'
import { gql, request } from 'graphql-request'

import { METADATA_SERVICE_URL } from '.'

interface TxMetadataByPkVariables {
  timepoint_height: number
  timepoint_index: number
  multisig: string
  chain: string
}

interface TxMetadataByPkResponseRaw {
  tx_metadata_by_pk: {
    call_data: string
    description: string
    change_config_details?: ChangeConfigDetails
  } | null
}

export async function getTxMetadataByPk(variables: TxMetadataByPkVariables): Promise<TxOffchainMetadata | null> {
  const query = gql`
    query TxMetadataByPk($timepoint_height: Int!, $timepoint_index: Int!, $multisig: String!, $chain: String!) {
      tx_metadata_by_pk(
        multisig: $multisig
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
  if (res.tx_metadata_by_pk === null) return null
  return {
    callData: res.tx_metadata_by_pk.call_data as `0x${string}`,
    description: res.tx_metadata_by_pk.description,
    changeConfigDetails: res.tx_metadata_by_pk.change_config_details,
  }
}
