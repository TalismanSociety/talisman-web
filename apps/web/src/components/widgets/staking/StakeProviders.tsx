import NominationPoolsStakeProviders from './substrate/StakeProviders'
import LidoStakeProviders from './lido/StakeProviders'
import SlpxStakeProviders from './slpx/StakeProviders'
import { StakeProviderList } from '@components/recipes/StakeProvider'

const StakeProviders = () => {
  return (
    <StakeProviderList>
      <NominationPoolsStakeProviders />
      <LidoStakeProviders />
      <SlpxStakeProviders />
    </StakeProviderList>
  )
}

export default StakeProviders
