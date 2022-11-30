import Asset from '@components/recipes/Asset'
import { useActiveAccount } from '@libs/talisman'
import { useBalances } from '@libs/talisman'
import { useChaindata, useChains, useEvmNetworks } from '@talismn/balances-react'
import { useMemo } from 'react'

const useAssets = () => {
  const { balances, tokenIds, tokens, assetsValue } = useBalances()
  const { address } = useActiveAccount()
  const chaindata = useChaindata()

  const chains = useChains(chaindata)
  const evmNetworks = useEvmNetworks(chaindata)

  const fiatTotal =
    address !== undefined
      ? (balances?.find({ address: address }).sum.fiat('usd').transferable ?? 0).toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'narrowSymbol',
        }) ?? ' -'
      : assetsValue

  const value = balances?.find({ address: address })?.sum?.fiat('usd').transferable

  const assetBalances = useMemo(
    () =>
      tokenIds
        .map(tokenId => tokens[tokenId])
        .sort((a, b) => {
          // TODO: Move token sorting into the chaindata subsquid indexer
          if (a.chain?.id === 'polkadot' && b.chain?.id !== 'polkadot') return -1
          if (b.chain?.id === 'polkadot' && a.chain?.id !== 'polkadot') return 1
          if (a.chain?.id === 'kusama' && b.chain?.id !== 'kusama') return -1
          if (b.chain?.id === 'kusama' && a.chain?.id !== 'kusama') return 1

          if ((a.chain?.id || a.evmNetwork?.id) === (b.chain?.id || b.evmNetwork?.id)) {
            if (a.type === 'substrate-native') return -1
            if (b.type === 'substrate-native') return 1
            if (a.type === 'evm-native') return -1
            if (b.type === 'evm-native') return 1

            const aCmp = a.symbol?.toLowerCase() || a.id
            const bCmp = b.symbol?.toLowerCase() || b.id

            return aCmp.localeCompare(bCmp)
          }

          const aChain = a.chain?.id ? chains[a.chain.id] : a.evmNetwork?.id ? evmNetworks[a.evmNetwork.id] : null
          const bChain = b.chain?.id ? chains[b.chain.id] : b.evmNetwork?.id ? evmNetworks[b.evmNetwork.id] : null

          const aCmp = aChain?.name?.toLowerCase() || a.chain?.id || a.evmNetwork?.id
          const bCmp = bChain?.name?.toLowerCase() || b.chain?.id || b.evmNetwork?.id

          if (aCmp === undefined && bCmp === undefined) return 0
          if (aCmp === undefined) return 1
          if (bCmp === undefined) return -1

          return aCmp.localeCompare(bCmp)
        }),
    [chains, evmNetworks, tokenIds, tokens]
  )

  return { assetBalances, fiatTotal, value, balances, assetsValue }
}

export default useAssets
