import { parseCustomEvmErc20Tokens } from '../../hooks/useSetCustomTokens'
import { customTokensConfig } from './customTokensConfig'
import { useChaindataProvider, useEvmNetworks } from '@talismn/balances-react'
import type { CustomChain, CustomEvmNetwork, Token } from '@talismn/chaindata-provider'
import { unionBy } from 'lodash'
import { useEffect, useState } from 'react'

const windowInject = globalThis as typeof globalThis & {
  talismanSub?: {
    subscribeCustomSubstrateChains?: (cb: (chains: CustomChain[]) => unknown) => () => void
    subscribeCustomEvmNetworks?: (cb: (networks: CustomEvmNetwork[]) => unknown) => () => void
    subscribeCustomTokens?: (cb: (tokens: Token[]) => unknown) => () => void
  }
}

export const TalismanExtensionSynchronizer = () => {
  const [walletTokens, setWalletTokens] = useState<Token[]>([])
  const chaindataProvider = useChaindataProvider()

  const evmNetworks = useEvmNetworks()

  useEffect(() => {
    const sub = windowInject.talismanSub

    const unsubs = [
      sub?.subscribeCustomSubstrateChains?.(async custom => await chaindataProvider.setCustomChains(custom)),
      sub?.subscribeCustomEvmNetworks?.(async custom => await chaindataProvider.setCustomEvmNetworks(custom)),
      sub?.subscribeCustomTokens?.(custom => setWalletTokens(custom)),
    ]

    return () => unsubs.forEach(unsub => unsub?.())
  }, [chaindataProvider])

  useEffect(() => {
    const customTokens = parseCustomEvmErc20Tokens({ customTokensConfig: customTokensConfig, evmNetworks })
    chaindataProvider.setCustomTokens(unionBy(customTokens, walletTokens, 'id'))
  }, [walletTokens, evmNetworks, chaindataProvider])

  return null
}
