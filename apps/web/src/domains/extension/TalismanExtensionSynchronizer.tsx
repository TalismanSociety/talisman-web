import { useChaindata } from '@talismn/balances-react'
import type { CustomChain, CustomEvmNetwork, Token } from '@talismn/chaindata-provider'
import { useEffect } from 'react'

const windowInject = globalThis as typeof globalThis & {
  talismanSub?: {
    subscribeCustomSubstrateChains?: (cb: (chains: CustomChain[]) => unknown) => () => void
    subscribeCustomEvmNetworks?: (cb: (networks: CustomEvmNetwork[]) => unknown) => () => void
    subscribeCustomTokens?: (cb: (tokens: Token[]) => unknown) => () => void
  }
}

const TalismanExtensionSynchronizer = () => {
  const chaindata = useChaindata()

  useEffect(
    () =>
      windowInject.talismanSub?.subscribeCustomSubstrateChains?.(
        async chains => await chaindata.setCustomChains(chains)
      ),
    [chaindata]
  )

  useEffect(
    () =>
      windowInject.talismanSub?.subscribeCustomEvmNetworks?.(
        async networks => await chaindata.setCustomEvmNetworks(networks)
      ),
    [chaindata]
  )

  useEffect(
    () => windowInject.talismanSub?.subscribeCustomTokens?.(async tokens => await chaindata.setCustomTokens(tokens)),
    [chaindata]
  )

  return null
}

export default TalismanExtensionSynchronizer
