import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { useStakersRewardState } from '@domains/staking/recoils'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

import { useChainDeriveState, useChainQueryState } from '@domains/common'
import ValidatorStakeItem from './ValidatorStakeItem'

const ValidatorStakings = () => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)

  const [activeEra, stakes] = useRecoilValue(
    waitForAll([
      useChainQueryState('staking', 'activeEra', []),
      useChainDeriveState('staking', 'accounts', [accounts.map(({ address }) => address), undefined]),
    ])
  )
  const slashingSpansLoadable = useRecoilValue(
    useChainQueryState('staking', 'slashingSpans.multi', stakes.map(staking => staking.stashId) ?? [])
  )

  const stakerRewards = useRecoilValueLoadable(useStakersRewardState(activeEra.unwrapOrDefault().index.toNumber()))

  const stakesToDisplay = stakes
    ?.map((stake, index) => ({
      stake,
      account: accounts[index],
      reward: stakerRewards.valueMaybe()?.[accounts[index]?.address ?? ''],
      slashingSpan: (slashingSpansLoadable[index]?.unwrapOrDefault().prior.length ?? -1) + 1,
    }))
    .filter(({ account, stake }) => account !== undefined && !stake.stakingLedger.active.unwrap().isZero())

  if (stakesToDisplay === undefined || stakesToDisplay?.length === 0) {
    return null
  }

  return (
    <section css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      {stakesToDisplay.map(({ stake, account, reward, slashingSpan }) => (
        <ValidatorStakeItem account={account!} stake={stake} reward={reward} slashingSpan={slashingSpan} />
      ))}
    </section>
  )
}

export default ValidatorStakings
