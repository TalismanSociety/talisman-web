import type { ApiPromise } from '@polkadot/api'
import type { ChainId } from '@talismn/chaindata-provider'
import { chainsAtom } from '@talismn/balances-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { apiPromiseAtom } from '@/domains/common/atoms/apiPromiseAtom'
import { jotaiStore } from '@/util/jotaiStore'

/**
 * Custom hook to get the API for querying Babe constants.
 * For parachains, it returns the relay chain's API since Babe constants
 * are available on the relay chain, not on the parachain.
 *
 * @param chainId - The chain ID to get the Babe API for
 * @returns ApiPromise for the appropriate chain (relay chain for parachains)
 */
export const useBabeApi = (chainId: ChainId | null | undefined): ApiPromise | null => {
  const chains = useAtomValue(chainsAtom)

  // Determine which chain ID to use for the Babe API
  const babeChainId = useMemo(() => {
    if (!chainId) return null

    const chain = chains.find(c => c.id === chainId)
    if (!chain) return null

    // For parachains, use the relay chain for Babe constants
    if (chain.paraId !== null && chain.relay?.id) {
      return chain.relay.id
    }

    // For relay chains and standalone chains, use the chain itself
    return chain.id
  }, [chainId, chains])

  const { data: babeApi } = useSuspenseQuery({
    queryKey: ['babe-api', babeChainId],
    queryFn: async () => {
      if (!babeChainId) return null

      const api = await jotaiStore.get(apiPromiseAtom(babeChainId))
      if (!api) throw new Error(`Babe API not found for chain: ${babeChainId}`)

      // Wait for API to be ready before accessing constants
      await api.isReady
      return api
    },
  })

  return babeApi ?? null
}
