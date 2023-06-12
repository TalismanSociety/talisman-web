import { Chain } from '.'

export const supportedChains: Chain[] = [
  {
    id: 'polkadot',
    chainName: 'Polkadot',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/polkadot.svg',
    isTestnet: false,
    nativeToken: {
      id: 'polkadot-substrate-native-dot',
    },
    rpc: 'wss://rpc.polkadot.io',
    decimals: 10,
  },
  {
    id: 'kusama',
    chainName: 'Kusama',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/kusama.svg',
    isTestnet: false,
    nativeToken: {
      id: 'kusama-substrate-native-ksm',
    },
    rpc: 'wss://kusama-rpc.polkadot.io',
    decimals: 12,
  },
  {
    id: 'westend-testnet',
    chainName: 'Westend',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/westend-testnet.svg',
    isTestnet: true,
    nativeToken: {
      id: 'westend-testnet-substrate-native-wnd',
    },
    rpc: 'wss://westend-rpc.polkadot.io',
    decimals: 12,
  },
  {
    id: 'rococo-testnet',
    chainName: 'Rococo',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/rococo-testnet.svg',
    isTestnet: true,
    nativeToken: {
      id: 'rococo-testnet-substrate-native-roc',
    },
    rpc: 'wss://rococo-rpc.polkadot.io',
    decimals: 12,
  },
]
