import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { useChainDeriveState, useChainQueryMultiState, useChainQueryState } from '@domains/common'
import { useFastUnstakeEligibleAccountsState } from '@domains/fastUnstake/hooks'
import { stakersRewardState } from '@domains/staking/recoils'
import { useMemo } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

import ValidatorStakeItem from './ValidatorStakeItem'

const ValidatorStakings = () => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const [[activeEra, erasToCheckPerBlock, fastUnstakeHead], queues, stakes] = useRecoilValue(
    waitForAll([
      useChainQueryMultiState(['staking.activeEra', 'fastUnstake.erasToCheckPerBlock', 'fastUnstake.head']),
      useChainQueryState('fastUnstake', 'queue.multi', addresses),
      useChainDeriveState('staking', 'accounts', [addresses, undefined]),
      useChainQueryState('fastUnstake', 'queue.multi', addresses),
    ])
  )

  const slashingSpans = useRecoilValue(
    useChainQueryState(
      'staking',
      'slashingSpans.multi',
      useMemo(() => stakes.map(staking => staking.stashId), [stakes])
    )
  )

  // Long running operations
  const stakerRewards = useRecoilValueLoadable(stakersRewardState(activeEra.unwrapOrDefault().index.toNumber()))
  const fastUnstakeEligibleAccounts = useRecoilValueLoadable(useFastUnstakeEligibleAccountsState())

  const stakesToDisplay = stakes
    .map((stake, index) => {
      const reward = stakerRewards.valueMaybe()?.[accounts[index]?.address ?? '']

      return {
        stake,
        account: accounts[index]!,
        reward,
        slashingSpan: (slashingSpans[index]?.unwrapOrDefault().prior.length ?? -1) + 1,
        eligibleForFastUnstake: fastUnstakeEligibleAccounts
          .valueMaybe()
          ?.some(x => x.address === accounts[index]?.address),
        potentiallyEligibleForFastUnstake: !erasToCheckPerBlock?.isZero() && reward === 0n,
        inFastUnstakeHead: fastUnstakeHead.unwrapOrDefault().stashes.some(x => x[0].eq(stake.accountId)),
        inFastUnstakeQueue: !queues[index]?.unwrapOrDefault().isZero() ?? false,
      }
    })
    .filter(
      ({ account, stake, inFastUnstakeHead, inFastUnstakeQueue }) =>
        (account !== undefined && !stake.stakingLedger.active.unwrap().isZero()) ||
        inFastUnstakeHead ||
        inFastUnstakeQueue
    )

  if (stakesToDisplay.length === 0) {
    return null
  }

  return (
    <section css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      {stakesToDisplay.map(props => (
        <ValidatorStakeItem {...props} />
      ))}
    </section>
  )
}

export default ValidatorStakings
