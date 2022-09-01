import { gql } from '@apollo/client'

export const FETCH_LIMIT = 3

export const TX_QUERY = gql`
  query ($addresses: [String!]!, $limit: Float, $lastId: String) {
    transactionsByAddress(addresses: $addresses, limit: $limit, lastId: $lastId) {
      id
      name
      chainId
      ss58Format
      blockNumber
      blockHash
      timestamp
      signer
      relatedAddresses
      _data
    }
  }
`
