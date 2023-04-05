import { StakeStatus } from '@components/recipes/StakeStatusIndicator'
import { Account } from '@domains/accounts/recoils'
import { useChainDeriveState, useChainQueryState, useSubstrateApiState } from '@domains/common'
import { useMemo } from 'react'
import { useRecoilValue, useRecoilValue_TRANSITION_SUPPORT_UNSTABLE, waitForAll } from 'recoil'
import { useAllPendingRewardsState, useEraStakersState } from '../recoils'
import { createAccounts, getPoolUnbonding } from '../utils'

export const usePoolStakes = (accounts: Account[]) => {
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
  const poolMembers = useMemo(() => _poolMembers.filter(x => x.isSome).map(x => x.unwrap()), [_poolMembers])

  const stashIds = useMemo(() => poolMembers.map(x => createAccounts(api, x.poolId).stashId), [api, poolMembers])

  const [poolNominators, slashingSpans, poolMetadatum, activeEra, sessionProgress] = useRecoilValue(
    waitForAll([
      useChainQueryState('staking', 'nominators.multi', stashIds),
      useChainQueryState('staking', 'slashingSpans.multi', stashIds),
      useChainQueryState(
        'nominationPools',
        'metadata.multi',
        useMemo(() => poolMembers.map(x => x.poolId), [poolMembers])
      ),
      useChainQueryState('staking', 'activeEra', []),
      useChainDeriveState('session', 'progress', []),
    ])
  )

  const _eraStakers = useRecoilValue(useEraStakersState(activeEra.unwrapOrDefault().index))
  const eraStakers = useMemo(() => new Set(_eraStakers.map(x => x[0].args[1].toHuman())), [_eraStakers])

  return useMemo(
    () =>
      poolMembers
        // Calculate unbondings
        .map((poolMember, index) => ({
          account: accounts[index],
          poolMember,
          ...getPoolUnbonding(poolMember, sessionProgress),
        }))
        // Calculate remaining values
        .map(({ poolMember, ...rest }, index) => {
          const status: StakeStatus = (() => {
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
            pendingRewards: pendingRewards.find(rewards => rewards[0] === accounts[index]?.address)?.[1],
            slashingSpan,
          }
        }),
    [accounts, eraStakers, pendingRewards, poolMembers, poolMetadatum, poolNominators, sessionProgress, slashingSpans]
  )
}
