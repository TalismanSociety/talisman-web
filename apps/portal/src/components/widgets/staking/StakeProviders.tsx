import { StakeProviderList } from '../../recipes/StakeProvider'
import ErrorBoundary from '../ErrorBoundary'
import DappStakingProviders from './dappStaking/StakeProviders'
import LidoStakeProviders from './lido/StakeProviders'
import SlpxStakeProviders from './slpx/StakeProviders'
import SlpxSubstrateStakeProviders from './slpxSubstrate/SlpxSubstrateStakeProviders'
import NominationPoolsStakeProviders from './substrate/StakeProviders'
import SubtensorStakeProviders from './subtensor/StakeProviders'

const StakeProviders = () => {
  return (
    <StakeProviderList>
      <ErrorBoundary orientation="horizontal">
        <NominationPoolsStakeProviders />
      </ErrorBoundary>
      <ErrorBoundary orientation="horizontal">
        <SlpxStakeProviders />
      </ErrorBoundary>
      <ErrorBoundary orientation="horizontal">
        <SlpxSubstrateStakeProviders />
      </ErrorBoundary>
      <ErrorBoundary orientation="horizontal">
        <SubtensorStakeProviders />
      </ErrorBoundary>
      <ErrorBoundary orientation="horizontal">
        <DappStakingProviders />
      </ErrorBoundary>
      <ErrorBoundary orientation="horizontal">
        <LidoStakeProviders />
      </ErrorBoundary>
    </StakeProviderList>
  )
}

export default StakeProviders
