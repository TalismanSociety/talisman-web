import uniq from 'lodash/uniq'
import { useMemo } from 'react'

import useDappProviders from './dapp/useDappProviders'
import useLidoProviders from './lido/useLidoProviders'
import useNominationPoolsProviders from './nominationPools/useNominationPoolsProviders'
import useSeekProviders from './seek/useSeekProviders'
import useSubtensorProviders from './subtensor/useSubtensorProviders'
import { Provider } from './types'

const useProvidersData = () => {
  const nominationPoolProviders = useNominationPoolsProviders()
  const subtensorProviders = useSubtensorProviders()
  const dappProviders = useDappProviders()
  const lidoProviders = useLidoProviders()
  const seekProviders = useSeekProviders()

  const providersData: Provider[] = [
    ...seekProviders,
    ...nominationPoolProviders,
    ...subtensorProviders,
    ...dappProviders,
    ...lidoProviders,
  ]

  return providersData
}

export default useProvidersData

export const useStakingBalancesEnabledTokens = () => {
  const allProviders = useProvidersData()

  const balancesEnabledTokenIds = useMemo(
    () => uniq(allProviders.flatMap(provider => provider.balancesTokenIds).filter(Boolean)),
    [allProviders]
  )

  return balancesEnabledTokenIds
}
