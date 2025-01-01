import type { CustomChain, CustomEvmNetwork, Token } from '@talismn/chaindata-provider'
import { type CustomEvmErc20Token } from '@talismn/balances'
import { useChaindataProvider, useEvmNetworks } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { unionBy } from 'lodash'
import { useEffect, useState } from 'react'

import { CustomTokensConfig, customTokensConfig } from './customTokensConfig'

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
    const customTokens = parseCustomEvmErc20Tokens({ customTokensConfig, evmNetworks })
    chaindataProvider.setCustomTokens(unionBy(customTokens, walletTokens, 'id'))
  }, [walletTokens, evmNetworks, chaindataProvider])

  return null
}

function parseCustomEvmErc20Tokens({
  customTokensConfig,
  evmNetworks,
}: {
  customTokensConfig: CustomTokensConfig
  evmNetworks: ReturnType<typeof useEvmNetworks>
}): CustomEvmErc20Token[] {
  const customTokens = customTokensConfig.map(
    ({ evmChainId, symbol, decimals, contractAddress, coingeckoId, logo }): CustomEvmErc20Token => ({
      id: `${evmChainId}-evm-erc20-${contractAddress}`.toLowerCase(),
      type: 'evm-erc20',
      isTestnet: evmNetworks[evmChainId]?.isTestnet || false,
      symbol,
      decimals,
      logo: logo ?? githubUnknownTokenLogoUrl,
      coingeckoId,
      contractAddress,
      evmNetwork: { id: evmChainId },
      isCustom: true,
    })
  )

  return customTokens
}
