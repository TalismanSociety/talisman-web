import { mainnet } from 'wagmi'
import type { LidoSuite } from './types'

export const lidoMainnet = {
  chain: mainnet,
  token: { address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', coingeckoId: 'staked-ether' },
  withdrawalQueue: '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1',
} as const satisfies LidoSuite