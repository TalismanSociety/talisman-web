import { ValidatorStakeList } from '@components/recipes/ValidatorStake'
import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { useQueryMulti } from '@domains/common/hooks'
import { useFastUnstakeEligibleAccounts } from '@domains/fastUnstake/hooks'
import { stakersRewardState } from '@domains/staking/recoils'
import { constSelector, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import useChainState from '../../domains/common/hooks/useChainState'
import ValidatorStakeItem from './ValidatorStakeItem'

const ValidatorStakings = () => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)

  const queriesLoadable = useQueryMulti(['staking.activeEra', 'fastUnstake.erasToCheckPerBlock'])
  const erasToCheckPerBlock = queriesLoadable.valueMaybe()?.[1]

  const stakes = useChainState('derive', 'staking', 'accounts', [
    accounts.map(({ address }) => address),
    undefined,
  ]).valueMaybe()

  const stakerRewards = useRecoilValueLoadable(
    queriesLoadable.state !== 'hasValue'
      ? constSelector(undefined)
      : stakersRewardState(queriesLoadable.contents[0].unwrapOrDefault().index.toNumber())
  )

  const fastUnstakeEligibleAccounts = useFastUnstakeEligibleAccounts()

  const stakesToDisplay = stakes
    ?.map((stake, index) => {
      const reward = stakerRewards.valueMaybe()?.[accounts[index]?.address ?? '']

      return {
        stake,
        account: accounts[index],
        reward,
        eligibleForFastUnstake: fastUnstakeEligibleAccounts
          .valueMaybe()
          ?.some(x => x.address === accounts[index]?.address),
        potentiallyEligibleForFastUnstake: !erasToCheckPerBlock?.isZero() && reward === 0n,
      }
    })
    .filter(({ account, stake }) => account !== undefined && !stake.stakingLedger.active.unwrap().isZero())

  if (stakesToDisplay === undefined || stakesToDisplay?.length === 0) {
    return null
  }

  return (
    <ValidatorStakeList>
      {stakesToDisplay.map(({ stake, account, reward, eligibleForFastUnstake, potentiallyEligibleForFastUnstake }) => (
        <ValidatorStakeItem
          account={account!}
          stake={stake}
          reward={reward}
          eligibleForFastUnstake={eligibleForFastUnstake}
          potentiallyEligibleForFastUnstake={potentiallyEligibleForFastUnstake}
        />
      ))}
    </ValidatorStakeList>
  )
}

export default ValidatorStakings
