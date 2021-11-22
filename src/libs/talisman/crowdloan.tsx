import {
  ApolloClient,
  ApolloQueryResult,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  gql,
} from '@apollo/client'
import { Moonbeam } from '@libs/crowdloans/crowdloanOverrides'
import { planckToTokens } from '@talismn/util'
import { find, get } from 'lodash'
import { FC, useContext as _useContext, createContext, useEffect, useMemo, useState } from 'react'

import { CrowdloanDetails, SupportedRelaychains, crowdloanDetails } from './util/_config'

const AllCrowdloans = gql`
  {
    # Order by BLOCK_NUM_DESC so that when we do:
    #   find(allCrowdloans, 'parachain.id', parachainId)
    # ...we get the most recent crowdloan, not the oldest
    crowdloans(orderBy: BLOCK_NUM_DESC) {
      totalCount
      nodes {
        id
        depositor
        verifier
        cap
        raised
        lockExpiredBlock
        blockNum
        firstSlot
        lastSlot
        status
        leaseExpiredBlock
        dissolvedBlock
        isFinished
        wonAuctionId
        parachain {
          paraId
        }
        contributions {
          totalCount
        }
      }
    }
  }
`

export type Crowdloan = {
  // graphql fields
  id: string
  depositor: string
  verifier: string | null // e.g. {\"sr25519\":\"0x6c79c2c862124697baf6d0562055a50f3b0eac3c895c23bb16e8d1e2da341549\"}"
  cap: string
  raised: string
  lockExpiredBlock: number
  blockNum: number
  firstSlot: number
  lastSlot: number
  status: string
  leaseExpiredBlock: number | null
  dissolvedBlock: number | null
  isFinished: boolean
  wonAuctionId: string | null
  parachain: {
    paraId: string
  }
  contributions: {
    totalCount: number
  }

  // custom fields
  relayChainId: number
  percentRaised: number
  details: CrowdloanDetails
  uiStatus: 'active' | 'capped' | 'winner' | 'ended'
}

type ContextProps = {
  crowdloans: Crowdloan[]
  hydrated: boolean
}

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The crowdloan provider is required in order to use this hook')

  return context
}

export const useCrowdloans = () => useContext()

const useFindCrowdloan = (key: string, value: any): { crowdloan?: Crowdloan; hydrated: boolean } => {
  const { crowdloans, hydrated } = useCrowdloans()

  const crowdloan = useMemo(
    () => find(crowdloans, crowdloan => get(crowdloan, key) === value),
    [crowdloans, key, value]
  )

  return { crowdloan, hydrated }
}

const useFindCrowdloans = (key: string, value: any): { crowdloans: Crowdloan[]; hydrated: boolean } => {
  const { crowdloans, hydrated } = useCrowdloans()

  const crowdloansFiltered = useMemo(
    () => crowdloans.filter(crowdloan => get(crowdloan, key) === value),
    [crowdloans, key, value]
  )

  return { crowdloans: crowdloansFiltered, hydrated }
}

// only returns one (the most recent) crowdloan per parachain
export const useLatestCrowdloans = (): { crowdloans: Crowdloan[]; hydrated: boolean } => {
  const { crowdloans, hydrated } = useCrowdloans()

  const crowdloansFiltered = useMemo(() => {
    const foundParachainIds: { [key: string]: boolean } = {}
    return crowdloans.filter(crowdloan => {
      if (foundParachainIds[crowdloan.parachain.paraId]) return false
      foundParachainIds[crowdloan.parachain.paraId] = true
      return true
    })
  }, [crowdloans])

  return { crowdloans: crowdloansFiltered, hydrated }
}

export const useCrowdloanById = (id?: string) => useFindCrowdloan('id', id)
// only gets the most recent matching crowdloan
export const useCrowdloanByParachainId = (id?: number) => useFindCrowdloan('parachain.paraId', id)
export const useCrowdloansByParachainId = (id?: number) => useFindCrowdloans('parachain.paraId', id)

export const useCrowdloanAggregateStats = () => {
  const { crowdloans, hydrated } = useCrowdloans()
  const [raised, setRaised] = useState<number>(0)
  const [projects, setProjects] = useState<number>(0)
  const [contributors /*, setContributors */] = useState<number>(0)

  useEffect(() => {
    setRaised(crowdloans.reduce((acc: number, { raised = '0' }) => acc + parseInt(raised, 10), 0))
    setProjects(crowdloanDetails.length)
    // setContributors(crowdloans.reduce((acc: number, { contributors = [] }) => acc + contributors.length, 0))
  }, [crowdloans])

  return {
    raised,
    projects,
    contributors,
    hydrated,
  }
}

export const Provider: FC = ({ children }) => {
  const [crowdloanResults, setCrowdloanResults] = useState<Array<[number, ApolloQueryResult<any> | null]>>([])
  useEffect(() => {
    // create an apollo client for each relaychain
    const relayChainClients = Object.values(SupportedRelaychains).map(
      ({ id, subqueryCrowdloansEndpoint }) =>
        [
          id,
          new ApolloClient({
            link: createHttpLink({ uri: subqueryCrowdloansEndpoint }),
            cache: new InMemoryCache(),
            fetchOptions: {
              mode: 'no-cors',
            },
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
          }),
        ] as [number, ApolloClient<NormalizedCacheObject>]
    )

    // query crowdloans on each relay chain
    const relayChainCrowdloans = relayChainClients.map(([_id, client]) => client.query({ query: AllCrowdloans }))

    // extract results and store in state with relayChainId
    Promise.allSettled(relayChainCrowdloans).then(results =>
      setCrowdloanResults(
        results.map((result, resultIndex) => [
          relayChainClients[resultIndex][0], // relayChainId
          result.status === 'fulfilled' ? result.value : null, // result data
        ])
      )
    )
  }, [])

  const [crowdloans, setCrowdloans] = useState<Crowdloan[]>([])
  useEffect(() => {
    setCrowdloans(
      crowdloanResults.flatMap(([relayChainId, result]) => {
        const tokenDecimals = relayChainId === 2 ? 12 : 10
        return (result?.data?.crowdloans?.nodes || []).map(
          (crowdloan: any): Crowdloan => ({
            ...crowdloan,
            raised: Number(planckToTokens(crowdloan.raised, tokenDecimals)),
            cap: Number(planckToTokens(crowdloan.cap, tokenDecimals)),

            id: `${relayChainId}-${crowdloan.id}`,

            parachain: {
              paraId: `${relayChainId}-${crowdloan.parachain.paraId}`,
            },

            relayChainId,
            percentRaised:
              (100 / Number(planckToTokens(crowdloan.cap, tokenDecimals))) *
              Number(planckToTokens(crowdloan.raised, tokenDecimals)),
            details: find(crowdloanDetails, {
              relayId: relayChainId,
              paraId: crowdloan.parachain.paraId,
            }),
            uiStatus:
              crowdloan.wonAuctionId !== null
                ? 'winner'
                : crowdloan.status === 'Started' &&
                  (
                    (100 / Number(planckToTokens(crowdloan.cap, tokenDecimals))) *
                    Number(planckToTokens(crowdloan.raised, tokenDecimals))
                  ).toFixed(2) === '100.00'
                ? 'capped'
                : Moonbeam.is(relayChainId, crowdloan.parachain.paraId)
                ? 'capped'
                : crowdloan.status === 'Started'
                ? 'active'
                : 'ended',
          })
        )
      })
    )
  }, [crowdloanResults])

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(crowdloanResults.length > 0)
  }, [crowdloanResults])

  const value = useMemo(
    () => ({
      crowdloans,
      hydrated,
    }),
    [crowdloans, hydrated]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
