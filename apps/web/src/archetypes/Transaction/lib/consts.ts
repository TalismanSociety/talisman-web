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
        ... on ParsedSetIdentity {
          chainId
          info
          fee
          tip
          success
        }
        ... on ParsedClearedIdentity {
          chainId
          fee
          tip
          success
        }
        ... on ParsedPoolStake {
          chainId
          tokenLogo
          tokenSymbol
          tokenDecimals
          poolId
          member
          bonded
          joined
          fee
          tip
          success
        }
        ... on ParsedPoolUnstake {
          chainId
          tokenLogo
          tokenSymbol
          tokenDecimals
          era
          poolId
          member
          points
          balance
          fee
          tip
          success
        }
        ... on ParsedPoolPaidOut {
          chainId
          tokenLogo
          tokenSymbol
          tokenDecimals
          poolId
          member
          payout
          fee
          tip
          success
        }
        ... on ParsedPoolWithdrawn {
          chainId
          tokenLogo
          tokenSymbol
          tokenDecimals
          poolId
          member
          points
          balance
          fee
          tip
          success
        }
        ... on ParsedPoolMemberRemoved {
          chainId
          tokenLogo
          tokenSymbol
          tokenDecimals
          poolId
          member
          fee
          tip
          success
        }
        ... on ParsedVote {
          chainId
          tokenLogo
          tokenSymbol
          tokenDecimals
          voter
          referendumIndex
          referendumUrl
          voteNumber
          amount
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
