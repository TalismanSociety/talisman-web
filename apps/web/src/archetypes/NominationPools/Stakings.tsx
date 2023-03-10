import { PoolStatus } from '@components/recipes/PoolStatusIndicator'
import StakeItem from '@components/recipes/StakeItem'
import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { createAccounts, getPoolUnbonding } from '@domains/nominationPools/utils'
import { Button, CircularProgressIndicator, HiddenDetails, Text } from '@talismn/ui'
import { Maybe } from '@util/monads'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { constSelector, useRecoilValueLoadable, useRecoilValue_TRANSITION_SUPPORT_UNSTABLE, waitForAll } from 'recoil'

import { apiState } from '../../domains/chains/recoils'
import useChainState from '../../domains/common/hooks/useChainState'
import { allPendingPoolRewardsState, eraStakersState } from '../../domains/nominationPools/recoils'
import PoolStakeItem from './PoolStakeItem'

const Stakings = () => {
  const [api, pendingRewards, accounts] = useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(
    waitForAll([apiState, allPendingPoolRewardsState, selectedSubstrateAccountsState])
  )

  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address)
  )

  const poolNominatorsLoadable = useChainState(
    'query',
    'staking',
    'nominators.multi',
    poolMembersLoadable.valueMaybe()?.map(x => createAccounts(api, x.unwrapOrDefault().poolId).stashId) ?? [],
    { enabled: poolMembersLoadable.state === 'hasValue' }
  )

  const slashingSpans = useChainState(
    'query',
    'staking',
    'slashingSpans.multi',
    poolMembersLoadable.valueMaybe()?.map(x => createAccounts(api, x.unwrapOrDefault().poolId).stashId) ?? []
  )

  const poolMetadatumLoadable = useChainState(
    'query',
    'nominationPools',
    'metadata.multi',
    poolMembersLoadable.valueMaybe()?.map(x => x.unwrapOrDefault().poolId) ?? [],
    { enabled: poolMembersLoadable.state === 'hasValue' }
  )

  const activeEraLoadable = useChainState('query', 'staking', 'activeEra', [])

  const sessionProgressLoadable = useChainState('derive', 'session', 'progress', [])

  const eraStakersLoadable = useRecoilValueLoadable(
    activeEraLoadable.state !== 'hasValue'
      ? constSelector(undefined)
      : eraStakersState(activeEraLoadable.contents.unwrapOrDefault().index)
  )

  const eraStakers = useMemo(
    () => Maybe.of(eraStakersLoadable.valueMaybe()).mapOrUndefined(x => new Set(x.map(x => x[0].args[1].toHuman()))),
    [eraStakersLoadable]
  )

  const pools = useMemo(
    () =>
      poolMembersLoadable.state !== 'hasValue' || sessionProgressLoadable.state !== 'hasValue'
        ? undefined
        : poolMembersLoadable.contents
            // Calculate unbondings
            .map((poolMember, index) => ({
              account: accounts[index],
              poolMember,
              ...getPoolUnbonding(poolMember.unwrapOrDefault(), sessionProgressLoadable.contents),
            }))
            // Calculate remaining values
            .map(({ poolMember, ...rest }, index) => {
              const status: PoolStatus | undefined = (() => {
                if (poolNominatorsLoadable.state !== 'hasValue' || eraStakers === undefined) {
                  return undefined
                }

                const targets = poolNominatorsLoadable.contents[index]?.unwrapOrDefault().targets

                if (targets?.length === 0) return 'not_nominating'

                return targets?.some(x => eraStakers.has(x.toHuman())) ? 'earning_rewards' : 'waiting'
              })()

              const priorLength = slashingSpans.valueMaybe()?.[index]?.unwrapOr(undefined)?.prior.length
              const slashingSpan = priorLength === undefined ? 0 : priorLength + 1

              return {
                ...rest,
                status,
                poolName: poolMetadatumLoadable.valueMaybe()?.[index]?.toUtf8() ?? (
                  <CircularProgressIndicator size="1em" />
                ),
                poolMember,
                pendingRewards: pendingRewards.find(rewards => rewards[0] === accounts[index]?.address)?.[1],
                slashingSpan,
              }
            })
            .filter(x => x.poolMember.isSome)
            .map(x => ({ ...x, poolMember: x.poolMember.unwrapOrDefault() })),
    [
      poolMembersLoadable.state,
      poolMembersLoadable.contents,
      sessionProgressLoadable.state,
      sessionProgressLoadable.contents,
      accounts,
      slashingSpans,
      poolMetadatumLoadable,
      pendingRewards,
      poolNominatorsLoadable.state,
      poolNominatorsLoadable.contents,
      eraStakers,
    ]
  )

  return (
    <div>
      {poolMembersLoadable.valueMaybe()?.every(pool => pool.isNone) || pools?.length === 0 ? (
        <HiddenDetails
          hidden
          overlay={
            <div
              css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '3.2rem',
              }}
            >
              <Text.Body>You have no staked assets yet...</Text.Body>
              <Button as={Link} variant="outlined" to="/staking">
                Get started
              </Button>
            </div>
          }
        >
          <section css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            <StakeItem.Skeleton animate={false} />
            <StakeItem.Skeleton animate={false} />
          </section>
        </HiddenDetails>
      ) : (
        <section css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          {pools?.map((pool, index) => (
            <PoolStakeItem key={index} item={pool} />
          ))}
        </section>
      )}
    </div>
  )
}

export default Stakings
