import { graphql } from './graphql-codegen'

export const FETCH_LIMIT = 3

export const txQuery = graphql(`
  query txQuery(
    $addresses: [String!]!
    $limit: Float
    $olderThanId: String
    $newerThanId: String
    $searchQuery: String
  ) {
    transactionsByAddress(
      addresses: $addresses
      limit: $limit
      olderThanId: $olderThanId
      newerThanId: $newerThanId
      query: $searchQuery
    ) {
      id
      name
      chainId
      ss58Format
      blockNumber
      blockHash
      timestamp
      args
      signer
      relatedAddresses
      explorerUrl

      parsed {
        __typename

        ... on ParsedTransfer {
          chainId
          tokenLogo
          tokenSymbol
          tokenDecimals
          from
          to
          amount
          fee
          tip
          success
        }
        ... on ParsedCrowdloanContribute {
          chainId
          tokenLogo
          tokenSymbol
          tokenDecimals
          contributor
          amount
          fund
          fee
          tip
          success
        }
        ... on ParsedStake {
          chainId
          tokenLogo
          tokenSymbol
          tokenDecimals
          staker
          amount
          fee
          tip
          success
        }
        ... on ParsedUnstake {
          chainId
          tokenLogo
          tokenSymbol
          tokenDecimals
          unstaker
          amount
          fee
          tip
          success
        }
        ... on ParsedAddLiquidity {
          chainId
          fee
          tip
          success
        }
        ... on ParsedRemoveLiquidity {
          chainId
          fee
          tip
          success
        }
        ... on ParsedAddProvision {
          chainId
          fee
          tip
          success
        }
        ... on ParsedRefundProvision {
          chainId
          fee
          tip
          success
        }
        ... on ParsedSwap {
          chainId
          tokens {
            logo
            symbol
            decimals
            liquidityChange
          }
          trader
          fee
          tip
          success
        }
      }
    }
  }
`)

export const latestTxQuery = graphql(`
  query latestTxQuery($addresses: [String!]!, $searchQuery: String) {
    transactionsByAddress(addresses: $addresses, query: $searchQuery, limit: 1) {
      id
    }
  }
`)
