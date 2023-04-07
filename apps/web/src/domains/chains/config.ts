import { githubChainLogoUrl, githubTokenLogoUrl } from '@talismn/chaindata-provider'
import { defaultParams } from './consts'

export const chains = [
  {
    id: 'polkadot',
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
    isTestnet: false,
    rpcs: [
      {
        url: 'wss://rpc.polkadot.io',
      },
      {
        url: 'wss://polkadot.api.onfinality.io/public-ws',
      },
      {
        url: 'wss://polkadot-rpc.dwellir.com',
      },
      {
        url: 'wss://public-rpc.pinknode.io/polkadot',
      },
      {
        url: 'wss://polkadot.public.curie.radiumblock.io/ws',
      },
      {
        url: 'wss://1rpc.io/dot',
      },
    ],
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
    stakingParams: { ...defaultParams, stakeTarget: 0.75 },
  },
  {
    id: 'kusama',
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
    isTestnet: false,
    rpcs: [
      {
        url: 'wss://kusama-rpc.polkadot.io',
      },
      {
        url: 'wss://kusama.api.onfinality.io/public-ws',
      },
      {
        url: 'wss://kusama-rpc.dwellir.com',
      },
      {
        url: 'wss://kusama.public.curie.radiumblock.xyz/ws',
      },
      {
        url: 'wss://public-rpc.pinknode.io/kusama',
      },
      {
        url: 'wss://1rpc.io/ksm',
      },
    ],
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
    stakingParams: { ...defaultParams, auctionAdjust: 0.3 / 60, auctionMax: 60, stakeTarget: 0.75 },
  },
  {
    id: 'aleph',
    genesisHash: '0x70255b4d28de0fc4e1a193d7e175ad1ccef431598211c55538f1018651a0344e',
    isTestnet: false,
    rpcs: [
      {
        url: 'wss://ws.azero.dev',
      },
    ],
    nativeToken: {
      symbol: 'AZERO',
      coingeckoId: 'aleph-zero',
      logo: githubChainLogoUrl('aleph'),
    },
    subscanUrl: 'https://alephzero.subscan.io/',
    stakingParams: defaultParams,
  },
  {
    id: 'westend-testnet',
    genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
    isTestnet: true,
    rpcs: [
      {
        url: 'wss://westend-rpc.polkadot.io',
      },
      {
        url: 'wss://westend.api.onfinality.io/public-ws',
      },
      {
        url: 'wss://rpc.pinknode.io/westend/explorer',
      },
      {
        url: 'wss://westend-rpc.dwellir.com',
      },
    ],
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
    stakingParams: { ...defaultParams, stakeTarget: 0.75 },
  },
] as const

export type Chain = (typeof chains)[number]

export type Chains = typeof chains
