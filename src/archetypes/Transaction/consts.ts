import { gql } from "@apollo/client";

export const TX_QUERY = gql`
  query ($address: String!, $count: Float, $lastId: String) {
    transactionsByAddress (address : $address, count : $count, lastId : $lastId) {
      id
      extrinsicId
      chainId
      name
      blockNumber
      indexInBlock
      createdAt
      section
      method
      relatedAddresses
      signer
      direction
  }
}`