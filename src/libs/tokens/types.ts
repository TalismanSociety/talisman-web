type Address = string

type Addresses = Record<Address, Array<string> | null>

type AddressesByChain = { [chainId: string]: Address[] }

type AddressList = Address[]

type TokenList = Record<TokenId, Token & { isTestnet: boolean }>

type TokenId = string

type TokenIndex = number

type ChainId = string

type Token = NativeToken | OrmlToken

type TokenRates = {
  usd: number | null
  aud: number | null
  nzd: number | null
  cud: number | null
  hkd: number | null
  eur: number | null
  gbp: number | null
  jpy: number | null
  krw: number | null
  cny: number | null
  btc: number | null
  eth: number | null
  dot: number | null
}

type NativeToken = {
  type: 'native'
  id: TokenId
  name: string
  chainId: ChainId
  symbol: string
  decimals: number
  existentialDeposit: string
  coingeckoId: string
  rates: TokenRates
}

type OrmlToken = {
  type: 'orml'
  id: TokenId
  name: string
  chainId: ChainId
  index: TokenIndex
  symbol: string
  decimals: number
  existentialDeposit: string
  coingeckoId: string
  rates: TokenRates
}

type Chain = {
  id: ChainId
  sortIndex: number | null
  isTestnet: boolean
  genesisHash: string | null
  prefix: number | null
  name: string | null
  chainName: string
  implName: string | null
  specName: string | null
  specVersion: string | null
  nativeToken: { id: TokenId } | null
  tokensCurrencyIdIndex: number | null
  tokens: Array<{ id: TokenId }> | null
  account: string | null
  subscanUrl: string | null
  rpcs: Array<Rpc> | null
  ethereumExplorerUrl: string | null
  ethereumRpcs: Array<EthereumRpc> | null
  ethereumId: number | null
  isHealthy: boolean
  parathreads?: Chain[]
  paraId: number | null
  relay?: Chain
}

type Rpc = {
  url: string
  isHealthy: boolean
}

type EthereumRpc = {
  url: string
  isHealthy: boolean
}

type ChainList = Record<ChainId, Chain>

export type {
  Address,
  Addresses,
  AddressesByChain,
  AddressList,
  TokenList,
  TokenId,
  TokenIndex,
  ChainId,
  Token,
  TokenRates,
  Chain,
  ChainList,
  Rpc,
  EthereumRpc,
  NativeToken,
  OrmlToken,
}
