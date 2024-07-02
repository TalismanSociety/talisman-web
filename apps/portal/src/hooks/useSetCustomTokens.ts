import { type CustomEvmErc20Token } from '@talismn/balances'
import { useChaindataProvider, useEvmNetworks } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { useEffect, useMemo } from 'react'

export type CustomTokensConfig = CustomTokenConfig[]
export type CustomTokenConfig = {
  evmChainId: string
  contractAddress: string
  symbol: string
  decimals: number
  coingeckoId?: string
  logo?: string
}

/**
 * For app.talisman.xyz, we typically sync the custom tokens list with the user's wallet config.
 *
 * For other dapps which use `@talismn/balances-react`, we might want to specify a custom list of tokens
 * to be fetched.
 *
 * This hook is an example of how to do just that.
 *
 * @example
 * // tell `@talismn/balances-react` that we want to fetch some
 * // more erc20 tokens than just the defaults from chaindata
 * useSetCustomTokens([{
 *   evmChainId: "11155111",
 *   contractAddress: "0x56BCB4864B12aB96efFc21fDd59Ea66DB2811c55",
 *   symbol: "TALI",
 *   decimals: 18,
 * }])
 */
export const useSetCustomTokens = (customTokensConfig: CustomTokensConfig) => {
  const chaindataProvider = useChaindataProvider()
  const customTokensConfigMemoised = useMemo(
    () => customTokensConfig,
    [JSON.stringify(customTokensConfig)] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const evmNetworks = useEvmNetworks()

  useEffect(() => {
    if (customTokensConfigMemoised.length === 0) return
    const customTokens = customTokensConfigMemoised.map(
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

    chaindataProvider.setCustomTokens(customTokens)
  }, [chaindataProvider, customTokensConfigMemoised, evmNetworks])
}
