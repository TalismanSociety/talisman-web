import { gql } from '@apollo/client'
import { find } from 'lodash'
import { FC, useContext as _useContext, createContext, useMemo } from 'react'

import { useQuery } from './'
import { parachainDetails } from './util/_config'
import type { ParachainDetails } from './util/_config'

export type { ParachainDetails } from './util/_config'

const assetPath = require.context('./assets', true)

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
  const { parachains, ...rest } = useParachainsDetails()

  return {
    parachains: useMemo(() => Object.fromEntries(parachains.map(parachain => [parachain.id, parachain])), [parachains]),
    ...rest,
  }
}

export const useParachainDetailsById = (id?: number) => useFindParachainDetails('id', id)
export const useParachainDetailsBySlug = (slug?: string) => useFindParachainDetails('slug', slug)

export const useParachainAssets = (
  id?: number
): Partial<{ [key: string]: string; banner: string; card: string; logo: string }> =>
  useMemo(() => {
    if (!id) return {}

    let banner = ''
    let card = ''
    let logo = ''

    try {
      banner = assetPath(`./${id}/banner.png`)?.default
    } catch (e) {}

    try {
      card = assetPath(`./${id}/card.png`)?.default
    } catch (e) {}

    try {
      logo = assetPath(`./${id}/logo.svg`)?.default
    } catch (e) {}

    return { banner, card, logo }
  }, [id])

//
// Hooks (internal)
//

export const useFindParachainDetails = (
  key: string,
  value: any
): Partial<{ parachainDetails?: ParachainDetails; status: any; message: any }> => {
  const { parachains, status, message } = useParachainsDetails()

  const parachainDetails = useMemo(() => find(parachains, { [key]: value }), [parachains, key, value])

  return {
    parachainDetails,
    status,
    message,
  }
}

//
// Context
//

type ContextProps = {
  parachains: ParachainDetails[]
  called: boolean
  loading: boolean
  status: any
  message: any
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
  const { data, called, loading, status, message } = useQuery(AllParachains)

  // TODO: Separate parachainDetails from parachains
  // parachainDetails should come from chaindata, parachains should come from subquery
  const parachains = useMemo<ParachainDetails[]>(
    () => (data || []).map(({ paraId: id }: { paraId?: number }) => find(parachainDetails, { id })).filter(Boolean),
    [data]
  )

  const value = useMemo(
    () => ({
      parachains,
      called,
      loading,
      status,
      message,
    }),
    [parachains, called, loading, status, message]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
