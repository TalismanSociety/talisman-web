import { balancesState, selectedBalancesState, selectedCurrencyState } from '@domains/balances'
import { BalanceFormatter } from '@talismn/balances'
import { useChains, useEvmNetworks, useTokenRates, useTokens } from '@talismn/balances-react'
import { formatDecimals } from '@talismn/util'
import { compact, groupBy, isEmpty, isNil, startCase } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

const useFetchAssets = (address: string | undefined) => {
  const _balances = useRecoilValue(address === undefined ? selectedBalancesState : balancesState)
  const balances = useMemo(
    () => (address === undefined ? _balances : _balances.find({ address })),
    [_balances, address]
  )

  const currency = useRecoilValue(selectedCurrencyState)

  const chains = useChains()
  const evmNetworks = useEvmNetworks()
  const tokens = useTokens()

  const isLoading = useMemo(() => {
    return isEmpty(chains) || isEmpty(evmNetworks) || isEmpty(tokens) || isNil(balances)
  }, [chains, evmNetworks, tokens, balances])

  const fiatTotal = useMemo(() => balances.sum.fiat(currency).total, [balances.sum, currency])
  const lockedTotal = useMemo(() => balances.sum.fiat(currency).locked, [balances.sum, currency])
  const transferable = useMemo(() => balances.sum.fiat(currency).transferable, [balances.sum, currency])

  const assetBalances = useMemo(
    () =>
      Object.values(tokens).sort((a, b) => {
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

        const aCmp = aChain?.name?.toLowerCase() ?? a.chain?.id ?? a.evmNetwork?.id
        const bCmp = bChain?.name?.toLowerCase() ?? b.chain?.id ?? b.evmNetwork?.id

        if (aCmp === undefined && bCmp === undefined) return 0
        if (aCmp === undefined) return 1
        if (bCmp === undefined) return -1

        return aCmp.localeCompare(bCmp)
      }),
    [chains, evmNetworks, tokens]
  )

  return { assetBalances, fiatTotal, lockedTotal, value: transferable, balances, chains, evmNetworks, isLoading }
}

export const getFiatString = (value: any, currency: string) => {
  return (
    value.toLocaleString(undefined, {
      style: 'currency',
      currency,
    }) ?? '-'
  )
}

const useAssets = (customAddress?: string) => {
  const { assetBalances, fiatTotal, lockedTotal, value, balances, chains, evmNetworks, isLoading } =
    useFetchAssets(customAddress)
  const currency = useRecoilValue(selectedCurrencyState)
  const rates = useTokenRates()

  const tokens = useMemo(
    () =>
      assetBalances.map(token => {
        const tokenBalances = balances.find({ tokenId: token.id })

        const totalAmount = tokenBalances.sum.planck.total
        const totalAmountFormatted = formatDecimals(new BalanceFormatter(totalAmount, token.decimals).tokens)
        const totalFiatAmount = tokenBalances.sum.fiat(currency).total
        const totalFiatAmountFormatted = getFiatString(totalFiatAmount, currency)

        const transferableAmount = tokenBalances.sum.planck.transferable
        const transferableAmountFormatted = formatDecimals(
          new BalanceFormatter(transferableAmount, token.decimals).tokens
        )

        const transferableFiatAmount = tokenBalances.sum.fiat(currency).transferable
        const transferableFiatAmountFormatted = getFiatString(transferableFiatAmount, currency)

        const lockedAmount = tokenBalances.sum.planck.locked
        const lockedAmountFormatted = formatDecimals(new BalanceFormatter(lockedAmount, token.decimals).tokens)
        const lockedFiatAmount = tokenBalances.sum.fiat(currency).locked ?? 0
        const lockedFiatAmountFormatted = getFiatString(lockedFiatAmount, currency)

        if (tokenBalances.sorted[0] === undefined) {
          return null
        }

        const locked = lockedAmount > 0n

        const tokenDisplayName = startCase(token.coingeckoId)

        return {
          stale: tokenBalances.each.some(x => x.status === 'stale'),
          locked,
          totalAmount,
          totalAmountFormatted,
          totalFiatAmount,
          totalFiatAmountFormatted,
          lockedAmount,
          lockedAmountFormatted,
          lockedFiatAmount,
          lockedFiatAmountFormatted,
          transferableAmount,
          transferableAmountFormatted,
          transferableFiatAmount,
          transferableFiatAmountFormatted,
          rate: rates[token.id]?.[currency] ?? undefined,
          tokenDetails: {
            ...token,
            chain: token.chain
              ? chains[token.chain.id]
              : token.evmNetwork
              ? evmNetworks[token.evmNetwork.id]
              : undefined,
            tokenDisplayName,
          },
          // if the token is substrate-native then make it an array else make it undefined
          nonNativeTokens: [],
        }
      }),
    [assetBalances, balances, chains, currency, evmNetworks, rates]
  )

  const compressedTokens = useMemo(() => compact(tokens), [tokens])

  // for each compressed token
  // find the tokens with the same symbol in token details
  // group them together, in the new group, find the token that is substrate native
  // if there is a substrate native token, then add the other tokens to the nonNativeTokens array

  const groupedTokens = useMemo(() => groupBy(compressedTokens, 'tokenDetails.symbol'), [compressedTokens])
  const groupedTokensArray = useMemo(() => Object.values(groupedTokens), [groupedTokens])

  // for each group of tokens look through the chains using the tokendetails.chain.id as the key and find if the chain nativeToken.id is the same as the tokenDetails.id
  // if it is the same then make that the substrateNativeToken add the other tokens to the nonNativeTokens array

  const groupedTokensWithNonNativeTokens = useMemo(
    () =>
      groupedTokensArray
        .map(group => {
          const substrateNativeToken = group.find(token => {
            const chain = token.tokenDetails.chain?.id ? chains[token.tokenDetails.chain?.id] : undefined
            if (!chain) {
              const evmNetwork = token.tokenDetails.evmNetwork?.id
                ? evmNetworks[token.tokenDetails.evmNetwork?.id]
                : undefined
              if (!evmNetwork) return token
              return evmNetwork.nativeToken?.id === token.tokenDetails.id
            }
            return chain.nativeToken?.id === token.tokenDetails.id
          })

          if (substrateNativeToken) {
            const nonNativeTokens = group.filter(
              token => token.tokenDetails.id !== substrateNativeToken.tokenDetails.id
            )
            return {
              ...substrateNativeToken,
              nonNativeTokens,
            }
          }

          // if there is no substrate native token, then make the first token in the group the substrate native token
          // and add the other tokens to the nonNativeTokens array

          const nonNativeTokens = group.filter(token => token.tokenDetails.id !== group[0]?.tokenDetails.id)

          if (group[0]) {
            return {
              ...group[0],
              nonNativeTokens,
            }
          }

          return null
        })
        .filter((x): x is Exclude<typeof x, null> => x !== null),
    [chains, evmNetworks, groupedTokensArray]
  )

  const balancesWithNonNativeTokens = useMemo(
    () =>
      groupedTokensWithNonNativeTokens.map(token => {
        if (token && token.nonNativeTokens.length > 0) {
          const nonNativeTotalAmount = token.nonNativeTokens.reduce((prev, curr) => prev + curr.totalAmount, 0n)

          const nonNativeTransferableAmount = token.nonNativeTokens.reduce(
            (sum, token) => sum + token.transferableAmount,
            0n
          )

          const nonNativeLockedAmount = token.nonNativeTokens.reduce((sum, token) => sum + token.lockedAmount, 0n)

          const overallTotalAmount = formatDecimals(
            new BalanceFormatter(token.totalAmount + nonNativeTotalAmount, token.tokenDetails.decimals).tokens
          )

          const overallTransferableAmount = formatDecimals(
            new BalanceFormatter(token.transferableAmount + nonNativeTransferableAmount, token.tokenDetails.decimals)
              .tokens
          )

          const overallLockedAmount = formatDecimals(
            new BalanceFormatter(token.lockedAmount + nonNativeLockedAmount, token.tokenDetails.decimals).tokens
          )

          const overallTotalFiatAmount =
            token.totalFiatAmount + token.nonNativeTokens.reduce((prev, curr) => prev + curr.totalFiatAmount, 0)

          const overallLockedFiatAmount =
            token.lockedFiatAmount + token.nonNativeTokens.reduce((sum, token) => sum + token.lockedFiatAmount, 0)

          const overallTransferableFiatAmount =
            token.transferableFiatAmount +
            token.nonNativeTokens.reduce((sum, token) => sum + token.transferableFiatAmount, 0)

          const locked = token.locked || token.nonNativeTokens.some(token => token.locked)

          return {
            ...token,
            overallTotalAmount,
            overallTotalFiatAmount,
            overallTransferableAmount,
            overallTransferableFiatAmount,
            overallLockedAmount,
            overallLockedFiatAmount,
            locked,
          }
        }

        return {
          ...token,
          overallTotalAmount: token.totalAmountFormatted,
          overallTotalFiatAmount: token.totalFiatAmount,
          overallTransferableAmount: token.transferableAmountFormatted,
          overallTransferableFiatAmount: token.transferableFiatAmount,
          overallLockedAmount: token.lockedAmountFormatted,
          overallLockedFiatAmount: token.lockedFiatAmount,
        }
      }),
    [groupedTokensWithNonNativeTokens]
  )

  return {
    tokens: useMemo(
      () =>
        balancesWithNonNativeTokens.map(x => ({
          ...x,
          nonNativeTokens: x.nonNativeTokens.sort((a, b) => b.totalFiatAmount - a.totalFiatAmount),
        })),
      [balancesWithNonNativeTokens]
    ),
    fiatTotal,
    lockedTotal,
    balances,
    value,
    isLoading,
  }
}

export type PortfolioToken = ReturnType<typeof useAssets>['tokens'][number]

type useSingleAssetProps = {
  symbol?: string
  // Could possibly add more ways to get a single asset, perhaps name, id, etc
}

export const useSingleAsset = ({ symbol }: useSingleAssetProps) => {
  const { tokens, balances, isLoading } = useAssets()

  const tokenNotFound = {
    token: undefined,
    balances: undefined,
    isLoading: false,
  }

  if (!symbol) return tokenNotFound

  const token = tokens.find(token => token.tokenDetails.symbol?.toLowerCase() === symbol?.toLowerCase())

  if (!token && !isLoading) return tokenNotFound

  return {
    token,
    balances,
    isLoading,
  }
}

type Filter = {
  size?: number
  search?: string
  address?: string
}

export const useAssetsFiltered = ({ size, search, address }: Filter) => {
  const { tokens, balances, isLoading, fiatTotal } = useAssets(address)

  const filteredTokens = useMemo(() => {
    if (search === '') return tokens
    return tokens.filter(token => {
      if (token === null) return false
      if (search !== undefined && token.tokenDetails.symbol.toLowerCase().includes(search.toLowerCase())) return true
      if (search !== undefined && token.tokenDetails.chain?.id.toLowerCase().includes(search.toLowerCase())) return true
      if (search !== undefined && token.tokenDetails.coingeckoId?.toLowerCase().includes(search.toLowerCase()))
        return true

      // check if the search term is in the non-native tokens
      if (
        token.nonNativeTokens.some(nonNativeToken => {
          if (search !== undefined && nonNativeToken.tokenDetails.symbol.toLowerCase().includes(search.toLowerCase()))
            return true
          if (
            search !== undefined &&
            nonNativeToken.tokenDetails.chain?.id.toLowerCase().includes(search.toLowerCase())
          )
            return true
          if (
            search !== undefined &&
            nonNativeToken.tokenDetails.coingeckoId?.toLowerCase().includes(search.toLowerCase())
          )
            return true
          return false
        })
      )
        return true

      return false
    })
  }, [tokens, search])

  const filteredTokensBySize = useMemo(
    () => (size !== undefined ? filteredTokens.slice(0, size) : filteredTokens),
    [filteredTokens, size]
  )

  const sortedTokens = useMemo(
    () => filteredTokensBySize.sort((a, b) => b.overallTotalFiatAmount - a.overallTotalFiatAmount),
    [filteredTokensBySize]
  )

  return {
    tokens: sortedTokens,
    balances,
    isLoading,
    fiatTotal,
  }
}

export default useAssets
