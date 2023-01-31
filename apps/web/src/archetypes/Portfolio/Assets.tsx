import { useActiveAccount } from '@libs/talisman'
import { useBalances } from '@libs/talisman'
import { BalanceFormatter } from '@talismn/balances'
import { useChaindata, useChains, useEvmNetworks } from '@talismn/balances-react'
import { formatDecimals } from '@talismn/util'
import _ from 'lodash'
import { useMemo } from 'react'

const useFetchAssets = (address: string | undefined) => {
  const { balances, tokenIds, tokens, assetsOverallValue, assetsTotalValue } = useBalances()
  const chaindata = useChaindata()

  const chains = useChains(chaindata)
  const evmNetworks = useEvmNetworks(chaindata)

  const isLoading = useMemo(() => {
    return _.isEmpty(chains) || _.isEmpty(evmNetworks) || _.isEmpty(tokens) || _.isNil(balances)
  }, [chains, evmNetworks, tokens, balances])

  const fiatTotal =
    address !== undefined ? balances?.find({ address: address }).sum.fiat('usd').total ?? 0 : assetsOverallValue

  const lockedTotal =
    address !== undefined
      ? balances?.find({ address: address }).sum.fiat('usd').locked ?? 0
      : balances?.sum.fiat('usd').locked ?? 0

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

  return { assetBalances, assetsTotalValue, fiatTotal, lockedTotal, value, balances, chains, evmNetworks, isLoading }
}

export const convertToFiatString = (value: any) => {
  return (
    value.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }) ?? '-'
  )
}

const useAssets = (customAddress?: string) => {
  const { address } = useActiveAccount()
  const { assetBalances, assetsTotalValue, fiatTotal, lockedTotal, value, balances, chains, evmNetworks, isLoading } =
    useFetchAssets(customAddress ?? address)

  if (!assetBalances)
    return {
      tokens: [],
      fiatTotal: 0,
      lockedTotal: 0,
      balances: undefined,
      value: undefined,
    }

  const tokens = assetBalances?.map((token, index) => {
    const tokenBalances =
      address !== undefined
        ? balances?.find([{ address: address, tokenId: token.id }])
        : balances?.find({ tokenId: token.id })
    if (!tokenBalances) return undefined

    const planckAmount = tokenBalances.sorted.reduce((sum, balance) => sum + balance.transferable.planck, BigInt('0'))
    if (planckAmount === BigInt('0')) return undefined
    const planckAmountFormatted = formatDecimals(new BalanceFormatter(planckAmount, token.decimals).tokens)

    const fiatAmount =
      address !== undefined
        ? balances?.find([{ address: address, tokenId: token.id }])?.sum.fiat('usd').transferable ?? 0
        : address === undefined
        ? balances?.find({ tokenId: token.id })?.sum.fiat('usd').transferable ?? 0
        : 0

    const fiatAmountFormatted = convertToFiatString(fiatAmount)

    const lockedAmount = tokenBalances.sorted.reduce((sum, balance) => sum + balance.locked.planck, BigInt('0'))
    const lockedAmountFormatted = formatDecimals(new BalanceFormatter(lockedAmount, token.decimals).tokens)
    const lockedFiatAmount = balances?.find({ tokenId: token.id })?.sum.fiat('usd').locked ?? 0
    const lockedFiatAmountFormatted = convertToFiatString(lockedFiatAmount)

    if (tokenBalances.sorted[0] === undefined) {
      return null
    }

    const locked = lockedAmount > BigInt('0')

    return {
      locked,
      unformattedLockedAmount: lockedAmount,
      lockedAmount: lockedAmountFormatted,
      lockedFiatAmount,
      lockedFiatAmountFormatted,
      unformattedPlancAmount: planckAmount,
      amount: planckAmountFormatted,
      fiatAmount,
      fiatAmountFormatted,
      tokenDetails: token,
      // if the token is substrate-native then make ormlTokens an array else make it undefined
      ormlTokens: [],
    }
  })

  const compressedTokens = _.compact(tokens)

  // for each compressed token
  // find the tokens with the same symbol in token details
  // group them together, in the new group, find the token that is substrate native
  // if there is a substrate native token, then add the other tokens to the ormlTokens array

  const groupedTokens = _.groupBy(compressedTokens, 'tokenDetails.symbol')
  const groupedTokensArray = Object.values(groupedTokens)

  // for each group of tokens look through the chains using the tokendetails.chain.id as the key and find if the chain nativeToken.id is the same as the tokenDetails.id
  // if it is the same then make that the substrateNativeToken add the other tokens to the ormlTokens array

  const groupedTokensWithOrmlTokens = groupedTokensArray.map(group => {
    const substrateNativeToken = group.find(token => {
      const chain = chains[token.tokenDetails?.chain?.id]
      if (!chain) {
        const evmNetwork = evmNetworks[token.tokenDetails?.evmNetwork?.id]
        if (!evmNetwork) return token
        return evmNetwork?.nativeToken?.id === token.tokenDetails.id
      }
      return chain?.nativeToken?.id === token.tokenDetails.id
    })

    if (substrateNativeToken) {
      const ormlTokens = group.filter(token => token.tokenDetails.id !== substrateNativeToken.tokenDetails.id)
      return {
        ...substrateNativeToken,
        ormlTokens,
      }
    }

    // if there is no substrate native token, then make the first token in the group the substrate native token
    // and add the other tokens to the ormlTokens array

    const ormlTokens = group && group.filter(token => token.tokenDetails.id !== group[0]?.tokenDetails.id)

    if (group[0]) {
      return {
        ...group[0],
        ormlTokens,
      }
    }

    return null
  })

  const balancesWithOrmlTokens = groupedTokensWithOrmlTokens.map(token => {
    if (token && token.ormlTokens.length > 0) {
      const ormlLockedAmount = token.ormlTokens.reduce((sum, token) => sum + token.unformattedLockedAmount, BigInt('0'))
      const ormlPlanckAmount = token.ormlTokens.reduce((sum, token) => sum + token.unformattedPlancAmount, BigInt('0'))

      const overallTokenAmount = formatDecimals(
        new BalanceFormatter(token.unformattedPlancAmount + ormlPlanckAmount, token?.tokenDetails?.decimals).tokens
      )
      const overallLockedAmount = formatDecimals(
        new BalanceFormatter(token.unformattedLockedAmount + ormlLockedAmount, token?.tokenDetails?.decimals).tokens
      )

      const overallLockedFiatAmount =
        token.lockedFiatAmount + token.ormlTokens.reduce((sum, token) => sum + token.lockedFiatAmount, 0)
      const overallFiatAmount = token.fiatAmount + token.ormlTokens.reduce((sum, token) => sum + token.fiatAmount, 0)

      const locked = token.locked || token.ormlTokens.some(token => token.locked)

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
      overallTokenAmount: token?.amount,
      overallFiatAmount: token?.fiatAmount,
      overallLockedAmount: token?.lockedAmount,
      overallLockedFiatAmount: token?.lockedFiatAmount,
    }
  })

  return {
    tokens: balancesWithOrmlTokens,
    fiatTotal,
    assetsTotalValue,
    lockedTotal,
    balances,
    value,
    isLoading,
  }
}

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

  const token = tokens.find(token => token?.tokenDetails?.symbol?.toLowerCase() === symbol?.toLowerCase())

  if (!token && !isLoading) return tokenNotFound

  return {
    token,
    balances,
    isLoading,
  }
}

type filterProps = {
  size?: number
  search?: string
  address?: string
}

export const useAssetsFiltered = ({ size, search, address }: filterProps) => {
  const { tokens, balances, isLoading } = useAssets(address)

  const filteredTokens = useMemo(() => {
    if (search === '') return tokens
    return tokens.filter(token => {
      if (token === null) return false
      if (token?.tokenDetails.symbol?.toLowerCase().includes(search?.toLowerCase())) return true
      if (token?.tokenDetails?.chain?.id?.toLowerCase().includes(search?.toLowerCase())) return true
      if (token?.tokenDetails?.coingeckoId?.toLowerCase().includes(search?.toLowerCase())) return true

      // check if the search term is in the orml tokens
      if (
        token?.ormlTokens &&
        token?.ormlTokens?.some((ormlToken: any) => {
          if (ormlToken?.tokenDetails.symbol?.toLowerCase().includes(search?.toLowerCase())) return true
          if (ormlToken?.tokenDetails?.chain?.id?.toLowerCase().includes(search?.toLowerCase())) return true
          if (ormlToken?.tokenDetails?.coingeckoId?.toLowerCase().includes(search?.toLowerCase())) return true
          return false
        })
      )
        return true

      return false
    })
  }, [tokens, search])

  // filter tokens by size, if size is 0, return all tokens
  const filteredTokensBySize = size ? filteredTokens.slice(0, size) : filteredTokens

  return {
    tokens: filteredTokensBySize,
    balances,
    isLoading,
  }
}

export default useAssets
