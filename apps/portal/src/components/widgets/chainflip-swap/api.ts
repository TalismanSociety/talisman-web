import { accountsState, evmAccountsState, substrateAccountsState, type Account } from '@/domains/accounts'
import { SwapSDK, type ChainflipNetwork, type Chain, type ChainData } from '@chainflip/sdk/swap'
import '@polkadot/api-augment/substrate'
import { isAddress as isSubstrateAddress } from '@polkadot/util-crypto'
import { type Balances } from '@talismn/balances'
import { useBalances } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import '@talismn/ui/assets/css/talismn.css'
import { useCallback, useEffect, useMemo } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import { isAddress } from 'viem'

const ENABLED_CHAINS: Chain[] = ['Ethereum', 'Polkadot']

export const chainflipNetworkState = atom<ChainflipNetwork>({
  key: 'chainflipNetwork',
  default: 'mainnet',
})

export const swapSdkState = selector({
  key: 'chainflipSwapSdk',
  get: ({ get }) =>
    new SwapSDK({
      network: get(chainflipNetworkState),
    }),
  dangerouslyAllowMutability: true,
})

export const polkadotRpcAtom = selector({
  key: 'polkadotRpc',
  get: ({ get }) =>
    get(chainflipNetworkState) === 'mainnet'
      ? 'wss://polkadot.api.onfinality.io/public'
      : 'wss://rpc-pdot.chainflip.io',
  dangerouslyAllowMutability: true,
})

export const chainflipChainsState = selector({
  key: 'chainflipChains',
  get: async ({ get }) => await get(swapSdkState).getChains(),
  dangerouslyAllowMutability: true,
})

export const chainflipAssetsState = selector({
  key: 'chainflipAssets',
  get: async ({ get }) => await get(swapSdkState).getAssets(),
  dangerouslyAllowMutability: true,
})

export const chainflipAssetsAndChainsState = selector({
  key: 'chainflipAssetsAndChains',
  get: async ({ get }) => {
    const _assets = get(chainflipAssetsState)
    const _chains = get(chainflipChainsState)

    const chains = _chains.filter(chain => ENABLED_CHAINS.includes(chain.chain))
    const assets = _assets
      .map(asset => ({ ...asset, chain: chains.find(chain => chain.chain === asset.chain)! }))
      .filter(a => !!a.chain)

    return { assets, chains }
  },
})

// Instead of tracking by ID, we track symbol so the function can later be protocol-agnostic
export const srcAssetSymbolState = atom<string | null>({
  key: 'srcAssetSymbol',
  default: null,
})

export const srcAssetChainState = atom<string | null>({
  key: 'srcAssetChain',
  default: null,
})

export const destAssetSymbolState = atom<string | null>({
  key: 'destAssetSymbol',
  default: null,
})

export const destAssetChainState = atom<string | null>({
  key: 'destAssetChain',
  default: null,
})

export const fromAmountInputState = atom<string>({
  key: 'fromAmountInput',
  default: '',
})

export const toAmountInputState = atom<string>({
  key: 'toAmountInput',
  default: '',
})

export const fromAssetState = selector({
  key: 'fromAsset',
  get: ({ get }) => {
    const srcAssetSymbol = get(srcAssetSymbolState)
    const srcAssetChain = get(srcAssetChainState)
    const assetsAndChains = get(chainflipAssetsAndChainsState)

    if (!srcAssetSymbol || !srcAssetChain) {
      return null
    }

    return assetsAndChains.assets.find(asset => asset.symbol === srcAssetSymbol && asset.chain.chain === srcAssetChain)
  },
})

export const toAssetState = selector({
  key: 'toAsset',
  get: ({ get }) => {
    const destAssetSymbol = get(destAssetSymbolState)
    const destAssetChain = get(destAssetChainState)
    const assetsAndChains = get(chainflipAssetsAndChainsState)

    if (!destAssetSymbol || !destAssetChain) {
      return null
    }

    return assetsAndChains.assets.find(
      asset => asset.symbol === destAssetSymbol && asset.chain.chain === destAssetChain
    )
  },
})

export const fromAmountState = selector({
  key: 'fromAmount',
  get: ({ get }) => {
    const fromAsset = get(fromAssetState)
    if (!fromAsset) return Decimal.fromPlanck(0, 1, {})
    return Decimal.fromUserInputOrUndefined(get(fromAmountInputState), fromAsset?.decimals, {
      currency: fromAsset.asset,
    })
  },
})

export const fromAmountErrorState = selector({
  key: 'fromAmountError',
  get: ({ get }) => {
    const fromAsset = get(fromAssetState)
    const fromAmount = get(fromAmountState)
    const fromAmountInput = get(fromAmountInputState)

    // not an error, just empty state
    if (!fromAmount || !fromAsset || fromAmountInput.trim() === '') return null

    const minFromAmount = Decimal.fromPlanck(fromAsset.minimumSwapAmount, fromAsset.decimals)
    if (fromAmount.planck < minFromAmount.planck) return `Minimum ${minFromAmount.toString()} ${fromAsset.symbol}`

    return null
  },
})

export const quoteRefresherState = atom<number>({
  key: 'quoteRefresher',
  default: 0,
})

export const quoteChainflipState = selector({
  key: 'quoteChainflip',
  get: async ({ get }) => {
    const fromAsset = get(fromAssetState)
    const fromAmount = get(fromAmountState)
    const toAsset = get(toAssetState)

    // force refresh quote every 12s
    get(quoteRefresherState)
    if (!fromAsset || !toAsset || !fromAmount || fromAmount.planck === 0n) {
      return null
    }

    const fromAmountError = get(fromAmountErrorState)
    if (fromAmountError) throw new Error(fromAmountError)

    const sdk = get(swapSdkState)

    const quote = await sdk.getQuote({
      amount: fromAmount.planck.toString(),
      srcAsset: fromAsset.asset,
      srcChain: fromAsset.chain.chain,
      destAsset: toAsset.asset,
      destChain: toAsset.chain.chain,
    })

    return { ...quote, fromAsset, toAsset }
  },
})

export const toAmountState = selector({
  key: 'toAmount',
  get: ({ get }) => {
    const quote = get(quoteChainflipState)
    const toAsset = get(toAssetState)
    if (!quote || !toAsset) return null
    return Decimal.fromPlanck(quote.quote.egressAmount, toAsset.decimals, { currency: toAsset.asset })
  },
})

export const useAssetAndChain = (
  onForceChange?: (props: { newSrcAssetSymbol: string | null; newDestAssetSymbol: string | null }) => void
) => {
  const fromAccount = useRecoilValue(fromAccountState)
  const toAccount = useRecoilValue(toAccountState)
  const setFromAddress = useSetRecoilState(fromAddressState)
  const setToAddress = useSetRecoilState(toAddressState)
  const [srcAssetSymbol, setSrcAssetSymbol] = useRecoilState(srcAssetSymbolState)
  const [srcAssetChain, setSrcAssetChain] = useRecoilState(srcAssetChainState)
  const fromAssetLoadable = useRecoilValueLoadable(fromAssetState)
  const toAssetLoadable = useRecoilValueLoadable(toAssetState)

  const [destAssetSymbol, setDestAssetSymbol] = useRecoilState(destAssetSymbolState)
  const [destAssetChain, setDestAssetChain] = useRecoilState(destAssetChainState)

  const reverse = useCallback(() => {
    setSrcAssetChain(destAssetChain)
    setSrcAssetSymbol(destAssetSymbol)
    setDestAssetChain(srcAssetChain)
    setDestAssetSymbol(srcAssetSymbol)
    setFromAddress(toAccount?.address ?? null)
    setToAddress(fromAccount?.address ?? null)
  }, [
    destAssetChain,
    destAssetSymbol,
    toAccount,
    fromAccount,
    srcAssetChain,
    srcAssetSymbol,
    setFromAddress,
    setToAddress,
    setSrcAssetChain,
    setSrcAssetSymbol,
    setDestAssetChain,
    setDestAssetSymbol,
  ])

  useEffect(() => {
    if (fromAccount && toAccount) {
      if (
        (fromAccount.type === 'ethereum' && toAccount.type === 'ethereum') ||
        (fromAccount.type !== 'ethereum' && toAccount.type !== 'ethereum')
      ) {
        setToAddress(fromAccount?.address ?? null)
      }
    }
  }, [fromAccount, toAccount, setToAddress])

  useEffect(() => {
    if (fromAccount && srcAssetChain) {
      if (
        (fromAccount.type === 'ethereum' && srcAssetChain !== 'Ethereum') ||
        (fromAccount.type !== 'ethereum' && srcAssetChain === 'Ethereum')
      ) {
        setSrcAssetChain(destAssetChain)
        setSrcAssetSymbol(destAssetSymbol)
        setDestAssetChain(srcAssetChain)
        setDestAssetSymbol(srcAssetSymbol)
        onForceChange?.({
          newSrcAssetSymbol: destAssetSymbol!,
          newDestAssetSymbol: srcAssetSymbol!,
        })
      }
    }
  }, [
    fromAccount,
    srcAssetChain,
    srcAssetSymbol,
    destAssetChain,
    destAssetSymbol,
    setSrcAssetChain,
    setSrcAssetSymbol,
    setDestAssetChain,
    setDestAssetSymbol,
    onForceChange,
  ])

  const fromAssetJson = useMemo(() => {
    if (fromAssetLoadable.state === 'hasValue') {
      return fromAssetLoadable.contents
    }
    return null
  }, [fromAssetLoadable])

  const toAssetJson = useMemo(() => {
    if (toAssetLoadable.state === 'hasValue') {
      return toAssetLoadable.contents
    }
    return null
  }, [toAssetLoadable])

  return {
    srcAssetSymbol,
    setSrcAssetSymbol,
    srcAssetChain,
    setSrcAssetChain,
    destAssetSymbol,
    setDestAssetSymbol,
    destAssetChain,
    setDestAssetChain,
    reverse,
    fromAssetJson,
    toAssetJson,
  }
}

export const fromAddressState = atom<string | null>({
  key: 'fromAddress',
  default: null,
})

export const fromAccountState = selector({
  key: 'fromAccount',
  get: ({ get }) => {
    const fromAddress = get(fromAddressState)
    if (!fromAddress) return null
    const evmAccounts = get(evmAccountsState)
    const substrateAccounts = get(substrateAccountsState)
    const account =
      [...evmAccounts, ...substrateAccounts].find(
        account => account.address.toLowerCase() === fromAddress.toLowerCase()
      ) ?? null

    return account
  },
})

export const toAddressState = atom<string | null>({
  key: 'toAddress',
  default: null,
})

export const toAccountState = selector({
  key: 'toAccount',
  get: ({ get }): Account | null => {
    const toAddress = get(toAddressState)
    if (!toAddress) return null

    const knownAccount = get(accountsState).find(account => account.address.toLowerCase() === toAddress.toLowerCase())
    if (knownAccount) return knownAccount

    // toAddress can be any input, so might not be valid address
    const evmAddress = isAddress(toAddress)
    const substrateAddress = isSubstrateAddress(toAddress)
    if (!evmAddress && !substrateAddress) return null

    return {
      address: toAddress,
      type: evmAddress ? 'ethereum' : 'sr25519',
      partOfPortfolio: false,
      canSignEvm: false,
      readonly: true,
    }
  },
})

export const getBalanceForChainflipAsset = (balances: Balances, tokenSymbol: string, chainData: ChainData) =>
  balances.find(b => {
    const tokenMatch = b.token.symbol === tokenSymbol
    const chainMatch = b.evmNetworkId === `${chainData.evmChainId}` || b.chain?.name === chainData.chain
    return tokenMatch && chainMatch && !b.subSource
  })

export const useChainflipAssetBalance = (
  address?: string | null,
  tokenSymbol?: string | null,
  tokenDecimal?: number | null,
  chainData?: ChainData | null
) => {
  const balances = useBalances()

  return useMemo(() => {
    if (!address || !tokenSymbol || !chainData || !tokenDecimal) return null
    const assetBalance = getBalanceForChainflipAsset(balances, tokenSymbol, chainData)
    const targetBalances = assetBalance.find(b => b.address.toLowerCase() === address.toLowerCase())
    const loading = targetBalances.each.find(b => b.status !== 'live') !== undefined
    return {
      balance: Decimal.fromPlanck(targetBalances.sum.planck.transferable, tokenDecimal, { currency: tokenSymbol }),
      loading,
    }
  }, [balances, address, tokenSymbol, tokenDecimal, chainData])
}
