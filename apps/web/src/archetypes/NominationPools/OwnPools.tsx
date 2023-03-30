import SectionHeader from '@components/molecules/SectionHeader'
import StakeItem from '@components/recipes/StakeItem'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { useChainState } from '@domains/common/hooks'
import { useTotalStaked } from '@domains/staking/hooks'
import { Button, HiddenDetails, Text } from '@talismn/ui'
import { PropsWithChildren, Suspense, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import Stakings from './Stakings'
import ValidatorStakings from './ValidatorStakings'

const StakingHeader = () => {
  const totalStaked = useTotalStaked()

  return (
    <SectionHeader headlineText="Staking" supportingText={<AnimatedFiatNumber end={totalStaked.fiatAmount ?? 0} />} />
  )
}

const NoStakeGuard = (props: PropsWithChildren) => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(({ address }) => address), [accounts])

  const poolMembersLoadable = useChainState('query', 'nominationPools', 'poolMembers.multi', addresses)
  const ledgersLoadable = useChainState('query', 'staking', 'ledger.multi', addresses)

  const hidden = useMemo(
    () =>
      poolMembersLoadable.valueMaybe()?.every(x => x.isNone) &&
      ledgersLoadable.valueMaybe()?.every(x => x.unwrapOrDefault().active.unwrap().isZero()),
    [ledgersLoadable, poolMembersLoadable]
  )

  return (
    <HiddenDetails
      hidden={hidden}
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
      {hidden ? (
        <section css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          <StakeItem.Skeleton animate={false} />
          <StakeItem.Skeleton animate={false} />
        </section>
      ) : (
        props.children
      )}
    </HiddenDetails>
  )
}

const OwnPools = () => (
  <div id="staking">
    <Suspense
      fallback={
        <div>
          <SectionHeader headlineText="Staking" />
          <section css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            <StakeItem.Skeleton />
            <StakeItem.Skeleton />
          </section>
        </div>
      }
    >
      <div>
        <StakingHeader />
        <NoStakeGuard>
          <div
            css={{
              'display': 'flex',
              'flexDirection': 'column',
              'gap': '1.6rem',
              '> *:empty': {
                display: 'none',
              },
            }}
          >
            <Stakings />
            <ValidatorStakings />
          </div>
        </NoStakeGuard>
      </div>
    </Suspense>
  </div>
)

export default OwnPools
