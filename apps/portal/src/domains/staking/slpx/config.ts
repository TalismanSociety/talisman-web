import type { SlpxPair } from './types'
import { moonbeam } from 'wagmi/chains'

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
  apiEndpoint: 'https://api.bifrost.app/',
  estimatedRoundDuration: 21_600_000,
} as const satisfies SlpxPair
