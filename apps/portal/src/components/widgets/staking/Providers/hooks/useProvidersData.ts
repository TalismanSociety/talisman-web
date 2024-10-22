import useSlpxProviders from './bifrost/useSlpxProviders'
import useNominationPoolsProviders from './nominationPools/useNominationPoolsProviders'
import { IToken } from '@talismn/chaindata-provider'

export type StakeProvider = 'Nomination pool' | 'Liquid staking'

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

  const providersData: Provider[] = [...nominationPoolProviders, ...slpxProviders]

  return providersData
}

export default useProvidersData
