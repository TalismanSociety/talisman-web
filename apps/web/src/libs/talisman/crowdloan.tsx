import { ApiPromise, WsProvider } from '@polkadot/api'
import type { AccountId } from '@polkadot/types/interfaces'
import { stringToU8a, u8aEq } from '@polkadot/util'
import { planckToTokens } from '@talismn/util'
import { find, get } from 'lodash'
import { PropsWithChildren, useContext as _useContext, createContext, useEffect, useMemo, useState } from 'react'

import { CrowdloanDetails, SupportedRelaychains, crowdloanDetails } from './util/_config'

export type Crowdloan = {
  // graphql fields
  id: string
  depositor: string
  verifier: string | null // e.g. {\"sr25519\":\"0x6c79c2c862124697baf6d0562055a50f3b0eac3c895c23bb16e8d1e2da341549\"}"
  cap: number
  raised: number
  end: number
  parachain: {
    paraId: string
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
export const useCrowdloanByParachainId = (id?: number | string) => useFindCrowdloan('parachain.paraId', id)
export const useCrowdloansByParachainId = (id?: number | string) => useFindCrowdloans('parachain.paraId', id)

export const useCrowdloanAggregateStats = () => {
  const { crowdloans, hydrated } = useCrowdloans()
  const [raised, setRaised] = useState<number>(0)
  const [projects, setProjects] = useState<number>(0)
  const [contributors /*, setContributors */] = useState<number>(0)

  useEffect(() => {
    setRaised(crowdloans.reduce((acc: number, { raised = 0 }) => acc + raised, 0))
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

const CROWD_PREFIX = stringToU8a('modlpy/cfund')

function hasCrowdloadPrefix(accountId: AccountId): boolean {
  return u8aEq(accountId.slice(0, CROWD_PREFIX.length), CROWD_PREFIX)
}

export const Provider = ({ children }: PropsWithChildren) => {
  const [crowdloans, setCrowdloans] = useState<Crowdloan[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const resultPromise = Promise.all(
      Object.values(SupportedRelaychains).flatMap(async relayChain => {
        const api = await ApiPromise.create({ provider: new WsProvider(relayChain.rpc) })

        const bestNumber = await api.derive.chain.bestNumber()
        const funds = await api.query.crowdloan.funds.entries()

        const paraIds = await api.query.crowdloan.funds.keys().then(x => x.map(y => y.args[0]))
        const leases = await api.query.slots.leases.multi(paraIds)
        const leasedParaIds = paraIds.filter((_, index) =>
          leases[index]?.some(lease => lease.isSome && hasCrowdloadPrefix(lease.unwrap()[0]))
        )

        return funds.map(([fundId, maybeFund]) => {
          const fund = maybeFund.unwrapOrDefault()
          const tokenDecimals = relayChain.id === 2 ? 12 : 10

          const isCapped = fund.cap.sub(fund.raised).lt(api.consts.crowdloan.minContribution)
          const isEnded = bestNumber.gt(fund.end)
          const isWinner = leasedParaIds.some(lease => lease.eq(fundId.args[0]))

          return {
            ...fund.toJSON(),
            id: `${relayChain.id}-${fundId.args[0].toNumber()}`,
            raised: Number(planckToTokens(fund.raised.toString(), tokenDecimals)),
            cap: Number(planckToTokens(fund.cap.toString(), tokenDecimals)),
            parachain: {
              paraId: `${relayChain.id}-${fundId.args[0].toNumber()}`,
            },
            relayChainId: relayChain.id,
            percentRaised:
              (100 / Number(planckToTokens(fund.cap.toString(), tokenDecimals))) *
              Number(planckToTokens(fund.raised.toString(), tokenDecimals)),
            details: find(crowdloanDetails, {
              relayId: relayChain.id,
              paraId: fundId.args[0].toNumber(),
            }),
            uiStatus: isWinner ? 'winner' : isCapped ? 'capped' : isEnded ? 'ended' : 'active',
          }
        })
      })
    )

    resultPromise.then(result => {
      setCrowdloans(result.flat() as any)
      setHydrated(true)
    })
  }, [])

  const value = useMemo(
    () => ({
      crowdloans,
      hydrated,
    }),
    [crowdloans, hydrated]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
