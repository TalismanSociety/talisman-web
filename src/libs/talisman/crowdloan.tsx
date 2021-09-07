import { gql } from '@apollo/client'
import { find, get } from 'lodash'
import { FC, useContext as _useContext, createContext, useEffect, useMemo, useState } from 'react'

import { useQuery } from './'
import { CrowdloanDetails, crowdloanDetails } from './util/_config'

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
  verifier: string | null
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
    paraId: number
  }
  contributions: {
    totalCount: number
  }

  // custom fields
  percentRaised: number
  details: CrowdloanDetails
  uiStatus: 'active' | 'capped' | 'winner' | 'ended'
}

type ContextProps = {
  crowdloans: Crowdloan[]
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

const useFindCrowdloan = (
  key: string,
  value: any
): { crowdloan?: Crowdloan; status: any; message: any; hydrated: boolean } => {
  const { crowdloans, status, message, hydrated } = useCrowdloans()

  const crowdloan = useMemo(
    () => find(crowdloans, crowdloan => get(crowdloan, key) === value),
    [crowdloans, key, value]
  )

  return { crowdloan, status, message, hydrated }
}

const useFindCrowdloans = (
  key: string,
  value: any
): { crowdloans: Crowdloan[]; status: any; message: any; hydrated: boolean } => {
  const { crowdloans, status, message, hydrated } = useCrowdloans()

  const crowdloansFiltered = useMemo(
    () => crowdloans.filter(crowdloan => get(crowdloan, key) === value),
    [crowdloans, key, value]
  )

  return { crowdloans: crowdloansFiltered, status, message, hydrated }
}

// only returns one (the most recent) crowdloan per parachain
export const useLatestCrowdloans = (): { crowdloans: Crowdloan[]; status: any; message: any; hydrated: boolean } => {
  const { crowdloans, status, message, hydrated } = useCrowdloans()

  const crowdloansFiltered = useMemo(() => {
    const foundParachainIds: { [key: string]: boolean } = {}
    return crowdloans.filter(crowdloan => {
      if (foundParachainIds[crowdloan.parachain.paraId]) return false
      foundParachainIds[crowdloan.parachain.paraId] = true
      return true
    })
  }, [crowdloans])

  return { crowdloans: crowdloansFiltered, status, message, hydrated }
}

export const useCrowdloanById = (id?: string) => useFindCrowdloan('id', id)
// only gets the most recent matching crowdloan
export const useCrowdloanByParachainId = (id?: number) => useFindCrowdloan('parachain.paraId', id)
export const useCrowdloansByParachainId = (id?: number) => useFindCrowdloans('parachain.paraId', id)

export const useCrowdloanAggregateStats = () => {
  const { crowdloans, status, message } = useCrowdloans()
  const [raised, setRaised] = useState<number>(0)
  const [projects, setProjects] = useState<number>(0)
  const [contributors /*, setContributors */] = useState<number>(0)

  useEffect(() => {
    setRaised(crowdloans.reduce((acc: number, { raised = '0' }) => acc + parseInt(raised, 10), 0))
    setProjects(crowdloans.length)
    // setContributors(crowdloans.reduce((acc: number, { contributors = [] }) => acc + contributors.length, 0))
  }, [crowdloans])

  return {
    raised,
    projects,
    contributors,
    status,
    message,
  }
}

export const Provider: FC = ({ children }) => {
  const { data, called, loading, status, message } = useQuery(AllCrowdloans)

  const crowdloans = useMemo<Crowdloan[]>(
    () =>
      (data || [])
        .filter(
          (crowdloan: any) =>
            crowdloan?.parachain?.paraId && find(crowdloanDetails, { paraId: crowdloan.parachain.paraId })
        )
        .map(
          (crowdloan: any): Crowdloan => ({
            ...crowdloan,
            raised: crowdloan.raised / 1e12,
            cap: crowdloan.cap / 1e12,

            percentRaised: (100 / (crowdloan.cap / 1e12)) * (crowdloan.raised / 1e12),
            details: find(crowdloanDetails, { paraId: crowdloan.parachain.paraId }),
            uiStatus:
              crowdloan.wonAuctionId !== null
                ? 'winner'
                : crowdloan.status === 'Started' &&
                  ((100 / (crowdloan.cap / 1e12)) * (crowdloan.raised / 1e12)).toFixed(2) === '100.00'
                ? 'capped'
                : crowdloan.status === 'Started'
                ? 'active'
                : 'ended',
          })
        ),
    [data]
  )

  const value = useMemo(
    () => ({
      crowdloans,
      loading,
      status,
      message,
      called,
      hydrated: called === true && loading === false,
    }),
    [crowdloans, loading, status, message, called]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
