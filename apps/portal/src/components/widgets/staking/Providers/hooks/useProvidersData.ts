import useNominationPoolsProviders from './nominationPools/useNominationPoolsProviders'
import { IToken } from '@talismn/chaindata-provider'

export type StakeProvider = 'Nomination pool'

export type Provider = {
  symbol: string | undefined
  logo: string | undefined
  chainName: string | undefined
  chainId: string
  type: StakeProvider
  provider: string | undefined
  unbondingPeriod: string | undefined
  stakePercentage: number | undefined
  actionLink: string
  nativeToken: IToken | undefined
  rpc: string | undefined
}

const useProvidersData = () => {
  const nominationPoolProviders = useNominationPoolsProviders()

  const providersData: Provider[] = [...nominationPoolProviders]

  return providersData
}

export default useProvidersData
