import { StakeStatus } from '@components/recipes/StakeStatusIndicator'
import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { useChainDeriveState, useChainQueryState, useSubstrateApiState } from '@domains/common'
import { createAccounts, getPoolUnbonding } from '@domains/nominationPools/utils'
import { CircularProgressIndicator } from '@talismn/ui'
import { useMemo } from 'react'
import { useRecoilValue, useRecoilValue_TRANSITION_SUPPORT_UNSTABLE, waitForAll } from 'recoil'

import { useAllPendingRewardsState, useEraStakersState } from '../../domains/nominationPools/recoils'
import PoolStakeItem from './PoolStakeItem'

const Stakings = () => {
  const [api, pendingRewards, accounts] = useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(
    waitForAll([useSubstrateApiState(), useAllPendingRewardsState(), selectedSubstrateAccountsState])
  )

  const poolMembers = useRecoilValue(
    useChainQueryState(
      'nominationPools',
      'poolMembers.multi',
      accounts.map(({ address }) => address)
    )
  )

  const [poolNominators, slashingSpans, poolMetadatum, activeEra, sessionProgress] = useRecoilValue(
    waitForAll([
      useChainQueryState(
        'staking',
        'nominators.multi',
        poolMembers.map(x => createAccounts(api, x.unwrapOrDefault().poolId).stashId)
      ),
      useChainQueryState(
        'staking',
        'slashingSpans.multi',
        poolMembers.map(x => createAccounts(api, x.unwrapOrDefault().poolId).stashId)
      ),
      useChainQueryState(
        'nominationPools',
        'metadata.multi',
        poolMembers.map(x => x.unwrapOrDefault().poolId)
      ),
      useChainQueryState('staking', 'activeEra', []),
      useChainDeriveState('session', 'progress', []),
    ])
  )

  const _eraStakers = useRecoilValue(useEraStakersState(activeEra.unwrapOrDefault().index))
  const eraStakers = useMemo(() => new Set(_eraStakers.map(x => x[0].args[1].toHuman())), [_eraStakers])

  const pools = useMemo(
    () =>
      poolMembers
        // Calculate unbondings
        .map((poolMember, index) => ({
          account: accounts[index],
          poolMember,
          ...getPoolUnbonding(poolMember.unwrapOrDefault(), sessionProgress),
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
            poolName: poolMetadatum[index]?.toUtf8() ?? <CircularProgressIndicator size="1em" />,
            poolMember,
            pendingRewards: pendingRewards.find(rewards => rewards[0] === accounts[index]?.address)?.[1],
            slashingSpan,
          }
        })
        .filter(x => x.poolMember.isSome)
        .map(x => ({ ...x, poolMember: x.poolMember.unwrapOrDefault() })),
    [accounts, eraStakers, pendingRewards, poolMembers, poolMetadatum, poolNominators, sessionProgress, slashingSpans]
  )

  return (
    <section css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      {pools?.map((pool, index) => (
        <PoolStakeItem key={index} item={pool} />
      ))}
    </section>
  )
}

export default Stakings
