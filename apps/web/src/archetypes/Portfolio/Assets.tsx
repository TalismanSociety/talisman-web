import { legacySelectedAccountState } from '@domains/accounts/recoils'
import { selectedCurrencyState } from '@domains/balances'
import { useLegacyBalances } from '@domains/balances/hooks'
import { BalanceFormatter } from '@talismn/balances'
import { useChains, useEvmNetworks, useTokenRates, useTokens } from '@talismn/balances-react'
import { formatDecimals } from '@talismn/util'
import { compact, groupBy, isEmpty, isNil, startCase } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

const useFetchAssets = (address: string | undefined) => {
  const { balances, assetsOverallValue } = useLegacyBalances()

  const currency = useRecoilValue(selectedCurrencyState)

  const chains = useChains()
  const evmNetworks = useEvmNetworks()
  const tokens = useTokens()

  const isLoading = useMemo(() => {
    return isEmpty(chains) || isEmpty(evmNetworks) || isEmpty(tokens) || isNil(balances)
  }, [chains, evmNetworks, tokens, balances])

  const fiatTotal =
    address !== undefined ? balances?.find({ address }).sum.fiat(currency).total ?? 0 : assetsOverallValue

  const lockedTotal =
    address !== undefined
      ? balances?.find({ address }).sum.fiat(currency).locked ?? 0
      : balances?.sum.fiat(currency).locked ?? 0

  const value = balances?.find({ address }).sum.fiat(currency).transferable

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

  return { assetBalances, fiatTotal, lockedTotal, value, balances, chains, evmNetworks, isLoading }
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
  const address = useRecoilValue(legacySelectedAccountState)?.address
  const { assetBalances, fiatTotal, lockedTotal, value, balances, chains, evmNetworks, isLoading } = useFetchAssets(
    customAddress ?? address
  )
  const currency = useRecoilValue(selectedCurrencyState)
  const rates = useTokenRates()

  if (!assetBalances)
    return {
      tokens: [],
      fiatTotal: 0,
      lockedTotal: 0,
      balances: undefined,
      value: undefined,
    }

  const tokens = assetBalances.map(token => {
    const tokenBalances =
      address !== undefined ? balances?.find([{ address, tokenId: token.id }]) : balances?.find({ tokenId: token.id })
    if (!tokenBalances) return undefined

    const totalPlanckAmount = tokenBalances.sorted.reduce((sum, balance) => sum + balance.total.planck, 0n)

    if (totalPlanckAmount === 0n) {
      return undefined
    }

    const planckAmount = tokenBalances.sorted.reduce((sum, balance) => sum + balance.transferable.planck, 0n)
    const planckAmountFormatted = formatDecimals(new BalanceFormatter(planckAmount, token.decimals).tokens)

    const fiatAmount =
      address !== undefined
        ? balances?.find([{ address, tokenId: token.id }]).sum.fiat(currency).transferable ?? 0
        : address === undefined
        ? balances?.find({ tokenId: token.id }).sum.fiat(currency).transferable ?? 0
        : 0

    const fiatAmountFormatted = getFiatString(fiatAmount, currency)

    const lockedAmount = tokenBalances.sorted.reduce((sum, balance) => sum + balance.locked.planck, 0n)
    const lockedAmountFormatted = formatDecimals(new BalanceFormatter(lockedAmount, token.decimals).tokens)
    const lockedFiatAmount = balances?.find({ tokenId: token.id }).sum.fiat(currency).locked ?? 0
    const lockedFiatAmountFormatted = getFiatString(lockedFiatAmount, currency)

    if (tokenBalances.sorted[0] === undefined) {
      return null
    }

    const locked = lockedAmount > 0n

    const tokenDisplayName =
      token.type === 'evm-erc20'
        ? 'Ethereum'
        : token.chain?.id
        ? startCase(token.chain?.id)
        : startCase(token.coingeckoId)

    return {
      locked,
      unformattedLockedAmount: lockedAmount,
      lockedAmount: lockedAmountFormatted,
      lockedFiatAmount,
      lockedFiatAmountFormatted,
      unformattedPlancAmount: planckAmount,
      amount: planckAmountFormatted,
      rate: rates[token.id]?.[currency] ?? undefined,
      fiatAmount,
      fiatAmountFormatted,
      tokenDetails: {
        ...token,
        tokenDisplayName,
      },
      // if the token is substrate-native then make it an array else make it undefined
      nonNativeTokens: [],
    }
  })

  const compressedTokens = compact(tokens)

  // for each compressed token
  // find the tokens with the same symbol in token details
  // group them together, in the new group, find the token that is substrate native
  // if there is a substrate native token, then add the other tokens to the nonNativeTokens array

  const groupedTokens = groupBy(compressedTokens, 'tokenDetails.symbol')
  const groupedTokensArray = Object.values(groupedTokens)

  // for each group of tokens look through the chains using the tokendetails.chain.id as the key and find if the chain nativeToken.id is the same as the tokenDetails.id
  // if it is the same then make that the substrateNativeToken add the other tokens to the nonNativeTokens array

  const groupedTokensWithNonNativeTokens = groupedTokensArray
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
        const nonNativeTokens = group.filter(token => token.tokenDetails.id !== substrateNativeToken.tokenDetails.id)
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
    .filter((x): x is Exclude<typeof x, null> => x !== null)

  const balancesWithNonNativeTokens = groupedTokensWithNonNativeTokens.map(token => {
    if (token && token.nonNativeTokens.length > 0) {
      const nonNativeLockedAmount = token.nonNativeTokens.reduce(
        (sum, token) => sum + token.unformattedLockedAmount,
        0n
      )
      const nonNativePlanckAmount = token.nonNativeTokens.reduce((sum, token) => sum + token.unformattedPlancAmount, 0n)

      const overallTokenAmount = formatDecimals(
        new BalanceFormatter(token.unformattedPlancAmount + nonNativePlanckAmount, token.tokenDetails.decimals).tokens
      )
      const overallLockedAmount = formatDecimals(
        new BalanceFormatter(token.unformattedLockedAmount + nonNativeLockedAmount, token.tokenDetails.decimals).tokens
      )

      const overallLockedFiatAmount =
        token.lockedFiatAmount + token.nonNativeTokens.reduce((sum, token) => sum + token.lockedFiatAmount, 0)
      const overallFiatAmount =
        token.fiatAmount + token.nonNativeTokens.reduce((sum, token) => sum + token.fiatAmount, 0)

      const locked = token.locked || token.nonNativeTokens.some(token => token.locked)

      return {
        ...token,
        overallTokenAmount,
        overallFiatAmount,
        overallLockedAmount,
        overallLockedFiatAmount,
        locked,
      }
    }

    return {
      ...token,
      overallTokenAmount: token.amount,
      overallFiatAmount: token.fiatAmount,
      overallLockedAmount: token.lockedAmount,
      overallLockedFiatAmount: token.lockedFiatAmount,
    }
  })

  return {
    tokens: balancesWithNonNativeTokens,
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
  const { tokens, balances, isLoading } = useAssets(address)

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
    () => filteredTokensBySize.sort((a, b) => (b.fiatAmount ?? 0) - (a.fiatAmount ?? 0)),
    [filteredTokensBySize]
  )

  return {
    tokens: sortedTokens,
    balances,
    isLoading,
  }
}

export default useAssets
