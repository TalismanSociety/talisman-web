import { useChains, useEvmNetworks } from '@talismn/balances-react'
import { useCallback } from 'react'

export const useGetEvmOrSubstrateChain = () => {
  const evmNetworks = useEvmNetworks()
  const chains = useChains()

  return useCallback((id: string | number) => evmNetworks[id] ?? chains[id], [chains, evmNetworks])
}
