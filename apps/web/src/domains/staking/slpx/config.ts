import { moonbeam } from 'wagmi/chains'
import type { SlpxPair } from './types'

export const glmrSlpxPair = {
  chain: moonbeam,
  substrateEndpoint: 'wss://hk.p.bifrost-rpc.liebi.com/ws',
  splx: '0xF1d4797E51a4640a76769A50b57abE7479ADd3d8',
  etherscanUrl: moonbeam.blockExplorers.etherscan.url,
  nativeToken: {
    type: 'token',
    address: '0x0000000000000000000000000000000000000802',
    symbol: 'GLMR',
    coingeckoId: 'moonbeam',
    tokenId: {
      Token2: 1,
    },
  },
  vToken: {
    type: 'vToken',
    address: '0xFfFfFFff99dABE1a8De0EA22bAa6FD48fdE96F6c',
    symbol: 'xcvGMLR',
    coingeckoId: 'voucher-glmr',
    tokenId: {
      VToken2: 1,
    },
  },
} as const satisfies SlpxPair
