import { graphql } from '../../../generated/gql/crowdloan/gql'
import type { ContributionsQuery } from '../../../generated/gql/crowdloan/gql/graphql'
import { selectedSubstrateAccountsState } from '../../domains/accounts'
import { useChainmetaValue } from '../talisman'
import { encodeAnyAddress } from '@talismn/util'
import BigNumber from 'bignumber.js'
import { request } from 'graphql-request'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInterval } from 'react-use'
import { useRecoilValue } from 'recoil'

type ContributionsIndexerConfig = {
  accountIndex: number
  genesisHash: string
  indexerUrl: string
  setStateFn: (contributions: _GqlContribution[]) => void
  setHydratedFn: (hydrated: boolean) => void
}

const ContributionsIndexerConfigs = {
  polkadot: {
    indexerUrl: import.meta.env.REACT_APP_DOT_CROWDLOAN_INDEXER,
    accountIndex: 0,
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
  },
  kusama: {
    indexerUrl: import.meta.env.REACT_APP_KSM_CROWDLOAN_INDEXER,
    accountIndex: 2,
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
  },
}

export type CrowdloanContribution = {
  id: string
  account: string
  amount: string

  // the associated parachain
  parachain: { paraId: string }

  // the associated crowdloan
  fund: { id: string }
}

type _GqlContribution = ContributionsQuery['contributions'][0] & { relay: { genesisHash: string } }
export type GqlContribution = ContributionsQuery['contributions'][0] & {
  relay: { genesisHash: string }
  blockNumber: number
  blockPeriod: number
  lockedSeconds: number
  isLocked: boolean
  isUnlockingSoon: boolean
  isFundsReturned: boolean
  oldAndReturned: boolean
}

export function useCrowdloanContributions(accounts?: string[]): {
  gqlContributions: GqlContribution[]
  sortedGqlContributions: GqlContribution[]
  hydrated: boolean
} {
  const allAccounts = useRecoilValue(selectedSubstrateAccountsState)

  const [dotContributions, setDotContributions] = useState<_GqlContribution[]>([])
  const [ksmContributions, setKsmContributions] = useState<_GqlContribution[]>([])

  const [dotHydrated, setDotHydrated] = useState(false)
  const [ksmHydrated, setKsmHydrated] = useState(false)

  const fetchGqlContributions = useCallback(
    ({ accountIndex, genesisHash, indexerUrl, setStateFn, setHydratedFn }: ContributionsIndexerConfig) => {
      let cancelled = false

      const addresses = (accounts ?? allAccounts.map(account => account.address)).map(address =>
        encodeAnyAddress(address, accountIndex)
      )

      const promise = request(
        indexerUrl,
        graphql(`
          query contributions($addresses: [String!]!) {
            contributions(where: { account: { id_in: $addresses } }, orderBy: id_ASC) {
              id
              crowdloan {
                id
                fundIndex
                fundAccount
                paraId

                depositor
                end
                cap
                firstPeriod
                lastPeriod
                lastBlock

                createdBlockNumber
                createdTimestamp

                dissolved
                dissolvedBlockNumber
                dissolvedTimestamp
              }
              account {
                id
              }
              amount
              returned
              blockNumber
              timestamp
            }
          }
        `),
        { addresses }
      )

      promise
        .then(contributions => {
          if (cancelled) return

          const gqlContributions = contributions.contributions.map(contribution => ({
            ...contribution,
            relay: { genesisHash },
          }))
          const byAccountFundIndex = new Map<string, _GqlContribution>()
          gqlContributions.forEach(contribution => {
            const accountFundIndex = `${contribution.account.id}-${contribution.crowdloan.fundIndex}`
            const additionalAmount = BigInt(byAccountFundIndex.get(accountFundIndex)?.amount ?? '0')

            byAccountFundIndex.set(accountFundIndex, {
              ...contribution,
              amount: (BigInt(contribution.amount) + additionalAmount).toString(),
              crowdloan: {
                ...contribution.crowdloan,
                lastBlock: contribution.crowdloan.dissolvedBlockNumber ?? contribution.crowdloan.lastBlock,
              },
            })
          })
          setStateFn(Array.from(byAccountFundIndex.values()))
          setHydratedFn(true)
        })
        .catch(error => {
          console.error('Failed to fetch contributions', error)
        })

      return () => {
        cancelled = true
      }
    },
    [accounts, allAccounts]
  )

  const fetchDotContributions = useCallback(() => {
    fetchGqlContributions({
      ...ContributionsIndexerConfigs.polkadot,
      setStateFn: setDotContributions,
      setHydratedFn: setDotHydrated,
    })
  }, [fetchGqlContributions])

  const fetchKsmContributions = useCallback(() => {
    fetchGqlContributions({
      ...ContributionsIndexerConfigs.kusama,
      setStateFn: setKsmContributions,
      setHydratedFn: setKsmHydrated,
    })
  }, [fetchGqlContributions])

  const { recentDotBlock, recentDotPeriod, recentKsmBlock, recentKsmPeriod, updateRecentBlocks } = useRecentBlocks()

  // fetch on load
  useEffect(() => {
    updateRecentBlocks()

    const cancelDot = fetchDotContributions
    const cancelKsm = fetchKsmContributions

    return () => {
      cancelDot()
      cancelKsm()
    }
  }, [fetchDotContributions, fetchKsmContributions, updateRecentBlocks])

  // re-fetch every 2 minutes
  useInterval(() => {
    updateRecentBlocks()

    fetchDotContributions()
    fetchKsmContributions()
  }, 120_000)

  const gqlContributions = useMemo(
    () =>
      [...dotContributions, ...ksmContributions].flatMap(contribution => {
        const isDot = contribution.relay.genesisHash === ContributionsIndexerConfigs.polkadot.genesisHash
        const isKsm = contribution.relay.genesisHash === ContributionsIndexerConfigs.kusama.genesisHash

        const blockNumber = (isDot ? recentDotBlock : isKsm ? recentKsmBlock : 0) ?? 0
        const blockPeriod = (isDot ? recentDotPeriod : isKsm ? recentKsmPeriod : 6) ?? 6

        const lockedSeconds = ((contribution.crowdloan.lastBlock ?? 0) - blockNumber) * blockPeriod

        const isLocked = lockedSeconds > 0
        const isUnlockingSoon = lockedSeconds <= 60 * 60 * 72 // 72 hours

        const isFundsReturned = contribution.returned || contribution.crowdloan.dissolved

        // hide returned contributions which were unlocked more than 30 days ago
        const oldAndReturned = isFundsReturned && lockedSeconds < -60 * 60 * 24 * 30
        if (oldAndReturned) return []

        return {
          ...contribution,

          /** Updated every 2 minutes */
          blockNumber,
          /** Updated every 2 minutes */
          blockPeriod,
          /** Updated every 2 minutes */
          lockedSeconds,
          /** Updated every 2 minutes */
          isLocked,
          /** Updated every 2 minutes */
          isUnlockingSoon,
          /** Updated every 2 minutes */
          isFundsReturned,
          /** Updated every 2 minutes */
          oldAndReturned,
        }
      }),
    [dotContributions, ksmContributions, recentDotBlock, recentDotPeriod, recentKsmBlock, recentKsmPeriod]
  )

  const sortedGqlContributions = useMemo(() => {
    return gqlContributions.slice().sort((a, b) => {
      const aLockedSeconds = a.lockedSeconds ?? Number.MAX_SAFE_INTEGER
      const bLockedSeconds = b.lockedSeconds ?? Number.MAX_SAFE_INTEGER

      if (aLockedSeconds !== bLockedSeconds) return aLockedSeconds - bLockedSeconds
      if (a.crowdloan.fundIndex !== b.crowdloan.fundIndex) return a.crowdloan.fundIndex - b.crowdloan.fundIndex
      return a.timestamp - b.timestamp
    })
  }, [gqlContributions])

  return {
    gqlContributions,
    sortedGqlContributions,
    hydrated: dotHydrated && recentDotBlock !== null && ksmHydrated && recentKsmBlock !== null,
  }
}

//
// Helpers (exported)
//

export function groupTotalContributionsByCrowdloan(contributions: CrowdloanContribution[]) {
  return contributions.reduce<Record<string, string>>((perCrowdloan, contribution) => {
    if (!perCrowdloan[contribution.fund.id]) perCrowdloan[contribution.fund.id] = '0'
    perCrowdloan[contribution.fund.id] =
      new BigNumber(perCrowdloan[contribution.fund.id] ?? 0).plus(contribution.amount).toString() ??
      perCrowdloan[contribution.fund.id]
    return perCrowdloan
  }, {})
}

export function getTotalContributionForCrowdloan(crowdloan: string, contributions: CrowdloanContribution[]) {
  return contributions
    .filter(contribution => contribution.fund.id === crowdloan)
    .map(contribution => contribution.amount)
    .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
    .toString()
}

//
// Helpers (internal)
//

// We need this for sorting, but we don't want to update every UI component every 6s
// So we'll only do the calculation every 15 minutes
function useRecentBlocks() {
  const [[recentDotBlock, recentDotPeriod], setRecentDot] = useState<[number | null, number | null]>([null, null])
  const [[recentKsmBlock, recentKsmPeriod], setRecentKsm] = useState<[number | null, number | null]>([null, null])

  const dotBlockNumber = useChainmetaValue(0, 'blockNumber')
  const dotBlockPeriod = useChainmetaValue(0, 'blockPeriod')

  const ksmBlockNumber = useChainmetaValue(2, 'blockNumber')
  const ksmBlockPeriod = useChainmetaValue(2, 'blockPeriod')

  const updateRecentBlocks = useCallback(() => {
    if (dotBlockNumber === null || ksmBlockNumber === null) return

    setRecentDot([parseInt(dotBlockNumber ?? '0'), dotBlockPeriod])
    setRecentKsm([parseInt(ksmBlockNumber ?? '0'), ksmBlockPeriod])
  }, [dotBlockNumber, dotBlockPeriod, ksmBlockNumber, ksmBlockPeriod])

  return { recentDotBlock, recentDotPeriod, recentKsmBlock, recentKsmPeriod, updateRecentBlocks }
}
