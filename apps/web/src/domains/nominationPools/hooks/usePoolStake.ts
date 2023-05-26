import { type StakeStatus } from '@components/recipes/StakeStatusIndicator'
import { type Account } from '@domains/accounts/recoils'
import { useChainDeriveState, useChainQueryState, useSubstrateApiState } from '@domains/common'
import { useMemo } from 'react'
import { useRecoilValue, useRecoilValue_TRANSITION_SUPPORT_UNSTABLE, waitForAll } from 'recoil'
import { useAllPendingRewardsState, useEraStakersState } from '../recoils'
import { createAccounts, getPoolUnbonding } from '../utils'

export const usePoolStakes = <T extends Account | Account[]>(account: T) => {
  const accounts = useMemo(() => (Array.isArray(account) ? account : [account]), [account])

  const [api, pendingRewards] = useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(
    waitForAll([useSubstrateApiState(), useAllPendingRewardsState()])
  )

  const _poolMembers = useRecoilValue(
    useChainQueryState(
      'nominationPools',
      'poolMembers.multi',
      accounts.map(({ address }) => address)
    )
  )
  const accountPools = useMemo(
    () =>
      _poolMembers
        .map((x, index) => ({
          account: accounts[index],
          poolMembers: x,
          pendingRewards: pendingRewards.find(rewards => rewards[0] === accounts[index]?.address)?.[1],
        }))
        .filter(x => x.poolMembers.isSome)
        .map(x => ({ ...x, poolMember: x.poolMembers.unwrap() })),
    [_poolMembers, accounts, pendingRewards]
  )

  const stashIds = useMemo(
    () => accountPools.map(x => createAccounts(api, x.poolMember.poolId).stashId),
    [api, accountPools]
  )

  const [poolNominators, slashingSpans, poolMetadatum, activeEra, sessionProgress] = useRecoilValue(
    waitForAll([
      useChainQueryState('staking', 'nominators.multi', stashIds),
      useChainQueryState('staking', 'slashingSpans.multi', stashIds),
      useChainQueryState(
        'nominationPools',
        'metadata.multi',
        useMemo(() => accountPools.map(x => x.poolMember.poolId), [accountPools])
      ),
      useChainQueryState('staking', 'activeEra', []),
      useChainDeriveState('session', 'progress', []),
    ])
  )

  const _eraStakers = useRecoilValue(useEraStakersState(activeEra.unwrapOrDefault().index))
  const eraStakers = useMemo(() => new Set(_eraStakers.map(x => x[0].args[1].toHuman())), [_eraStakers])

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
          }
        }),
    [eraStakers, accountPools, poolMetadatum, poolNominators, sessionProgress, slashingSpans]
  )

  type Result = typeof pools

  type Return = T extends Account[] ? Result : Result[number] | undefined

  return useMemo(() => (Array.isArray(account) ? pools : pools.at(0)) as Return, [account, pools])
}
