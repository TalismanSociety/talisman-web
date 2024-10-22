import useSlpxProviders from './bifrost/useSlpxProviders'
import useSlpxSubstrateProviders from './bifrost/useSlpxSubstrateProviders'
import useNominationPoolsProviders from './nominationPools/useNominationPoolsProviders'
import useSubtensorProviders from './subtensor/useSubtensorProviders'
import { IToken } from '@talismn/chaindata-provider'

export type StakeProvider = 'Nomination pool' | 'Liquid staking' | 'Delegation'

export type Provider = {
  symbol: string | undefined
  logo: string | undefined
  chainName: string | undefined
  chainId: string | number
  type: StakeProvider
  provider: string | undefined
  unbondingPeriod: string | undefined
  stakePercentage: number | undefined
  actionLink: string
  nativeToken: IToken | any // TODO: Fix any
  rpc: string | undefined
  genesisHash: `0x${string}`
  apiEndpoint?: string
}

const useProvidersData = () => {
  const nominationPoolProviders = useNominationPoolsProviders()
  const slpxProviders = useSlpxProviders()
  const slpxSubstrateProviders = useSlpxSubstrateProviders()
  const subtensorProviders = useSubtensorProviders()

  const providersData: Provider[] = [
    ...nominationPoolProviders,
    ...slpxProviders,
    ...slpxSubstrateProviders,
    ...subtensorProviders,
  ]

  return providersData
}

export default useProvidersData
