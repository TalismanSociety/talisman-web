import { ValidatorStakeList } from '@components/recipes/ValidatorStake'
import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { Maybe } from '@util/monads'
import { useRecoilValue } from 'recoil'

import useChainState from '../../domains/common/hooks/useChainState'
import ValidatorStakeItem from './ValidatorStakeItem'

const ValidatorStakings = () => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)

  const activeEra = useChainState('query', 'staking', 'activeEra', []).valueMaybe()

  const stakes = useChainState('derive', 'staking', 'accounts', [
    accounts.map(({ address }) => address),
    undefined,
  ]).valueMaybe()

  const stakerRewards = useChainState(
    'derive',
    'staking',
    'stakerRewardsMultiEras',
    [
      accounts.map(({ address }) => address),
      Maybe.of(activeEra?.unwrapOrDefault().index).mapOrUndefined(index => [index.subn(1) as any, index])!,
    ],
    { enabled: activeEra !== undefined }
  ).valueMaybe()

  const stakesToDisplay = stakes
    ?.map((stake, index) => ({ stake, account: accounts[index], reward: stakerRewards?.[index] }))
    .filter(({ account, stake }) => account !== undefined && !stake.stakingLedger.active.unwrap().isZero())

  if (stakesToDisplay === undefined || stakesToDisplay?.length === 0) {
    return null
  }

  return (
    <ValidatorStakeList>
      {stakesToDisplay.map(({ stake, account, reward }) => (
        <ValidatorStakeItem account={account!} stake={stake} rewards={reward} />
      ))}
    </ValidatorStakeList>
  )
}

export default ValidatorStakings
