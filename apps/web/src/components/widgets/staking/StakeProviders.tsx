import NominationPoolsStakeProviders from './substrate/StakeProviders'
import LidoStakeProviders from './lido/StakeProviders'
import SlpxStakeProviders from './slpx/StakeProviders'
import { StakeProviderList } from '@components/recipes/StakeProvider'
import ErrorBoundary from '../ErrorBoundary'

const StakeProviders = () => {
  return (
    <StakeProviderList>
      <ErrorBoundary orientation="horizontal">
        <NominationPoolsStakeProviders />
      </ErrorBoundary>
      <ErrorBoundary orientation="horizontal">
        <LidoStakeProviders />
      </ErrorBoundary>
      <ErrorBoundary orientation="horizontal">
        <SlpxStakeProviders />
      </ErrorBoundary>
    </StakeProviderList>
  )
}

export default StakeProviders
