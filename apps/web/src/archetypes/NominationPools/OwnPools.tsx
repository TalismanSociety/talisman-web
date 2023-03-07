import PoolStake, { PoolStakeList } from '@components/recipes/PoolStake/PoolStake'
import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { useChainState } from '@domains/common/hooks'
import { useTotalStaked } from '@domains/staking/hooks'
import { useTheme } from '@emotion/react'
import { Text } from '@talismn/ui'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'

import Stakings from './Stakings'
import ValidatorStakings from './ValidatorStakings'
import ValidatorUnstakings from './ValidatorUnstakings'

const UnstakingHeader = () => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)

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

const StakingHeader = () => {
  const theme = useTheme()
  const totalStaked = useTotalStaked()
  return (
    <header>
      <Text.H4 css={{ marginBottom: '2.4rem' }}>
        Staking
        <span css={{ color: theme.color.primary, marginLeft: '0.85em' }}>{totalStaked.localizedFiatAmount}</span>
      </Text.H4>
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
        <StakingHeader />
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
        </div>
      </div>
    </Suspense>
  </div>
)

export default OwnPools
