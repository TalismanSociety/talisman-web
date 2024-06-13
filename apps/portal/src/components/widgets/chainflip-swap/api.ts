import type { Account } from '@/domains/accounts'
import { SwapSDK, type ChainflipNetwork, type Chain } from '@chainflip/sdk/swap'
import '@polkadot/api-augment/substrate'
import { Decimal } from '@talismn/math'
import '@talismn/ui/assets/css/talismn.css'
import { useCallback, useEffect } from 'react'
import { atom, selector, useRecoilState } from 'recoil'

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
    if (!fromAsset) return Decimal.fromPlanck(0, 1)
    return Decimal.fromUserInputOrUndefined(get(fromAmountInputState), fromAsset?.decimals)
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

export const quoteChainflipState = selector({
  key: 'quoteChainflip',
  get: async ({ get }) => {
    const fromAsset = get(fromAssetState)
    const fromAmount = get(fromAmountState)
    const toAsset = get(toAssetState)
    const fromAmountError = get(fromAmountErrorState)

    if (!fromAsset || !toAsset || !fromAmount || fromAmount.planck === 0n || !!fromAmountError) {
      return null
    }

    const sdk = get(swapSdkState)

    return await sdk.getQuote({
      amount: fromAmount.planck.toString(),
      srcAsset: fromAsset.asset,
      srcChain: fromAsset.chain.chain,
      destAsset: toAsset.asset,
      destChain: toAsset.chain.chain,
    })
  },
})

export const toAmountState = selector({
  key: 'toAmount',
  get: ({ get }) => {
    const quote = get(quoteChainflipState)
    const toAsset = get(toAssetState)
    if (!quote || !toAsset) return null
    return Decimal.fromPlanck(quote.quote.egressAmount, toAsset.decimals)
  },
})

export const useAssetAndChain = (
  fromAccount: Account | undefined,
  toAccount: Account | undefined,
  setToAccount: React.Dispatch<React.SetStateAction<Account | undefined>>,
  onForceChange?: (props: { newSrcAssetSymbol: string | null; newDestAssetSymbol: string | null }) => void
) => {
  const [srcAssetSymbol, setSrcAssetSymbol] = useRecoilState(srcAssetSymbolState)
  const [srcAssetChain, setSrcAssetChain] = useRecoilState(srcAssetChainState)

  const [destAssetSymbol, setDestAssetSymbol] = useRecoilState(destAssetSymbolState)
  const [destAssetChain, setDestAssetChain] = useRecoilState(destAssetChainState)

  const reverse = useCallback(() => {
    setSrcAssetChain(destAssetChain)
    setSrcAssetSymbol(destAssetSymbol)
    setDestAssetChain(srcAssetChain)
    setDestAssetSymbol(srcAssetSymbol)
  }, [
    destAssetChain,
    destAssetSymbol,
    srcAssetChain,
    srcAssetSymbol,
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
        setToAccount(undefined)
      }
    }
  }, [fromAccount, toAccount, setToAccount])

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
  }
}
