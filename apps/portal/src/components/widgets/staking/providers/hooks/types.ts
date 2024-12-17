import type { SlpxPair } from '@/domains/staking/slpx/types'
import type { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'

export type NativeToken = {
  decimals?: number
  symbol: string
  address?: `0x${string}` | string
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
  symbol: string
  logo: string
  chainName: string
  chainId: string | number
  type: StakeProvider
  typeId: StakeProviderTypeId
  provider: string | undefined
  actionLink: string
  nativeToken?: NativeToken
  genesisHash: `0x${string}`
  apiEndpoint?: string
  tokenPair?: SlpxPair | SlpxSubstratePair
}
