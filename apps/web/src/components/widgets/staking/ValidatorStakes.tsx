import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { useSubstrateApiState } from '@domains/common'
import { useInjectedAccountFastUnstakeEligibility } from '@domains/fastUnstake'
import { useStakersRewardState } from '@domains/staking/recoils'
import { useDeriveState, useQueryMultiState, useQueryState } from '@talismn/react-polkadot-api'
import { useMemo } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'
import ValidatorStakeItem from './ValidatorStakeItem'
import ErrorBoundary from '../ErrorBoundary'

const useStakes = () => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const [activeEra, stakes] = useRecoilValue(
    waitForAll([
      useQueryState('staking', 'activeEra', []),
      useDeriveState('staking', 'accounts', [addresses, undefined]),
    ])
  )

  const slashingSpansLoadable = useRecoilValue(
    useQueryState('staking', 'slashingSpans.multi', stakes.map(staking => staking.stashId) ?? [])
  )

  const stakerRewards = useRecoilValueLoadable(useStakersRewardState(activeEra.unwrapOrDefault().index.toNumber()))

  return stakes
    ?.map((stake, index) => {
      const reward = stakerRewards.valueMaybe()?.[accounts[index]?.address ?? '']
      return {
        stake,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        account: accounts[index]!,
        reward,
        slashingSpan: (slashingSpansLoadable[index]?.unwrapOrDefault().prior.length ?? -1) + 1,
        inFastUnstakeQueue: false,
      }
    })
    .filter(({ account, stake }) => account !== undefined && !stake.stakingLedger.active.unwrap().isZero())
}

const useStakesWithFastUnstake = () => {
  const stakes = useStakes()

  const [api, [erasToCheckPerBlock, fastUnstakeHead], queues] = useRecoilValue(
    waitForAll([
      useSubstrateApiState(),
      useQueryMultiState(['fastUnstake.erasToCheckPerBlock', 'fastUnstake.head']),
      useQueryState(
        'fastUnstake',
        'queue.multi',
        useMemo(() => stakes.map(x => x.account.address), [stakes])
      ),
    ])
  )

  const accountEligibilityLoadable = useInjectedAccountFastUnstakeEligibility()

  return stakes.map((x, index) => ({
    ...x,
    eligibleForFastUnstake:
      !erasToCheckPerBlock.isZero() &&
      accountEligibilityLoadable[x.account.address] &&
      (x.stake.redeemable?.isZero() ?? true) &&
      (x.stake.unlocking?.length ?? 0) === 0,
    inFastUnstakeHead: fastUnstakeHead.unwrapOrDefault().stashes.some(y => y[0].eq(x.stake.accountId)),
    inFastUnstakeQueue: !queues[index]?.unwrapOrDefault().isZero() ?? false,
    fastUnstakeDeposit: api.consts.fastUnstake.deposit,
  }))
}

const BaseValidatorStakes = () => {
  const stakes = useStakes()

  if (stakes === undefined || stakes?.length === 0) {
    return null
  }

  return (
    <>
      {stakes.map((props, index) => (
        <ErrorBoundary key={index} orientation="horizontal">
          <ValidatorStakeItem {...props} />
        </ErrorBoundary>
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
      {stakes.map((props, index) => (
        <ErrorBoundary key={index} orientation="horizontal">
          <ValidatorStakeItem key={index} {...props} />
        </ErrorBoundary>
      ))}
    </>
  )
}

const ValidatorStakes = () => {
  const api = useRecoilValue(useSubstrateApiState())

  return api.query.fastUnstake !== undefined ? <ValidatorStakesWithFastUnstake /> : <BaseValidatorStakes />
}

export default ValidatorStakes
