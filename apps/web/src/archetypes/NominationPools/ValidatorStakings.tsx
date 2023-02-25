import { ValidatorStakeList } from '@components/recipes/ValidatorStake'
import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { stakersRewardState } from '@domains/staking/recoils'
import { constSelector, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import useChainState from '../../domains/common/hooks/useChainState'
import ValidatorStakeItem from './ValidatorStakeItem'

const ValidatorStakings = () => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)

  const activeEra = useChainState('query', 'staking', 'activeEra', [])

  const stakes = useChainState('derive', 'staking', 'accounts', [
    accounts.map(({ address }) => address),
    undefined,
  ]).valueMaybe()

  const stakerRewards = useRecoilValueLoadable(
    activeEra.state !== 'hasValue'
      ? constSelector(undefined)
      : stakersRewardState(activeEra.contents.unwrapOrDefault().index.toNumber())
  )

  const stakesToDisplay = stakes
    ?.map((stake, index) => ({
      stake,
      account: accounts[index],
      reward: stakerRewards.valueMaybe()?.[accounts[index]?.address ?? ''],
    }))
    .filter(({ account, stake }) => account !== undefined && !stake.stakingLedger.active.unwrap().isZero())

  if (stakesToDisplay === undefined || stakesToDisplay?.length === 0) {
    return null
  }

  return (
    <ValidatorStakeList>
      {stakesToDisplay.map(({ stake, account, reward }) => (
        <ValidatorStakeItem account={account!} stake={stake} reward={reward} />
      ))}
    </ValidatorStakeList>
  )
}

export default ValidatorStakings
