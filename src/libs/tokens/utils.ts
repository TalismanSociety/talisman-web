import gql from 'graphql-tag'

const graphqlUrl = 'https://app.gc.subsquid.io/beta/chaindata/latest/graphql'

const tokensQuery = gql`
  {
    tokens: chains(orderBy: sortIndex_ASC) {
      id
      isTestnet
      nativeToken {
        id
        token
        symbol
        decimals
        existentialDeposit
        coingeckoId
        rates {
          usd
          eur
        }
      }
      tokens {
        id
        index
        token
        symbol
        decimals
        existentialDeposit
        coingeckoId
        rates {
          usd
          eur
        }
      }
    }
  }
`

const chaindataQuery = gql`
  {
    chains(orderBy: sortIndex_ASC) {
      id
      sortIndex
      isTestnet
      genesisHash
      prefix
      name
      chainName
      implName
      specName
      specVersion
      nativeToken {
        id
      }
      tokensCurrencyIdIndex
      tokens {
        id
      }
      account
      subscanUrl
      rpcs {
        url
        isHealthy
      }
      ethereumExplorerUrl
      ethereumRpcs {
        url
        isHealthy
      }
      ethereumId
      isHealthy
      parathreads(orderBy: paraId_ASC) {
        id
        paraId
      }
      paraId
      relay {
        id
      }
    }
  }
`

export { graphqlUrl, tokensQuery, chaindataQuery }
