import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client'
//import { BifrostDOT, Moonbeam } from '@libs/crowdloans/crowdloanOverrides'
import { planckToTokens } from '@talismn/util'
import { find, get } from 'lodash'
import { FC, useContext as _useContext, createContext, useEffect, useMemo, useState } from 'react'

import { CrowdloanDetails, SupportedRelaychains, crowdloanDetails } from './util/_config'

const AllCrowdloans = gql`
  {
    # Order by BLOCK_NUM_DESC so that when we do:
    #   find(allCrowdloans, 'parachain.id', parachainId)
    # ...we get the most recent crowdloan, not the oldest
    _metadata {
      specName
      targetHeight
    }
    crowdloans(orderBy: BLOCK_NUM_DESC, filter: { status: { notEqualTo: "Dissolved" } }) {
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

const determineStatusInterlay = (
  crowdloan: any,
  cap: number,
  raised: number,
  relayChainId: number,
  targetHeight: number
) => {
  return crowdloan.status === 'Started' && crowdloan.lockExpiredBlock > targetHeight // active state
    ? ((100 / cap) * raised).toFixed(2) === '100.00'
      ? 'capped'
      : 'active'
    : 'winner'
}

export const Provider: FC = ({ children }) => {
  const [crowdloanResults, setCrowdloanResults] = useState<any>([])
  useEffect(() => {
    // create an apollo client for each relaychain
    const relayChainClients = Object.values(SupportedRelaychains).map(
      ({ id, tokenDecimals, subqueryCrowdloansEndpoint }) => {
        return {
          relayChainId: id,
          tokenDecimals,
          client: new ApolloClient({
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
        }
      }
    )

    // query crowdloans on each relay chain
    const relayChainCrowdloans = relayChainClients.map(({ client }) => client.query({ query: AllCrowdloans }))

    // extract results and store in state with relayChainId
    Promise.allSettled(relayChainCrowdloans).then(results =>
      setCrowdloanResults(
        results.map((result, resultIndex) => {
          return {
            relayChainId: relayChainClients[resultIndex].relayChainId, // relayChainId
            tokenDecimals: relayChainClients[resultIndex].tokenDecimals, // tokenDecimals
            result: result.status === 'fulfilled' ? result?.value?.data || [] : [], // result data
          } as any
        })
      )
    )
  }, [])

  const [crowdloans, setCrowdloans] = useState<Crowdloan[]>([])

  useEffect(() => {
    console.log({ crowdloanResults })
    setCrowdloans(
      crowdloanResults.flatMap(({ relayChainId, tokenDecimals, result }: any) => {
        const { specName, targetHeight } = result?._metadata

        return (result?.crowdloans?.nodes || []).map((crowdloan: any): Crowdloan => {
          const cap = Number(planckToTokens(crowdloan.cap, tokenDecimals))
          const raised = Number(planckToTokens(crowdloan.raised, tokenDecimals))
          const status = determineStatusInterlay(crowdloan, cap, raised, relayChainId, targetHeight)

          return {
            ...crowdloan,
            raised: raised,
            cap: cap,
            id: `${relayChainId}-${crowdloan.id}`,
            parachain: {
              paraId: `${relayChainId}-${crowdloan.parachain.paraId}`,
              specName: specName,
            },
            relayChainId,
            percentRaised: (100 / cap) * raised,
            details: find(crowdloanDetails, {
              relayId: relayChainId,
              paraId: crowdloan.parachain.paraId,
            }),
            uiStatus: status,
          }
        })
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
