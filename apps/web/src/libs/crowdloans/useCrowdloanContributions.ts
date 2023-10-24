import { selectedSubstrateAccountsState } from '@domains/accounts'
import { substrateApiState } from '@domains/common'
import { request } from 'graphql-request'
import { SupportedRelaychains } from '@libs/talisman/util/_config'
import { u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import { Maybe } from '@util/monads'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'
import { graphql } from '../../../generated/gql/crowdloan/gql'
import type { ContributionsQuery } from '../../../generated/gql/crowdloan/gql/graphql'
import { encodeAnyAddress } from '@talismn/util'

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

export function useCrowdloanContributions({
  accounts,
  crowdloans,
}: { accounts?: string[]; crowdloans?: string[] } = {}): {
  contributions: CrowdloanContribution[]
  gqlContributions: GqlContribution[]
  hydrated: boolean
} {
  // TODO: clean me or kill me
  const apisLoadable = useRecoilValueLoadable(
    waitForAll(Object.values(SupportedRelaychains).map(relayChain => substrateApiState(relayChain.rpc)))
  )

  const allAccounts = useRecoilValue(selectedSubstrateAccountsState)
  const [contributions, setContributions] = useState<CrowdloanContribution[]>([])
  const [hydrated, setHydrated] = useState(false)

  const [gqlContributions, setGqlContributions] = useState<GqlContribution[]>([])
  useEffect(() => {
    let cancelled = false

    const promise = request(
      import.meta.env.REACT_APP_DOT_CROWDLOAN_INDEXER,
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
      {
        addresses: (accounts ?? allAccounts.map(account => account.address)).map(address =>
          encodeAnyAddress(address, 0)
        ),
      }
    )

    promise
      .then(contributions => {
        if (cancelled) return

        const gqlContributions = contributions.contributions.map(contribution => ({
          ...contribution,
          relay: { genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3' },
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
        setGqlContributions(Array.from(byAccountFundIndex.values()))
        setHydrated(true)
      })
      .catch(error => {
        console.error('Failed to fetch contributions', error)
      })

    return () => {
      cancelled = true
    }
  }, [accounts, allAccounts])

  useEffect(
    () => {
      void (async () => {
        const results = await Promise.all(
          Object.values(SupportedRelaychains).map(async (relayChain, index) => {
            const apis = await apisLoadable.toPromise()
            const api = apis[index]
            if (!api) return []

            const paraIds =
              crowdloans?.map(x => Maybe.of(x.split('-')[1]).mapOr(0, x => parseInt(x))) ??
              (await api.query.crowdloan.funds.keys().then(x => x.map(y => y.args[0].toNumber()))) ??
              []

            const accountsHex = (accounts ?? allAccounts.map(x => x.address)).map(a => u8aToHex(decodeAddress(a))) ?? []

            const contributions = await Promise.all(
              paraIds.map(async id => await api.derive.crowdloan.ownContributions(id, accountsHex))
            )

            // TODO: axe everything this is only to support legacy UI
            return contributions
              .flatMap((x, index) =>
                Object.entries(x).map(([account, contributed]) => ({
                  id: `${relayChain.id}-${paraIds[index] ?? ''}`,
                  account: account.toString(),
                  amount: contributed.toString(),
                  parachain: {
                    paraId: `${relayChain.id}-${paraIds[index] ?? ''}`,
                  },
                  fundId: `${relayChain.id}-${paraIds[index] ?? ''}`,
                  fund: {
                    id: `${relayChain.id}-${paraIds[index] ?? ''}`,
                  },
                }))
              )
              .filter(x => x.amount !== '0')
          })
        )

        setContributions(results.flat())
        setHydrated(true)
      })()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(accounts), JSON.stringify(crowdloans), JSON.stringify(allAccounts)]
  )

  return {
    contributions,
    gqlContributions,
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
