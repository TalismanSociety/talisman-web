import useSlpxProviders from './bifrost/useSlpxProviders'
import useSlpxSubstrateProviders from './bifrost/useSlpxSubstrateProviders'
import useDappProviders from './dapp/useDappProviders'
import useLidoProviders from './lido/useLidoProviders'
import useNominationPoolsProviders from './nominationPools/useNominationPoolsProviders'
import useSubtensorProviders from './subtensor/useSubtensorProviders'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { IToken } from '@talismn/chaindata-provider'

export type NativeToken = {
  decimals: number
  symbol: string
  address?: string
}
export type StakeProvider = 'Nomination pool' | 'Liquid staking' | 'Delegation' | 'DApp staking'
export type StakeProviderTypeId =
  | 'liquidStakingSlpx'
  | 'liquidStakingSlpxSubstrate'
  | 'delegationSubtensor'
  | 'dappStaking'
  | 'nominationPool'
  | 'liquidStakingLido'

export type Provider = {
  symbol: string | undefined
  logo: string
  chainName: string | undefined
  chainId: string | number
  type: StakeProvider
  typeId: StakeProviderTypeId
  provider: string | undefined
  stakePercentage: number | undefined
  actionLink: string
  nativeToken: IToken | NativeToken | any // TODO: Fix any
  rpc?: string | undefined
  genesisHash?: `0x${string}` | undefined
  apiEndpoint?: string
  tokenPair?: SlpxPair | SlpxSubstratePair
}

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
