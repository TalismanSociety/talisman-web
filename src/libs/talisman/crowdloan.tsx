import { useParachains } from '@libs/talisman'
import { find, get } from 'lodash'
import { FC, useContext as _useContext, createContext, useEffect, useMemo, useState } from 'react'

import { useQuery } from './'
import { crowdloanDetails } from './util/_config'

const AllCrowdloans = `
  query Parachains {
    crowdloans {
      totalCount
      nodes {
        parachain {
          paraId
        }
        cap
        raised
        status
        verifier
        firstSlot
        lastSlot
        isFinished
        wonAuctionId
        lockExpiredBlock
      }
    }
  }
`

// TODO: Specify this
type Crowdloan = any
type CrowdloanMerged = any

type ContextProps = {
  items: Crowdloan[]
  called: boolean
  loading: boolean
  status: any
  message: any
  hydrated: boolean
}

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The crowdloan provider is required in order to use this hook')

  return context
}

export const useCrowdloans = () => useContext()

const useFindCrowdloan = (key: string, value: any) => {
  const { items, status, message } = useCrowdloans()

  const item = useMemo(() => find(items, item => get(item, key) === value) || {}, [items, key, value])

  return { item, status, message }
}

export const useCrowdloanByParachainId = (id: number) => useFindCrowdloan('parachain.id', id)
export const useCrowdloanByParachainSlug = (slug: string) => useFindCrowdloan('parachain.slug', slug)

export const useCrowdloanAggregateStats = () => {
  const { items, status, message } = useCrowdloans()
  const [raised, setRaised] = useState<number>(0)
  const [projects, setProjects] = useState<number>(0)
  const [contributors, setContributors] = useState<number>(0)

  useEffect(() => {
    setRaised(items.reduce((acc: number, { raised = 0 }) => acc + raised, 0))
    setProjects(items.length)
    setContributors(items.reduce((acc: number, { contributors = [] }) => acc + contributors.length, 0))
  }, [items]) // eslint-disable-line

  return {
    raised,
    projects,
    contributors,
    status,
    message,
  }
}

export const Provider: FC = ({ children }) => {
  const { parachains } = useParachains()

  const { data, called, loading, status, message } = useQuery(AllCrowdloans)
  const crowdloans = useMemo<Crowdloan[]>(
    () =>
      (data || [])
        .filter(
          (crowdloan: any) =>
            crowdloan?.parachain?.paraId && find(crowdloanDetails, { paraId: crowdloan.parachain.paraId })
        )
        .map((crowdloan: any) => ({
          ...crowdloan,
          paraId: crowdloan.parachain.paraId,
          raised: crowdloan.raised / 1e12,
          cap: crowdloan.cap / 1e12,
          percentRaised: (100 / (crowdloan.cap / 1e12)) * (crowdloan.raised / 1e12),
          ...find(crowdloanDetails, { paraId: crowdloan.parachain.paraId }),
        }))
        // TODO: Derive this correctly from subquery
        .map(({ overrideStatus, overrideEnd, ...crowdloan }: any) => ({
          ...crowdloan,
          status: overrideStatus,
          lockExpiredBlock: overrideEnd || crowdloan.lockExpiredBlock,
        }))
        .filter((crowdloan: any) => !!crowdloan.status),
    [data]
  )

  const items = useMemo<CrowdloanMerged[]>(
    () => crowdloans.map(crowdloan => ({ ...crowdloan, parachain: find(parachains, { id: crowdloan.paraId }) })),
    [crowdloans, parachains]
  )

  return (
    <Context.Provider
      value={{
        items,
        loading,
        status,
        message,
        called,
        hydrated: called === true && loading === false,
      }}
    >
      {children}
    </Context.Provider>
  )
}
