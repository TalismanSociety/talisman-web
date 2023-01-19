import Text from '@components/atoms/Text'
import PoolStake, { PoolStakeList } from '@components/recipes/PoolStake/PoolStake'
import { selectedPolkadotAccountsState } from '@domains/accounts/recoils'
import { useChainState } from '@domains/common/hooks'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'

import Stakings from './Stakings'
import Unstakings from './Unstakings'
import ValidatorStakings from './ValidatorStakings'
import ValidatorUnstakings from './ValidatorUnstakings'

const UnstakingHeader = () => {
  const accounts = useRecoilValue(selectedPolkadotAccountsState)

  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address)
  )

  const stakingsLoadable = useChainState('derive', 'staking', 'accounts', [
    accounts.map(({ address }) => address),
    undefined,
  ])

  const hasUnstakings =
    poolMembersLoadable.valueMaybe()?.some(x => x.unwrapOrDefault().unbondingEras.size > 0) ||
    stakingsLoadable.valueMaybe()?.some(x => !x.redeemable?.isZero() || (x.unlocking?.length ?? 0) > 0)

  if (!hasUnstakings) {
    return null
  }

  return (
    <header css={{ marginTop: '4rem' }}>
      <Text.H4 css={{ marginBottom: '1.6rem' }}>Unstaking</Text.H4>
    </header>
  )
}

const OwnPools = () => (
  <div id="staking">
    <Suspense
      fallback={
        <div>
          <header>
            <Text.H4 css={{ marginBottom: '2.4rem' }}>Staking</Text.H4>
          </header>
          <PoolStakeList>
            <PoolStake.Skeleton />
            <PoolStake.Skeleton />
            <PoolStake.Skeleton />
          </PoolStakeList>
        </div>
      }
    >
      <div>
        <header>
          <Text.H4 css={{ marginBottom: '1.6rem' }}>Staking</Text.H4>
        </header>
        <div
          css={{
            'display': 'flex',
            'flexDirection': 'column',
            'gap': '2.8rem',
            '> *:empty': {
              display: 'none',
            },
          }}
        >
          <ValidatorStakings />
          <Stakings />
        </div>
      </div>
      <div>
        <UnstakingHeader />
        <div
          css={{
            'display': 'flex',
            'flexDirection': 'column',
            'gap': '2.8rem',
            '> *:empty': {
              display: 'none',
            },
          }}
        >
          <ValidatorUnstakings />
          <Unstakings />
        </div>
      </div>
    </Suspense>
  </div>
)

export default OwnPools
