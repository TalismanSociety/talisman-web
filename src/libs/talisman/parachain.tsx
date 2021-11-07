import {
  ApolloClient,
  ApolloQueryResult,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  gql,
} from '@apollo/client'
import { useChain } from '@talismn/api-react-hooks'
import { find } from 'lodash'
import { FC, useContext as _useContext, createContext, useEffect, useMemo, useState } from 'react'

import { SupportedRelaychains, parachainDetails } from './util/_config'
import type { ParachainDetails } from './util/_config'

export type { ParachainDetails } from './util/_config'

//
// Constants
//

const AllParachains = gql`
  {
    parachains(orderBy: ID_ASC) {
      totalCount
      nodes {
        paraId
        manager
        deposit
        leases {
          totalCount
        }
      }
    }
  }
`

// TODO: Add parachain leases
// const AllParachainLeases = gql`
//   {
//     parachainLeases {
//       totalCount
//       nodes {
//         paraId
//         leaseRange
//         firstLease
//         lastLease
//         winningAmount
//         extraAmount
//         wonBidFrom
//         numBlockWon
//         winningResultBlock
//         hasWon
//         parachain {
//           id
//         }
//       }
//     }
//   }
// `

//
// Hooks (exported)
//

export const useParachainsDetails = () => useContext()
export const useParachainsDetailsIndexedById = () => {
  const { parachains, hydrated } = useParachainsDetails()

  return {
    parachains: useMemo(() => Object.fromEntries(parachains.map(parachain => [parachain.id, parachain])), [parachains]),
    hydrated,
  }
}

export const useParachainDetailsById = (id?: number) => useFindParachainDetails('id', id)
export const useParachainDetailsBySlug = (slug?: string) => useFindParachainDetails('slug', slug)

export const useParachainAssets = (
  id?: string
): Partial<{ [key: string]: string; banner: string; card: string; logo: string }> => {
  const chain = useChain(id)

  return useMemo(
    () => ({
      banner: chain.asset?.banner,
      card: chain.asset?.card,
      logo: chain.asset?.logo,
    }),
    [chain]
  )
}

//
// Hooks (internal)
//

export const useFindParachainDetails = (
  key: string,
  value: any
): Partial<{ parachainDetails?: ParachainDetails; hydrated: boolean }> => {
  const { parachains, hydrated } = useParachainsDetails()

  const parachainDetails = useMemo(() => find(parachains, { [key]: value }), [parachains, key, value])

  return {
    parachainDetails,
    hydrated,
  }
}

//
// Context
//

type ContextProps = {
  parachains: ParachainDetails[]
  hydrated: boolean
}

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The parachain provider is required in order to use this hook')

  return context
}

//
// Provider
//

export const Provider: FC = ({ children }) => {
  const [parachainResults, setParachainResults] = useState<Array<[number, ApolloQueryResult<any> | null]>>([])
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

    // query parachains on each relay chain
    const relayChainParachains = relayChainClients.map(([_id, client]) => client.query({ query: AllParachains }))

    // extract results and store in state with relayChainId
    Promise.allSettled(relayChainParachains).then(results =>
      setParachainResults(
        results.map((result, resultIndex) => [
          relayChainClients[resultIndex][0], // relayChainId
          result.status === 'fulfilled' ? result.value : null, // result data
        ])
      )
    )
  }, [])

  // TODO: Separate parachainDetails from parachains
  // parachainDetails should come from chaindata, parachains should come from subquery
  const [parachains, setParachains] = useState<ParachainDetails[]>([])
  useEffect(() => {
    setParachains(
      parachainResults.flatMap(([relayChainId, result]) =>
        (result?.data?.parachains?.nodes || [])
          .map(({ paraId: id }: { paraId?: number }) => ({ paraId: `${relayChainId}-${id}` }))
          .map(({ paraId: id }: { paraId?: number }) => find(parachainDetails, { id }))
          .filter(Boolean)
          .map((parachain: any) => ({ ...parachain, relayChainId }))
      )
    )
  }, [parachainResults])

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(parachainResults.length > 0)
  }, [parachainResults])

  const value = useMemo(
    () => ({
      parachains,
      hydrated,
    }),
    [parachains, hydrated]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
