/* eslint-disable @typescript-eslint/no-non-null-assertion */
import crowdloanDataState, { type CrowdloanDetail } from '@libs/@talisman-crowdloans/provider'
import { selectedSubstrateAccountsState } from '@domains/accounts'
import type { AccountId } from '@polkadot/types/interfaces'
import { stringToU8a, u8aConcat, u8aToHex, u8aEq } from '@polkadot/util'
import { decodeAnyAddress, planckToTokens } from '@talismn/util'
import BN from 'bn.js'
import { find, get } from 'lodash'
import { useContext as _useContext, createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

import { substrateApiState } from '@domains/common'
import { SupportedRelaychains } from './util/_config'

export type Crowdloan = {
  // graphql fields
  id: string
  stash: string
  depositor: string
  verifier?: any
  deposit: number
  raised: number
  end: number
  cap: number
  firstPeriod: number
  lastPeriod: number
  fundIndex: number
  parachain: {
    paraId: string
  }
  // custom fields
  relayChainId: number
  percentRaised: number
  details: CrowdloanDetail
  uiStatus: 'active' | 'capped' | 'winner' | 'ended'
  isCapped: boolean
  isEnded: boolean
  isWinner: boolean

  bestNumber?: number
  leasePeriod?: number
  leaseOffset?: number
  currentLeasePeriodIndex?: number
  endOfCurrentLeasePeriod?: number

  fundLeaseEndBlock?: number
  lockedBlocks?: number
  lockedSeconds?: number
}

type Return = {
  timestamp: string
  block: number
  crowdloanAccount: string
  userAccount: string
  amount: {
    value: string
    decimals: number
    symbol: string
  }
}

type ContextProps = {
  crowdloans: Crowdloan[]
  returns: Return[]
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
    const foundParachainIds: Record<string, boolean> = {}
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
  const crowdloanData = useRecoilValue(crowdloanDataState)

  const { crowdloans, hydrated } = useCrowdloans()
  const [raised, setRaised] = useState<number>(0)
  const [projects, setProjects] = useState<number>(0)
  const [contributors /*, setContributors */] = useState<number>(0)

  useEffect(() => {
    setRaised(crowdloans.reduce((acc: number, { raised = 0 }) => acc + raised, 0))
    setProjects(crowdloanData.length)
    // setContributors(crowdloans.reduce((acc: number, { contributors = [] }) => acc + contributors.length, 0))
  }, [crowdloanData.length, crowdloans])

  return {
    raised,
    projects,
    contributors,
    hydrated,
  }
}

export const useCrowdloanReturns = () => {
  const { returns } = useCrowdloans()
  return returns
}

const CROWD_PREFIX = stringToU8a('modlpy/cfund')

function hasCrowdloadPrefix(accountId: AccountId): boolean {
  return u8aEq(accountId.slice(0, CROWD_PREFIX.length), CROWD_PREFIX)
}

export const Provider = ({ children }: PropsWithChildren) => {
  const [crowdloans, setCrowdloans] = useState<Crowdloan[]>([])
  const [hydrated, setHydrated] = useState(false)

  const loadable = useRecoilValueLoadable(
    waitForAll([
      crowdloanDataState,
      ...Object.values(SupportedRelaychains).map(relayChain => substrateApiState(relayChain.rpc)),
    ])
  )

  useEffect(() => {
    if (loadable.state === 'hasValue') {
      const [crowdloanData, ...chainApis] = loadable.contents
      const promises = Object.values(SupportedRelaychains)
        .map((chain, index) => ({ api: chainApis[index]!, chain }))
        .map(async ({ api, chain }) => {
          const bestNumber = await api.derive.chain.bestNumber()

          const funds = await api.query.crowdloan.funds.entries()
          const paraIds = await api.query.crowdloan.funds.keys().then(fund => fund.map(y => y.args[0]))
          const leases = await api.query.slots.leases.multi(paraIds)

          const leasePeriod = api.consts.slots.leasePeriod
          const leaseOffset = api.consts.slots.leaseOffset || new BN(0)

          const currentLeasePeriodIndex =
            bestNumber.toNumber() - leaseOffset.toNumber() < 0 ? null : bestNumber.sub(leaseOffset).div(leasePeriod)

          const endOfCurrentLeasePeriod = currentLeasePeriodIndex
            ? currentLeasePeriodIndex.mul(leasePeriod).add(leasePeriod).add(leaseOffset)
            : null

          const leasedParaIds = paraIds.filter((_, index) =>
            leases[index]?.some(lease => lease.isSome && hasCrowdloadPrefix(lease.unwrap()[0]))
          )

          return funds.map(([fundId, maybeFund]) => {
            const fund = maybeFund.unwrapOrDefault()
            const { tokenDecimals } = chain

            const fundLeaseEndBlock = fund.lastPeriod.mul(leasePeriod).add(leasePeriod).add(leaseOffset)

            const palletId = api.consts.crowdloan.palletId.toU8a()
            const fundIndex = fund.fundIndex.toU8a()

            const crowdloanFundAccountId = (() => {
              const EMPTY_H256 = new Uint8Array(32)
              return api.registry
                .createType('AccountId32', u8aConcat(stringToU8a('modl'), palletId, fundIndex, EMPTY_H256))
                .toString()
            })()

            const isCapped = fund.cap.sub(fund.raised).lt(api.consts.crowdloan.minContribution)
            const isEnded = bestNumber.gt(fund.end)
            const isWinner = leasedParaIds.some(lease => lease.eq(fundId.args[0]))

            return {
              ...fund.toJSON(),

              stash: crowdloanFundAccountId,

              id: `${chain.id}-${fundId.args[0].toNumber()}`,
              cap: Number(planckToTokens(fund.cap.toString(), tokenDecimals)),
              raised: Number(planckToTokens(fund.raised.toString(), tokenDecimals)),
              end: fund.end.toNumber(),
              parachain: {
                paraId: `${chain.id}-${fundId.args[0].toNumber()}`,
              },
              relayChainId: chain.id,
              percentRaised:
                (100 / Number(planckToTokens(fund.cap.toString(), tokenDecimals))) *
                Number(planckToTokens(fund.raised.toString(), tokenDecimals)),
              details: find(crowdloanData, {
                relayId: chain.id.toString(),
                paraId: fundId.args[0].toNumber().toString(),
              }),
              uiStatus: isWinner ? 'winner' : isCapped ? 'capped' : isEnded ? 'ended' : 'active',
              isCapped,
              isEnded,
              isWinner,

              bestNumber: bestNumber?.toNumber(),
              leasePeriod: leasePeriod?.toNumber(),
              leaseOffset: leaseOffset?.toNumber(),
              currentLeasePeriodIndex: currentLeasePeriodIndex?.toNumber(),
              endOfCurrentLeasePeriod: endOfCurrentLeasePeriod?.toNumber(),

              fundLeaseEndBlock: fundLeaseEndBlock?.toNumber(),
              lockedBlocks:
                (fundLeaseEndBlock?.toNumber?.() ?? 0) - (bestNumber?.toNumber?.() ?? Number.MAX_SAFE_INTEGER),
              lockedSeconds:
                ((fundLeaseEndBlock?.toNumber?.() ?? 0) - (bestNumber?.toNumber?.() ?? Number.MAX_SAFE_INTEGER)) * 6,
            } as Crowdloan
          })
        })

      void Promise.all(promises).then(result => {
        const sortByLockedSeconds = (a: { lockedSeconds?: number }, b: { lockedSeconds?: number }) =>
          (a.lockedSeconds ?? Number.MAX_SAFE_INTEGER) - (b.lockedSeconds ?? Number.MAX_SAFE_INTEGER)

        setCrowdloans(result.flat().slice().sort(sortByLockedSeconds))
        setHydrated(true)
      })
    }
  }, [loadable.contents, loadable.state])

  const allAccounts = useRecoilValue(selectedSubstrateAccountsState)
  const [returns, setReturns] = useState<Return[]>([])
  useEffect(() => {
    let cancelled = false

    const getReturns = async () =>
      (
        await Promise.allSettled(
          allAccounts
            .map(account => u8aToHex(decodeAnyAddress(account.address)))
            .map(async address => {
              const prefix1 = address.slice(2, 3)
              const prefix2 = address.slice(3, 4)
              const result = await fetch(
                `https://talismansociety.github.io/crowdloan-stats/returnsByUserAccount/${prefix1}/${prefix2}/${address}.json`
              )
              return (await result.json()) as Return[]
            })
        )
      ).flatMap(settled => (settled.status === 'fulfilled' ? settled.value : []))

    getReturns()
      .then(returns => {
        if (cancelled) return
        setReturns(returns)
      })
      .catch(error => console.warn('Failed to fetch returned crowdloan contributions', error))

    return () => {
      cancelled = true
    }
  }, [allAccounts])

  const value = useMemo(() => ({ crowdloans, hydrated, returns }), [crowdloans, hydrated, returns])

  return <Context.Provider value={value}>{children}</Context.Provider>
}
