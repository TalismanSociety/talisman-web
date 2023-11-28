import { Chain } from '.'

export const supportedChains: Chain[] = [
  {
    squidIds: { chainData: 'polkadot', txHistory: 'polkadot' },
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
    chainName: 'Polkadot',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/polkadot.svg',
    isTestnet: false,
    nativeToken: {
      id: 'polkadot-substrate-native-dot',
    },
    subscanUrl: 'https://polkadot.subscan.io/',
    polkaAssemblyUrl: 'https://polkadot.polkassembly.io',
    rpcs: [
      {
        url: 'wss://rpc.polkadot.io',
      },
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
        url: 'wss://polkadot.public.curie.radiumblock.co/ws',
      },
      {
        url: 'wss://dot-rpc.stakeworld.io',
      },
    ],
    ss58Prefix: 0,
  },
  {
    squidIds: { chainData: 'kusama', txHistory: 'kusama' },
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
    chainName: 'Kusama',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/kusama.svg',
    isTestnet: false,
    nativeToken: {
      id: 'kusama-substrate-native-ksm',
    },
    subscanUrl: 'https://kusama.subscan.io/',
    polkaAssemblyUrl: 'https://kusama.polkassembly.io',
    rpcs: [
      {
        url: 'wss://kusama-rpc.polkadot.io',
      },
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
        url: 'wss://kusama.public.curie.radiumblock.co/ws',
      },
      {
        url: 'wss://ksm-rpc.stakeworld.io',
      },
    ],
    ss58Prefix: 2,
  },
  {
    squidIds: { chainData: 'polkadot-asset-hub', txHistory: 'statemint' },
    genesisHash: '0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f',
    chainName: 'Polkadot Asset Hub',
    nativeToken: {
      id: 'polkadot-asset-hub-substrate-native-dot',
    },
    subscanUrl: 'https://assethub-polkadot.subscan.io/',
    rpcs: [
      {
        url: 'wss://polkadot-asset-hub-rpc.polkadot.io',
      },
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
    squidIds: { chainData: 'kusama-asset-hub', txHistory: 'statemine' },
    genesisHash: '0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a',
    chainName: 'Kusama Asset Hub',
    nativeToken: {
      id: 'kusama-asset-hub-substrate-native-ksm',
    },
    subscanUrl: 'https://assethub-kusama.subscan.io/',
    rpcs: [
      {
        url: 'wss://kusama-asset-hub-rpc.polkadot.io',
      },
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
  // {
  //   squidIds: { chainData: 'hydradx', txHistory: 'hydradx' },
  //   genesisHash: '0xafdc188f45c71dacbaa0b62e16a91f726c7b8699a9748cdf715459de6b7f366d',
  //   chainName: 'HydraDX',
  //   nativeToken: {
  //     id: 'hydradx-substrate-native-hdx',
  //   },
  //   subscanUrl: 'https://hydradx.subscan.io/',
  //   rpcs: [
  //     {
  //       url: 'wss://hydradx-rpc.dwellir.com',
  //     },
  //     {
  //       url: 'wss://rpc.hydradx.cloud',
  //     },
  //     {
  //       url: 'wss://rpc-lb.data6.zp-labs.net:8443/hydradx/ws/?token=2ZGuGivPJJAxXiT1hR1Yg2MXGjMrhEBYFjgbdPi',
  //     },
  //     {
  //       url: 'wss://hydradx.api.onfinality.io/public-ws',
  //     },
  //   ],
  //   logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/hydradx.svg',
  //   isTestnet: false,
  //   ss58Prefix: 63,
  // },
  {
    squidIds: { chainData: 'westend-testnet', txHistory: 'westend' },
    genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
    chainName: 'Westend',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/westend-testnet.svg',
    isTestnet: true,
    subscanUrl: 'https://westend.subscan.io/',
    nativeToken: {
      id: 'westend-testnet-substrate-native-wnd',
    },
    rpcs: [
      {
        url: 'wss://westend-rpc.polkadot.io',
      },
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
        url: 'wss://westend.public.curie.radiumblock.co/ws',
      },
      {
        url: 'wss://wnd-rpc.stakeworld.io',
      },
    ],
    ss58Prefix: 42,
  },
  {
    squidIds: { chainData: 'rococo-testnet', txHistory: 'rococo' },
    genesisHash: '0x6408de7737c59c238890533af25896a2c20608d8b380bb01029acb392781063e',
    chainName: 'Rococo',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/rococo-testnet.svg',
    isTestnet: true,
    subscanUrl: 'https://rococo.subscan.io/',
    nativeToken: {
      id: 'rococo-testnet-substrate-native-roc',
    },
    rpcs: [
      {
        url: 'wss://rococo-rpc.polkadot.io',
      },
      {
        url: 'wss://rpc-rococo.bajun.network',
      },
    ],
    ss58Prefix: 42,
  },
]

export const filteredSupportedChains = supportedChains.filter(chain => {
  const networks = process.env.REACT_APP_NETWORKS

  if (!networks) return true
  const whitelistedNetworks = networks.split(',')

  for (const network of whitelistedNetworks) {
    if (process.env.REACT_APP_NETWORKS === 'testnet') {
      return chain.isTestnet
    }

    if (process.env.REACT_APP_NETWORKS === 'non-testnet') {
      return !chain.isTestnet
    }

    const networkLowerCase = network.toLowerCase()
    const match = chain.squidIds.chainData.toLowerCase() === networkLowerCase || chain.chainName === networkLowerCase
    if (match) return true
  }

  return false
})
