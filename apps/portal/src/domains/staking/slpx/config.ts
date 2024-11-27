import { manta, moonbeam } from 'wagmi/chains'

import type { SlpxPair } from './types'

export const glmrSlpxPair = {
  chain: moonbeam,
  substrateChainGenesisHash: '0x262e1b2ad728475fd6fe88e62d34c200abe6fd693931ddad144059b1eb884e5b',
  splx: '0xF1d4797E51a4640a76769A50b57abE7479ADd3d8',
  etherscanUrl: moonbeam.blockExplorers.default.url,
  nativeToken: {
    type: 'token',
    address: '0x0000000000000000000000000000000000000802',
    symbol: 'GLMR',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/moonbeam.svg',
    coingeckoId: 'moonbeam',
    tokenId: {
      Token2: 1,
    },
  },
  vToken: {
    type: 'vToken',
    address: '0xFfFfFFff99dABE1a8De0EA22bAa6FD48fdE96F6c',
    symbol: 'xcvGMLR',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/moonbeam.svg',
    coingeckoId: 'voucher-glmr',
    tokenId: {
      VToken2: 1,
    },
  },
  apiEndpoint: 'https://dapi.bifrost.io/',
  estimatedRoundDuration: 21_600_000,
} as const satisfies SlpxPair

export const mantaSlpxPair = {
  chain: manta,
  substrateChainGenesisHash: '0x262e1b2ad728475fd6fe88e62d34c200abe6fd693931ddad144059b1eb884e5b',
  splx: '0x95A4D4b345c551A9182289F9dD7A018b7Fd0f940',
  etherscanUrl: manta.blockExplorers.default.url,
  nativeToken: {
    type: 'token',
    address: '0x95CeF13441Be50d20cA4558CC0a27B601aC544E5',
    symbol: 'MANTA',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/chains/manta.svg',
    coingeckoId: 'manta-network',
    tokenId: {
      Token2: 8,
    },
  },
  vToken: {
    type: 'vToken',
    address: '0x7746ef546d562b443AE4B4145541a3b1a3D75717',
    symbol: 'vMANTA',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/coingecko/bifrost-voucher-manta.webp',
    coingeckoId: 'bifrost-voucher-manta',
    tokenId: {
      VToken2: 8,
    },
  },
  apiEndpoint: 'https://dapi.bifrost.io/',
  estimatedRoundDuration: 21_600_000,
} as const satisfies SlpxPair
