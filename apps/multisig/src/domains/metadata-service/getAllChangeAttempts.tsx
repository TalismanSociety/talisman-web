import { ChangeConfigDetails } from '@domains/multisig'
import { gql, request } from 'graphql-request'

import { METADATA_SERVICE_URL } from '.'

interface GetAllChangeAttemptsVariables {
  multisig: string
  chain: string
}

interface TxMetadataByPkResponseRaw {
  tx_metadata: {
    change_config_details: {
      newThreshold: number
      newMembers: string[]
    }
  }[]
}

export async function getAllChangeAttempts(variables: GetAllChangeAttemptsVariables): Promise<ChangeConfigDetails[]> {
  const query = gql`
    query AllChangeConfigAttempts($multisig: String!, $chain: String!) {
      tx_metadata(
        where: { multisig: { _eq: $multisig }, chain: { _eq: $chain }, change_config_details: { _is_null: false } }
      ) {
        change_config_details
      }
    }
  `

  const res = (await request(
    METADATA_SERVICE_URL,
    query,
    variables as Record<string, any>
  )) as TxMetadataByPkResponseRaw
  return res.tx_metadata.map(tx => tx.change_config_details)
}
