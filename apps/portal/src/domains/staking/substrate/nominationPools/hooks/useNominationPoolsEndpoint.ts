import type { ChainId } from '@talismn/chaindata-provider'
import { chainsAtom } from '@talismn/balances-react'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

/**
 * Custom hook to get the RPC endpoint for querying nomination pools.
 * For parachains, it returns the relay chain's RPC endpoint since nomination pools
 * are only available on relay chains, not on parachains.
 *
 * @param chainId - The current chain ID
 * @returns RPC endpoint for nomination pool queries (relay chain endpoint for parachains, current chain endpoint otherwise)
 */
export const useNominationPoolsEndpoint = (chainId: ChainId | null | undefined): string | null => {
  const chains = useAtomValue(chainsAtom)

  return useMemo(() => {
    if (!chainId) return null

    const chain = chains.find(c => c.id === chainId)
    if (!chain) return null

    // For parachains, use the relay chain RPC endpoint for staking queries
    // (Parachains don't have the staking pallet - relay chains do)
    if (chain.paraId !== null && chain.relay?.id) {
      const relayChain = chains.find(c => c.id === chain.relay?.id)
      return relayChain?.rpcs?.[0]?.url ?? null
    }

    // For relay chains and standalone chains, use the chain's own RPC endpoint
    return chain.rpcs?.[0]?.url ?? null
  }, [chainId, chains])
}
