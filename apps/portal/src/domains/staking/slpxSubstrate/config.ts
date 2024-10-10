import type { SlpxSubstratePair } from './types'

export const dotSlpxPair = {
  chainName: 'Bifrost',
  chainId: 'bifrost-polkadot',
  substrateChainGenesisHash: '0x262e1b2ad728475fd6fe88e62d34c200abe6fd693931ddad144059b1eb884e5b',
  splx: '2F551a80e79e02213dd918190892af5034002909c5',
  minStake: 5000000000n,
  minRedeem: 4000000000n,
  nativeToken: {
    type: 'token',
    address: '2F551a80e79e02213dd918190892af5034002909c5',
    symbol: 'DOT',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/dot.svg',
    coingeckoId: 'polkadot',
    tokenId: {
      Token2: 0,
    },
  },
  vToken: {
    type: 'vToken',
    address: '2F9658598ef1eace56a0662d4a067a260e42b36f2a',
    symbol: 'vDOT',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/vdot.svg',
    coingeckoId: 'voucher-dot',
    tokenId: {
      VToken2: 0,
    },
  },
  apiEndpoint: 'https://dapi.bifrost.io/',
  estimatedRoundDuration: 86_400_000,
} as const satisfies SlpxSubstratePair
