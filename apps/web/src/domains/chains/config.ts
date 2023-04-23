import { githubChainLogoUrl, githubTokenLogoUrl } from '@talismn/chaindata-provider'

export type ChainParameters = {
  auctionAdjust: number
  auctionMax: number
  falloff: number
  maxInflation: number
  minInflation: number
  stakeTarget: number
}

/**
 * Values from Parity Dashboard
 * https://github.com/paritytech/polkadot-staking-dashboard/blob/8c136141141e6a74ddd838aa20df48a20a35749e/src/config/networks.ts
 */
export const defaultParams: ChainParameters = {
  auctionAdjust: 0,
  auctionMax: 0,
  falloff: 0.05,
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.5,
}

export type Chain = {
  id: string
  genesisHash: string
  isTestnet: boolean
  rpc: string
  nativeToken: {
    symbol: string
    coingeckoId: string | undefined
    logo: string
  }
  subscanUrl: string
  parameters: ChainParameters
  priorityPool: number | undefined
}

export const chains = [
  {
    id: 'polkadot',
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
    isTestnet: false,
    rpc: 'wss://rpc.polkadot.io',
    nativeToken: {
      symbol: 'DOT',
      coingeckoId: 'polkadot',
      logo: githubTokenLogoUrl('dot'),
    },
    subscanUrl: 'https://polkadot.subscan.io/',
    /**
     * Values from Parity Dashboard
     * https://github.com/paritytech/polkadot-staking-dashboard/blob/8c136141141e6a74ddd838aa20df48a20a35749e/src/config/networks.ts
     */
    parameters: { ...defaultParams, stakeTarget: 0.75 },
    priorityPool: undefined,
  },
  {
    id: 'kusama',
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
    isTestnet: false,
    rpc: 'wss://kusama-rpc.polkadot.io',
    nativeToken: {
      symbol: 'KSM',
      coingeckoId: 'kusama',
      logo: githubTokenLogoUrl('ksm'),
    },
    subscanUrl: 'https://kusama.subscan.io/',
    /**
     * Values from Parity Dashboard
     * https://github.com/paritytech/polkadot-staking-dashboard/blob/8c136141141e6a74ddd838aa20df48a20a35749e/src/config/networks.ts
     */
    parameters: { ...defaultParams, auctionAdjust: 0.3 / 60, auctionMax: 60, stakeTarget: 0.75 },
    priorityPool: 15,
  },
  {
    id: 'aleph',
    genesisHash: '0x70255b4d28de0fc4e1a193d7e175ad1ccef431598211c55538f1018651a0344e',
    isTestnet: false,
    rpc: 'wss://ws.azero.dev',
    nativeToken: {
      symbol: 'AZERO',
      coingeckoId: 'aleph-zero',
      logo: githubChainLogoUrl('aleph'),
    },
    subscanUrl: 'https://alephzero.subscan.io/',
    parameters: defaultParams,
    priorityPool: 47,
  },
  {
    id: 'westend-testnet',
    genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
    isTestnet: true,
    rpc: 'wss://westend-rpc.polkadot.io',
    nativeToken: {
      symbol: 'WND',
      coingeckoId: undefined,
      logo: githubChainLogoUrl('westend-testnet'),
    },
    subscanUrl: 'https://westend.subscan.io/',
    /**
     * Values from Parity Dashboard
     * https://github.com/paritytech/polkadot-staking-dashboard/blob/8c136141141e6a74ddd838aa20df48a20a35749e/src/config/networks.ts
     */
    parameters: { ...defaultParams, stakeTarget: 0.75 },
    priorityPool: undefined,
  },
] as const satisfies readonly Chain[]
