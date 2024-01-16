import SectionHeader from '@components/molecules/SectionHeader'
import StakePosition, { StakePositionList } from '@components/recipes/StakePosition'
import { ChainProvider, chainsState } from '@domains/chains'
import { useTotalStaked } from '@domains/staking'
import { Button, HiddenDetails, Text } from '@talismn/ui'
import { Fragment, Suspense, type PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import AnimatedFiatNumber from '../AnimatedFiatNumber'
import ErrorBoundary from '../ErrorBoundary'
import LidoStakes from './lido/Stakes'
import SlpxStakes from './slpx/Stakes'
import PoolStakes from './substrate/PoolStakes'
import ValidatorStakes from './substrate/ValidatorStakes'

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
        <StakePosition.Skeleton animate={false} />
        <StakePosition.Skeleton animate={false} />
      </section>
    </HiddenDetails>
  </div>
)

const StakeTotal = () => <AnimatedFiatNumber end={useTotalStaked()} />

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

const skellyClassName = 'staking-skeleton'

const SuspenseSkeleton = (props: PropsWithChildren) => (
  <Suspense fallback={<StakePosition.Skeleton className={skellyClassName} css={{ order: 1 }} />} {...props} />
)

const Stakes = (props: { hideHeader?: boolean }) => {
  const chains = useRecoilValue(chainsState)

  return (
    <div id="staking">
      {!props.hideHeader && <StakeHeader />}
      <StakePositionList
        css={{
          [`[class~=${skellyClassName}]:not(:nth-last-child(1 of [class~=${skellyClassName}]))`]: { display: 'none' },
        }}
      >
        {chains.map((chain, index) => (
          <Fragment key={index}>
            <ChainProvider chain={chain}>
              <ErrorBoundary orientation="horizontal">
                <SuspenseSkeleton>
                  <PoolStakes />
                </SuspenseSkeleton>
              </ErrorBoundary>
              <ErrorBoundary orientation="horizontal">
                <SuspenseSkeleton>
                  <ValidatorStakes />
                </SuspenseSkeleton>
              </ErrorBoundary>
            </ChainProvider>
          </Fragment>
        ))}
        <ErrorBoundary orientation="horizontal">
          <SuspenseSkeleton>
            <SlpxStakes />
          </SuspenseSkeleton>
        </ErrorBoundary>
        <ErrorBoundary orientation="horizontal">
          <SuspenseSkeleton>
            <LidoStakes />
          </SuspenseSkeleton>
        </ErrorBoundary>
        <NoStakePrompt css={{ 'display': 'none', ':only-child': { display: 'revert' } }} />
      </StakePositionList>
    </div>
  )
}

export default Stakes
