import { type StakeStatus } from '../../../../../components/recipes/StakeStatusIndicator'
import { type Account } from '../../../../accounts/recoils'
import { useSubstrateApiState } from '../../../../common'
import { useAllPendingRewardsState, useEraStakersState } from '../recoils'
import { createAccounts, getPoolUnbonding } from '../utils'
import { useDeriveState, useQueryState } from '@talismn/react-polkadot-api'
import { useMemo } from 'react'
import { useRecoilValueLoadable, waitForAll } from 'recoil'

export const usePoolStakeLoadable = <T extends Account | Account[]>(account: T) => {
  const accounts = useMemo(() => (Array.isArray(account) ? (account as Account[]) : [account as Account]), [account])

  // TODO: recoil freeze if we use `useRecoilValue_TRANSITION_SUPPORT_UNSTABLE` here
  // and perform a stake operation inside the staking dialog & wait for the transition to finish
  // try again with next recoil version or when recoil transition hook is stable
  const pendingRewardsLoadable = useRecoilValueLoadable(useAllPendingRewardsState())
  const pendingRewards = useMemo(() => pendingRewardsLoadable.valueMaybe() ?? [], [pendingRewardsLoadable])

  const { state, contents } = useRecoilValueLoadable(
    waitForAll([
      useSubstrateApiState(),
      useQueryState(
        'nominationPools',
        'poolMembers.multi',
        accounts.map(({ address }) => address)
      ),
    ])
  )

  const [api, _poolMembers] = state === 'hasValue' ? contents : []

  const accountPools = useMemo(() => {
    if (state !== 'hasValue' || !_poolMembers || !api) return []
    return _poolMembers
      .map((x, index) => ({
        account: accounts[index]!,
        poolMembers: x,
        pendingRewards: pendingRewards.find(rewards => rewards[0] === accounts[index]?.address)?.[1],
      }))
      .filter(x => x.poolMembers.isSome)
      .map(x => ({ ...x, poolMember: x.poolMembers.unwrap() }))
  }, [_poolMembers, accounts, api, pendingRewards, state])

  const stashIds = useMemo(() => {
    if (!api || !accountPools.length) return []
    return accountPools.map(x => createAccounts(api, x.poolMember.poolId).stashId)
  }, [api, accountPools])

  const { state: loadableState, contents: loadableContents } = useRecoilValueLoadable(
    waitForAll([
      useQueryState('staking', 'nominators.multi', stashIds),
      useQueryState('staking', 'slashingSpans.multi', stashIds),
      useQueryState(
        'nominationPools',
        'metadata.multi',
        useMemo(() => accountPools.map(x => x.poolMember.poolId), [accountPools])
      ),
      useQueryState(
        'nominationPools',
        'claimPermissions.multi',
        useMemo(() => accountPools.map(x => x.account.address), [accountPools])
      ),
      useQueryState('staking', 'activeEra', []),
      useDeriveState('session', 'progress', []),
    ])
  )

  const [poolNominators, slashingSpans, poolMetadatum, claimPermissions, activeEra, sessionProgress] =
    loadableState === 'hasValue' ? loadableContents : []

  const eraStakersLoadable = useRecoilValueLoadable(useEraStakersState(activeEra?.unwrapOrDefault()?.index || 0))
  const _eraStakers = eraStakersLoadable.valueMaybe()
  const eraStakers = useMemo(() => {
    if (!_eraStakers) return new Set()
    return new Set(_eraStakers.map(x => x.toString()))
  }, [_eraStakers])

  const pools = useMemo(() => {
    if (
      loadableState !== 'hasValue' ||
      !poolNominators ||
      !slashingSpans ||
      !poolMetadatum ||
      !claimPermissions ||
      !activeEra ||
      !sessionProgress
    )
      return []
    return (
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
        })
    )
  }, [
    accountPools,
    activeEra,
    claimPermissions,
    eraStakers,
    loadableState,
    poolMetadatum,
    poolNominators,
    sessionProgress,
    slashingSpans,
  ])

  type Result = typeof pools

  type Return = T extends Account[] ? Result : Result[number] | undefined

  const data = useMemo(() => (Array.isArray(account) ? pools : pools.at(0)) as Return, [account, pools])
  return { state: eraStakersLoadable.state, data }
}

export type DerivedPoolLoadable = NonNullable<ReturnType<typeof usePoolStakeLoadable<Account>>>
