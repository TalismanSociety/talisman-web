import { createPublicClient, fallback, http } from 'viem'
import { mainnet } from 'viem/chains'

const onFinalityRpc = import.meta.env.VITE_ON_FINALITY_RPC

if (!onFinalityRpc) {
  console.warn('VITE_ON_FINALITY_RPC is not set, SEEK reads will use public RPC')
}

export const seekPublicClient = createPublicClient({
  chain: mainnet,
  transport: onFinalityRpc ? fallback([http(onFinalityRpc), http()]) : http(),
  batch: { multicall: true },
})
