import { ApolloClient, ApolloError, ApolloProvider, InMemoryCache, gql, useQuery } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { addBigNumbers, useFuncMemo } from '@talismn/util'
import { PropsWithChildren, useMemo } from 'react'

const AccountFilter = (accounts?: string[]) =>
  Array.isArray(accounts) && accounts.length > 0 ? `account: { in: ${JSON.stringify(accounts)} }` : ``

const CrowdloanFilter = (crowdloans?: string[]) =>
  Array.isArray(crowdloans) && crowdloans.length > 0 ? `fundId: { in: ${JSON.stringify(crowdloans)} }` : ``

const Contributions = (accounts?: string[], crowdloans?: string[]) => gql`
  {
    contributions(
      orderBy: BLOCK_NUM_DESC,
      filter: {
        ${AccountFilter(accounts)}
        ${CrowdloanFilter(crowdloans)}
      }
    ) {
      nodes {
        id
        account
        amount
        blockNum
        parachain {
          paraId
        }
        fundId
        fund {
          id
        }
      }
    }
  }
`

export type CrowdloanContribution = {
  id: string
  account: string
  amount: string
  blockNum: number

  // the associated parachain
  parachain: { paraId: string }

  // the associated crowdloan
  fund: { id: string }
}

export function useCrowdloanContributions({
  accounts: _accounts,
  crowdloans: _crowdloans,
}: { accounts?: string[]; crowdloans?: string[] } = {}): {
  contributions: Array<CrowdloanContribution>
  skipped: boolean
  loading: boolean
  error?: ApolloError
} {
  // memoize accounts and crowdloans so user can do useCrowdloansContributions([accountId], [crowdloanId]) without wasting cycles
  const accounts = useMemo(() => _accounts, [JSON.stringify(_accounts)]) // eslint-disable-line react-hooks/exhaustive-deps
  const crowdloans = useMemo(
    () => _crowdloans?.map(id => id.split('-').slice(1).join('-')),
    [JSON.stringify(_crowdloans)] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const query = useFuncMemo(Contributions, accounts, crowdloans)

  const hasAccounts = Array.isArray(accounts) && accounts.length > 0

  // if we're not filtering the result by accounts, the server response is going to be huge
  const skip = !hasAccounts

  const pollInterval = 10000 // 10000ms == 10s
  const { data, loading, error } = useQuery(query, { skip, pollInterval })

  const contributions = useMemo(
    () =>
      ((data?.contributions?.nodes as Array<CrowdloanContribution>) || []).map(contribution => ({
        ...contribution,
        relayChainId: 2,
        parachain: { paraId: `2-${contribution.parachain.paraId}` },
        fund: { id: `2-${contribution.fund.id}` },
      })),
    [data?.contributions?.nodes]
  )

  return {
    contributions,
    skipped: skip,
    loading,
    error,
  }
}

export function Provider({ uri, children }: PropsWithChildren<{ uri: string }>) {
  const link = useMemo(() => new BatchHttpLink({ uri, batchMax: 999, batchInterval: 20 }), [uri])

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        link,
        cache: new InMemoryCache(),
      }),
    [link]
  )

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

export function groupTotalContributionsByCrowdloan(contributions: CrowdloanContribution[]) {
  return contributions.reduce((perCrowdloan, contribution) => {
    if (!perCrowdloan[contribution.fund.id]) perCrowdloan[contribution.fund.id] = '0'
    perCrowdloan[contribution.fund.id] =
      addBigNumbers(perCrowdloan[contribution.fund.id], contribution.amount) || perCrowdloan[contribution.fund.id]
    return perCrowdloan
  }, {} as { [key: string]: string })
}

export function getTotalContributionForCrowdloan(crowdloan: string, contributions: CrowdloanContribution[]) {
  return contributions
    .filter(contribution => contribution.fund.id === crowdloan)
    .map(contribution => contribution.amount)
    .reduce(addBigNumbers, undefined)
}
