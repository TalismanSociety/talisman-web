import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { useStakersRewardState } from '@domains/staking/recoils'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

import { useChainDeriveState, useChainQueryMultiState, useChainQueryState, useSubstrateApiState } from '@domains/common'
import { useMemo } from 'react'
import ValidatorStakeItem from './ValidatorStakeItem'
import { useFastUnstakeEligibleAccountsState } from '@domains/fastUnstake/hooks'

const useStakes = () => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const [activeEra, stakes] = useRecoilValue(
    waitForAll([
      useChainQueryState('staking', 'activeEra', []),
      useChainDeriveState('staking', 'accounts', [addresses, undefined]),
    ])
  )

  const slashingSpansLoadable = useRecoilValue(
    useChainQueryState('staking', 'slashingSpans.multi', stakes.map(staking => staking.stashId) ?? [])
  )

  const stakerRewards = useRecoilValueLoadable(useStakersRewardState(activeEra.unwrapOrDefault().index.toNumber()))

  return stakes
    ?.map((stake, index) => {
      const reward = stakerRewards.valueMaybe()?.[accounts[index]?.address ?? '']
      return {
        stake,
        account: accounts[index]!,
        reward,
        slashingSpan: (slashingSpansLoadable[index]?.unwrapOrDefault().prior.length ?? -1) + 1,
        potentiallyEligibleForFastUnstake: false,
        inFastUnstakeHead: false,
        inFastUnstakeQueue: false,
      }
    })
    .filter(({ account, stake }) => account !== undefined && !stake.stakingLedger.active.unwrap().isZero())
}

const useStakesWithFastUnstake = () => {
  const stakes = useStakes()

  const [[erasToCheckPerBlock, fastUnstakeHead], queues] = useRecoilValue(
    waitForAll([
      useChainQueryMultiState(['fastUnstake.erasToCheckPerBlock', 'fastUnstake.head']),
      useChainQueryState(
        'fastUnstake',
        'queue.multi',
        useMemo(() => stakes.map(x => x.account.address), [stakes])
      ),
    ])
  )

  // This operation take upward to 30 seconds
  // hence we return a loadable instead of suspending
  const eligibleAccountsLoadable = useRecoilValueLoadable(useFastUnstakeEligibleAccountsState())

  return stakes.map((x, index) => ({
    ...x,
    eligibleForFastUnstake: eligibleAccountsLoadable.valueMaybe()?.some(y => y.address === x.account.address),
    potentiallyEligibleForFastUnstake: !erasToCheckPerBlock?.isZero() && x.reward === 0n,
    inFastUnstakeHead: fastUnstakeHead.unwrapOrDefault().stashes.some(y => y[0].eq(x.stake.accountId)),
    inFastUnstakeQueue: !queues[index]?.unwrapOrDefault().isZero() ?? false,
  }))
}

const BaseValidatorStakes = () => {
  const stakes = useStakes()

  if (stakes === undefined || stakes?.length === 0) {
    return null
  }

  return (
    <>
      {stakes.map(props => (
        <ValidatorStakeItem {...props} />
      ))}
    </>
  )
}

const ValidatorStakesWithFastUnstake = () => {
  const stakes = useStakesWithFastUnstake()

  if (stakes === undefined || stakes?.length === 0) {
    return null
  }

  return (
    <>
      {stakes.map(props => (
        <ValidatorStakeItem {...props} />
      ))}
    </>
  )
}

const ValidatorStakes = () => {
  const api = useRecoilValue(useSubstrateApiState())

  return api.query.fastUnstake !== undefined ? <ValidatorStakesWithFastUnstake /> : <BaseValidatorStakes />
}

export default ValidatorStakes
