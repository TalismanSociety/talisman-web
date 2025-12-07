export type NativeToken = {
  decimals?: number
  symbol: string
  address?: `0x${string}` | string
}

export type StakeProvider =
  | 'Nomination pool'
  | 'Liquid staking'
  | 'Delegation'
  | 'DApp staking'
  | 'Subnet Staking'
  | 'Seek Staking'
export type StakeProviderTypeId =
  | 'delegationSubtensor'
  | 'dappStaking'
  | 'nominationPool'
  | 'liquidStakingLido'
  | 'seekStaking'

export type Provider = {
  /** required for balances to be loaded for this provider's token in the account picker and portfolio totals sections */
  balancesTokenIds: string[]
  symbol: string
  logo: string
  chainName: string
  chainId: string | number
  type: StakeProvider
  typeId: StakeProviderTypeId
  provider: string | undefined
  actionLink: string
  nativeToken?: NativeToken
  genesisHash?: `0x${string}`
  apiEndpoint?: string
  position?: string
  hasDTaoStaking?: boolean
  isDisabled?: boolean
}
