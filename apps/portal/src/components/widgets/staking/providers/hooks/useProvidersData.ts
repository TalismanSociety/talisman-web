import useSlpxProviders from './bifrost/useSlpxProviders'
import useSlpxSubstrateProviders from './bifrost/useSlpxSubstrateProviders'
import useDappProviders from './dapp/useDappProviders'
import useLidoProviders from './lido/useLidoProviders'
import useNominationPoolsProviders from './nominationPools/useNominationPoolsProviders'
import useSubtensorProviders from './subtensor/useSubtensorProviders'
import { Provider } from './types'

const useProvidersData = () => {
  const nominationPoolProviders = useNominationPoolsProviders()
  const slpxProviders = useSlpxProviders()
  const slpxSubstrateProviders = useSlpxSubstrateProviders()
  const subtensorProviders = useSubtensorProviders()
  const dappProviders = useDappProviders()
  const lidoProviders = useLidoProviders()

  const providersData: Provider[] = [
    ...nominationPoolProviders,
    ...slpxProviders,
    ...slpxSubstrateProviders,
    ...subtensorProviders,
    ...dappProviders,
    ...lidoProviders,
  ]

  return providersData
}

export default useProvidersData
