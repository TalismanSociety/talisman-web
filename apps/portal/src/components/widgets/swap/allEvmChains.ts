import type { Chain as ViemChain } from 'viem/chains'
import * as allViemEvmChains from 'viem/chains'

import { vanaMainnet } from './vana'

export const allEvmChains: Record<string, ViemChain | undefined> = {
  ...allViemEvmChains,
  vanaMainnet,
}
