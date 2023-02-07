export type Chain = {
  id: string
  isTestnet: boolean
  rpcs: Array<{ url: string }>
  nativeToken: {
    coingeckoId?: string
  }
  subscanUrl: string
}

export const chains: Chain[] = [
  {
    id: 'westend-testnet',
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
      coingeckoId: undefined,
    },
    subscanUrl: 'https://westend.subscan.io/',
  },
  {
    id: 'polkadot',
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
      coingeckoId: 'polkadot',
    },
    subscanUrl: 'https://polkadot.subscan.io/',
  },
  {
    id: 'kusama',
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
      coingeckoId: 'kusama',
    },
    subscanUrl: 'https://kusama.subscan.io/',
  },
]
