import { gql } from "@apollo/client";

export const TX_QUERY = gql`
  query ($address: String!, $count: Float, $lastId: String) {
    transactionsByAccount (address : $address, count : $count, lastId : $lastId) {
      id
      chainId
      blockNumber
      createdAt
      section
      method
      relatedAddresses
      signer
      direction
  }
}`