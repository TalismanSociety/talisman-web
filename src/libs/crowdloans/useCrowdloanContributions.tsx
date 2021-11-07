import { ApolloClient, ApolloQueryResult, InMemoryCache, NormalizedCacheObject, gql } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { SupportedRelaychains } from '@libs/talisman/util/_config'
import { addBigNumbers, encodeAnyAddress } from '@talismn/util'
import { PropsWithChildren, useContext as _useContext, createContext, useEffect, useMemo, useState } from 'react'

//
// Constants
//

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

//
// Hooks (exported)
//

export function useCrowdloanContributions({
  accounts: _accounts,
  crowdloans: _crowdloans,
}: { accounts?: string[]; crowdloans?: string[] } = {}): {
  contributions: CrowdloanContribution[]
  hydrated: boolean
} {
  // memoize accounts and crowdloans so user can do useCrowdloansContributions([accountId], [crowdloanId]) without wasting cycles
  const accounts = useMemo(
    () =>
      Object.values(SupportedRelaychains).map(({ id }) =>
        (_accounts || []).map(account => encodeAnyAddress(account, id))
      ),
    [JSON.stringify(_accounts)] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const crowdloans = useMemo(
    () =>
      Object.values(SupportedRelaychains).map(({ id: relayId }) =>
        (_crowdloans || []).filter(id => id.startsWith(`${relayId}-`)).map(id => id.split('-').slice(1).join('-'))
      ),
    [JSON.stringify(_crowdloans)] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const { apolloClients } = useContext()

  const [contributionsResults, setContributionsResults] = useState<Array<[number, ApolloQueryResult<any> | null]>>([])
  useEffect(() => {
    // query crowdloan contributions on each relay chain
    const relayChainContributions = apolloClients.map((client, index) => {
      const query = Contributions(accounts[index], crowdloans[index])

      // if we're not filtering the result by accounts, the server response is going to be huge
      const hasAccounts = Array.isArray(accounts[index]) && accounts[index].length > 0
      if (!hasAccounts) return Promise.reject()

      return client.query({ query })
    })

    // extract results and store in state with relayChainId
    Promise.allSettled(relayChainContributions).then(results =>
      setContributionsResults(
        results.map((result, resultIndex) => [
          Object.values(SupportedRelaychains)[resultIndex].id, // relayChainId
          result.status === 'fulfilled' ? result.value : null, // result data
        ])
      )
    )
  }, [apolloClients, accounts, crowdloans])

  const [contributions, setContributions] = useState<CrowdloanContribution[]>([])
  useEffect(() => {
    setContributions(
      contributionsResults.flatMap(([relayChainId, result]) =>
        ((result?.data?.contributions?.nodes || []) as CrowdloanContribution[]).map(contribution => ({
          ...contribution,
          relayChainId,

          parachain: { paraId: `${relayChainId}-${contribution.parachain.paraId}` },

          fund: { id: `${relayChainId}-${contribution.fund.id}` },
        }))
      )
    )
  }, [contributionsResults])

  // const pollInterval = 30000 // 10000ms == 30s

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(contributionsResults.length > 0 && contributionsResults.some(([_, results]) => results !== null))
  }, [contributionsResults])

  return {
    contributions,
    hydrated,
  }
}

//
// Context
//

type ContextProps = {
  apolloClients: ApolloClient<NormalizedCacheObject>[]
}

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The CrowdloanContributions provider is required in order to use this hook')

  return context
}

//
// Provider
//

export function Provider({ children }: PropsWithChildren<{}>) {
  const apolloClients = useMemo(
    () =>
      Object.values(SupportedRelaychains).map(({ subqueryCrowdloansEndpoint }) => {
        const link = new BatchHttpLink({ uri: subqueryCrowdloansEndpoint, batchMax: 999, batchInterval: 20 })
        return new ApolloClient({
          link,
          cache: new InMemoryCache(),
        })
      }),
    []
  )

  const value = useMemo(() => ({ apolloClients }), [apolloClients])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

//
// Helpers (exported)
//

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
