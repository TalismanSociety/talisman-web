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
    rpcs: [
      {
        url: 'wss://rpc.ibp.network/polkadot',
      },
      {
        url: 'wss://rpc.dotters.network/polkadot',
      },
      {
        url: 'wss://polkadot.api.onfinality.io/public-ws',
      },
      {
        url: 'wss://1rpc.io/dot',
      },
      {
        url: 'wss://polkadot-public-rpc.blockops.network/ws',
      },
      {
        url: 'wss://polkadot-rpc.dwellir.com',
      },
      {
        url: 'wss://polkadot-rpc-tn.dwellir.com',
      },
      {
        url: 'wss://rpc-polkadot.luckyfriday.io',
      },
      {
        url: 'wss://rpc.polkadot.io',
      },
      {
        url: 'wss://polkadot.public.curie.radiumblock.co/ws',
      },
      {
        url: 'wss://dot-rpc.stakeworld.io',
      },
    ],
    ss58Prefix: 0,
  },
  {
    id: 'kusama',
    chainName: 'Kusama',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/kusama.svg',
    isTestnet: false,
    nativeToken: {
      id: 'kusama-substrate-native-ksm',
    },
    rpcs: [
      {
        url: 'wss://rpc.ibp.network/kusama',
      },
      {
        url: 'wss://rpc.dotters.network/kusama',
      },
      {
        url: 'wss://kusama.api.onfinality.io/public-ws',
      },
      {
        url: 'wss://1rpc.io/ksm',
      },
      {
        url: 'wss://kusama-public-rpc.blockops.network/ws',
      },
      {
        url: 'wss://kusama-rpc.dwellir.com',
      },
      {
        url: 'wss://kusama-rpc-tn.dwellir.com',
      },
      {
        url: 'wss://rpc-kusama.luckyfriday.io',
      },
      {
        url: 'wss://kusama-rpc.polkadot.io',
      },
      {
        url: 'wss://kusama.public.curie.radiumblock.co/ws',
      },
      {
        url: 'wss://ksm-rpc.stakeworld.io',
      },
    ],
    ss58Prefix: 2,
  },
  {
    id: 'polkadot-asset-hub',
    chainName: 'Polkadot Asset Hub',
    nativeToken: {
      id: 'polkadot-asset-hub-substrate-native-dot',
    },
    rpcs: [
      {
        url: 'wss://sys.ibp.network/statemint',
      },
      {
        url: 'wss://sys.dotters.network/statemint',
      },
      {
        url: 'wss://statemint.api.onfinality.io/public-ws',
      },
      {
        url: 'wss://statemint-rpc.dwellir.com',
      },
      {
        url: 'wss://statemint-rpc-tn.dwellir.com',
      },
      {
        url: 'wss://polkadot-asset-hub-rpc.polkadot.io',
      },
      {
        url: 'wss://statemint.public.curie.radiumblock.co/ws',
      },
      {
        url: 'wss://dot-rpc.stakeworld.io/statemint',
      },
    ],
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/polkadot-asset-hub.svg',
    isTestnet: false,
    ss58Prefix: 0,
  },
  {
    id: 'kusama-asset-hub',
    chainName: 'Kusama Asset Hub',
    nativeToken: {
      id: 'kusama-asset-hub-substrate-native-ksm',
    },
    rpcs: [
      {
        url: 'wss://sys.ibp.network/statemine',
      },
      {
        url: 'wss://sys.dotters.network/statemine',
      },
      {
        url: 'wss://statemine.api.onfinality.io/public-ws',
      },
      {
        url: 'wss://statemine-rpc.dwellir.com',
      },
      {
        url: 'wss://statemine-rpc-tn.dwellir.com',
      },
      {
        url: 'wss://rpc-statemine.luckyfriday.io',
      },
      {
        url: 'wss://kusama-asset-hub-rpc.polkadot.io',
      },
      {
        url: 'wss://statemine.public.curie.radiumblock.co/ws',
      },
      {
        url: 'wss://ksm-rpc.stakeworld.io/statemine',
      },
    ],
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/kusama-asset-hub.svg',
    isTestnet: false,
    ss58Prefix: 2,
  },
  {
    id: 'westend-testnet',
    chainName: 'Westend',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/westend-testnet.svg',
    isTestnet: true,
    nativeToken: {
      id: 'westend-testnet-substrate-native-wnd',
    },
    rpcs: [
      {
        url: 'wss://rpc.ibp.network/westend',
      },
      {
        url: 'wss://rpc.dotters.network/westend',
      },
      {
        url: 'wss://westend.api.onfinality.io/public-ws',
      },
      {
        url: 'wss://westend-rpc.blockops.network/ws',
      },
      {
        url: 'wss://westend-rpc.dwellir.com',
      },
      {
        url: 'wss://westend-rpc-tn.dwellir.com',
      },
      {
        url: 'wss://rpc-westend.luckyfriday.io',
      },
      {
        url: 'wss://westend-rpc.polkadot.io',
      },
      {
        url: 'wss://westend.public.curie.radiumblock.co/ws',
      },
      {
        url: 'wss://wnd-rpc.stakeworld.io',
      },
    ],
    ss58Prefix: 42,
  },
  {
    id: 'rococo-testnet',
    chainName: 'Rococo',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/rococo-testnet.svg',
    isTestnet: true,
    nativeToken: {
      id: 'rococo-testnet-substrate-native-roc',
    },
    rpcs: [
      {
        url: 'wss://rococo-rpc.polkadot.io',
      },
    ],
    ss58Prefix: 42,
  },
]
