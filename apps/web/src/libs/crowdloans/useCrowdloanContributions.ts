import { selectedSubstrateAccountsState } from '@domains/accounts'
import { encodeAnyAddress } from '@talismn/util'
import BigNumber from 'bignumber.js'
import { request } from 'graphql-request'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInterval } from 'react-use'
import { useRecoilValue } from 'recoil'
import { graphql } from '../../../generated/gql/crowdloan/gql'
import type { ContributionsQuery } from '../../../generated/gql/crowdloan/gql/graphql'

type ContributionsIndexerConfig = {
  accountIndex: number
  genesisHash: string
  indexerUrl: string
  setStateFn: (contributions: GqlContribution[]) => void
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

export type GqlContribution = ContributionsQuery['contributions'][0] & { relay: { genesisHash: string } }

export function useCrowdloanContributions(accounts?: string[]): {
  gqlContributions: GqlContribution[]
  hydrated: boolean
} {
  const allAccounts = useRecoilValue(selectedSubstrateAccountsState)
  const [hydrated, setHydrated] = useState(false)

  const [dotContributions, setDotContributions] = useState<GqlContribution[]>([])
  const [ksmContributions, setKsmContributions] = useState<GqlContribution[]>([])

  const fetchGqlContributions = useCallback(
    ({ accountIndex, genesisHash, indexerUrl, setStateFn }: ContributionsIndexerConfig) => {
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
          const byAccountFundIndex = new Map<string, GqlContribution>()
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
          setHydrated(true)
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
    fetchGqlContributions({ ...ContributionsIndexerConfigs.polkadot, setStateFn: setDotContributions })
  }, [fetchGqlContributions])
  const fetchKsmContributions = useCallback(() => {
    fetchGqlContributions({ ...ContributionsIndexerConfigs.kusama, setStateFn: setKsmContributions })
  }, [fetchGqlContributions])

  useEffect(() => {
    const cancel = fetchDotContributions
    return cancel
  }, [fetchDotContributions])
  useEffect(() => {
    const cancel = fetchKsmContributions
    return cancel
  }, [fetchKsmContributions])
  useInterval(fetchKsmContributions, 120_000) // re-fetch every 2 minutes

  return {
    gqlContributions: useMemo(() => [...dotContributions, ...ksmContributions], [dotContributions, ksmContributions]),
    hydrated,
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
