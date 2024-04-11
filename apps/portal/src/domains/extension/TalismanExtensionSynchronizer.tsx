import { useChaindataProvider } from '@talismn/balances-react'
import type { CustomChain, CustomEvmNetwork, Token } from '@talismn/chaindata-provider'
import { useEffect } from 'react'

const windowInject = globalThis as typeof globalThis & {
  talismanSub?: {
    subscribeCustomSubstrateChains?: (cb: (chains: CustomChain[]) => unknown) => () => void
    subscribeCustomEvmNetworks?: (cb: (networks: CustomEvmNetwork[]) => unknown) => () => void
    subscribeCustomTokens?: (cb: (tokens: Token[]) => unknown) => () => void
  }
}

export const TalismanExtensionSynchronizer = () => {
  const chaindataProvider = useChaindataProvider()

  useEffect(() => {
    const sub = windowInject.talismanSub

    const unsubs = [
      sub?.subscribeCustomSubstrateChains?.(async custom => await chaindataProvider.setCustomChains(custom)),
      sub?.subscribeCustomEvmNetworks?.(async custom => await chaindataProvider.setCustomEvmNetworks(custom)),
      sub?.subscribeCustomTokens?.(async custom => await chaindataProvider.setCustomTokens(custom)),
    ]

    return () => unsubs.forEach(unsub => unsub?.())
  }, [chaindataProvider])

  return null
}
