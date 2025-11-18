import { useMemo } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

import { type StakeStatus } from '@/components/recipes/StakeStatusIndicator'
import { type Account } from '@/domains/accounts/recoils'
import { useChainState } from '@/domains/chains/hooks'
import { chainDeriveState, chainQueryState } from '@/domains/common/recoils/query'

import { eraStakersState, useAllPendingRewardsState } from '../recoils'
import { createAccounts, getPoolUnbonding } from '../utils'
import { useBabeApi } from './useBabeApi'
import { useNominationPoolsEndpoint } from './useNominationPoolsEndpoint'

export const usePoolStakes = <T extends Account | Account[]>(account: T) => {
  const chain = useRecoilValue(useChainState())
  const accounts = useMemo(() => (Array.isArray(account) ? (account as Account[]) : [account as Account]), [account])

  // TODO: recoil freeze if we use `useRecoilValue_TRANSITION_SUPPORT_UNSTABLE` here
  // and perform a stake operation inside the staking dialog & wait for the transition to finish
  // try again with next recoil version or when recoil transition hook is stable
  const pendingRewardsLoadable = useRecoilValueLoadable(useAllPendingRewardsState())
  const pendingRewards = useMemo(() => pendingRewardsLoadable.valueMaybe() ?? [], [pendingRewardsLoadable])

  const api = useBabeApi(chain.id)

  // Get the appropriate RPC endpoint for nomination pool queries
  // For parachains (like Kusama Asset Hub), this will return the relay chain RPC endpoint
  const nominationPoolsEndpoint = useNominationPoolsEndpoint(chain.id) || chain.rpc

  // Current chain endpoint for Asset Hub queries
  const currentChainEndpoint = chain.rpc

  if (!api) {
    console.error('❌ API is not ready for chain:', chain.id)
  }

  if (!nominationPoolsEndpoint) {
    console.error('❌ No nomination pools endpoint found for chain:', chain.id)
  }

  // Query pool members from the current chain (Asset Hub has pool membership data)
  const [_poolMembers] = useRecoilValue(
    waitForAll([
      chainQueryState(
        currentChainEndpoint,
        'nominationPools',
        'poolMembers.multi',
        accounts.map(({ address }) => address)
      ),
    ])
  )

  const accountPools = useMemo(
    () =>
      _poolMembers
        .map((x, index) => ({
          account: accounts[index]!,
          poolMembers: x,
          pendingRewards: pendingRewards.find(rewards => rewards[0] === accounts[index]?.address)?.[1],
        }))
        .filter(x => x.poolMembers.isSome)
        .map(x => ({ ...x, poolMember: x.poolMembers.unwrap() })),
    [_poolMembers, accounts, pendingRewards]
  )

  const stashIds = useMemo(
    () => accountPools.map(x => createAccounts(api!, x.poolMember.poolId).stashId),
    [api, accountPools]
  )

  const poolIds = useMemo(() => accountPools.map(x => x.poolMember.poolId), [accountPools])
  const accountAddresses = useMemo(() => accountPools.map(x => x.account.address), [accountPools])

  // Mixed query strategy for Kusama Asset Hub:
  // - Pool data (members, metadata, nominators, claimPermissions) from Asset Hub
  // - Era/session data and slashingSpans from relay chain
  const [poolMetadatum, claimPermissions, poolNominators, slashingSpans, activeEra, sessionProgress] = useRecoilValue(
    waitForAll([
      // Asset Hub queries - nominationPools pallet data
      chainQueryState(currentChainEndpoint, 'nominationPools', 'metadata.multi', poolIds),
      chainQueryState(currentChainEndpoint, 'nominationPools', 'claimPermissions.multi', accountAddresses),
      chainQueryState(currentChainEndpoint, 'staking', 'nominators.multi', stashIds),
      chainQueryState(nominationPoolsEndpoint, 'staking', 'slashingSpans.multi', stashIds),
      // Relay chain queries - for era and session information
      chainQueryState(currentChainEndpoint, 'staking', 'activeEra', []),
      chainDeriveState(currentChainEndpoint, 'session', 'progress', []),
    ])
  )

  // Use the relay chain endpoint for era stakers query
  const _eraStakers = useRecoilValue(
    eraStakersState({ endpoint: currentChainEndpoint!, era: activeEra.unwrapOrDefault().index })
  )
  const eraStakers = useMemo(() => new Set(_eraStakers.map(x => x.toString())), [_eraStakers])

  const pools = useMemo(
    () =>
      accountPools
        // Calculate unbondings
        .map(({ account, poolMember, pendingRewards }) => ({
          account,
          poolMember,
          pendingRewards,
          ...getPoolUnbonding(poolMember, sessionProgress),
        }))
        // Calculate remaining values
        .map(({ poolMember, ...rest }, index) => {
          const status: StakeStatus = (() => {
            if (poolMember.points.isZero()) {
              return 'not_earning_rewards'
            }

            const targets = poolNominators[index]?.unwrapOrDefault().targets

            if (targets?.length === 0) return 'not_nominating'

            return targets?.some(x => eraStakers.has(x.toHuman())) ? 'earning_rewards' : 'waiting'
          })()

          const priorLength = slashingSpans[index]?.unwrapOr(undefined)?.prior.length
          const slashingSpan = priorLength === undefined ? 0 : priorLength + 1

          return {
            ...rest,
            status,
            poolName: poolMetadatum[index]?.toUtf8(),
            poolMember,
            totalUnlocking: rest.unlockings.reduce((previous, current) => previous + current.amount, 0n),
            slashingSpan,
            claimPermission: claimPermissions[index],
          }
        }),
    [accountPools, claimPermissions, eraStakers, poolMetadatum, poolNominators, sessionProgress, slashingSpans]
  )

  type Result = typeof pools

  type Return = T extends Account[] ? Result : Result[number] | undefined

  return useMemo(() => (Array.isArray(account) ? pools : pools.at(0)) as Return, [account, pools])
}

export type DerivedPool = NonNullable<ReturnType<typeof usePoolStakes<Account>>>
