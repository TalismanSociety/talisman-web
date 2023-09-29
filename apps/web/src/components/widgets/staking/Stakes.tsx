import SectionHeader from '@components/molecules/SectionHeader'
import StakeItem from '@components/recipes/StakeItem'
import { ChainProvider, chainsState } from '@domains/chains'
import { useSubstrateFiatTotalStaked } from '@domains/staking'
import { Button, HiddenDetails, Text } from '@talismn/ui'
import { Suspense, useId } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import AnimatedFiatNumber from '../AnimatedFiatNumber'
import ErrorBoundary from '../ErrorBoundary'
import PoolStakes from './PoolStakes'
import ValidatorStakes from './ValidatorStakes'

const NoStakePrompt = (props: { className?: string }) => (
  <div className={props.className}>
    <HiddenDetails
      hidden
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
      <section css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <StakeItem.Skeleton animate={false} />
        <StakeItem.Skeleton animate={false} />
      </section>
    </HiddenDetails>
  </div>
)

const StakeTotal = () => <AnimatedFiatNumber end={useSubstrateFiatTotalStaked().fiatTotal} />

const StakeHeader = () => {
  return (
    <SectionHeader
      headlineText="Staking"
      supportingText={
        <ErrorBoundary fallback={<></>}>
          <Suspense>
            <StakeTotal />
          </Suspense>
        </ErrorBoundary>
      }
    />
  )
}

const Stakes = () => {
  const chains = useRecoilValue(chainsState)
  const skeletonId = useId()

  return (
    <div id="staking">
      <StakeHeader />
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
          [`[class~="${skeletonId}"]:first-of-type`]: { display: 'revert' },
        }}
      >
        {chains.map((chain, index) => (
          <Suspense
            key={index}
            fallback={<StakeItem.Skeleton className={skeletonId} css={{ order: 1, display: 'none' }} />}
          >
            <ChainProvider chain={chain}>
              <ErrorBoundary orientation="horizontal">
                <PoolStakes />
              </ErrorBoundary>
              <ErrorBoundary orientation="horizontal">
                <ValidatorStakes />
              </ErrorBoundary>
            </ChainProvider>
          </Suspense>
        ))}
        <NoStakePrompt css={{ 'display': 'none', ':only-child': { display: 'revert' } }} />
      </div>
    </div>
  )
}

export default Stakes
