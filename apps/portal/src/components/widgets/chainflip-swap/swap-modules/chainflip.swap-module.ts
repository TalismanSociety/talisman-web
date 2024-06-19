import {
  fromAmountAtom,
  fromAssetAtom,
  getTokenIdForSwappableAsset,
  toAssetAtom,
  type CommonSwappableAssetType,
  type BaseQuote,
  type SupportedSwapProtocol,
  type SwapModule,
} from './common.swap-module'
import {
  SwapSDK,
  type ChainflipNetwork,
  type Chain,
  type QuoteResponse,
  type AssetData,
  type ChainData,
} from '@chainflip/sdk/swap'
import { Decimal } from '@talismn/math'
import { atom } from 'jotai'

const PROTOCOL: SupportedSwapProtocol = 'chainflip'

const CHAINFLIP_CHAIN_TO_ID_MAP: Record<Chain, string> = {
  Arbitrum: '42161',
  Ethereum: '1',
  Polkadot: 'polkadot',
  Bitcoin: 'unsupported',
}

const CHAINFLIP_ID_TO_CHAIN_MAP: Record<string, Chain> = {
  '42161': 'Arbitrum',
  '1': 'Ethereum',
  polkadot: 'Polkadot',
  unsupported: 'Bitcoin',
}

/**
 * Given an asset and chain from chainflip, convert it to a unified swappable asset type
 */
export const chainflipAssetToSwappableAsset = (asset: AssetData, chain: ChainData): CommonSwappableAssetType | null => {
  const chainId = CHAINFLIP_CHAIN_TO_ID_MAP[chain.chain]
  if (chainId === 'unsupported') return null
  return {
    id: getTokenIdForSwappableAsset(chain.chain === 'Polkadot' ? 'substrate' : 'evm', chainId, asset.contractAddress),
    name: asset.name,
    symbol: asset.symbol,
    decimals: asset.decimals,
    chainId,
    contractAddress: asset.contractAddress,
  }
}

const REMOVE_THIS_LATER_mockedArbitrum = {
  chain: 'Arbitrum' as Chain,
  evmChainId: 42161,
  isMainnet: true,
  name: 'Arbitrum',
  requiredBlockConfirmations: 7,
}

const REMOVE_THIS_LATER_mockedArbToken = {
  asset: 'ARB' as any,
  chain: 'Arbitrum' as Chain,
  chainflipId: 'Arb' as any,
  contractAddress: '0x912ce59144191c1204e64559fe8253a0e49e6548',
  decimals: 18,
  minimumSwapAmount: '100000000000000000',
  isMainnet: true,
  maximumSwapAmount: '10000000000000000000000',
  minimumEgressAmount: '100000000000000000',
  name: 'ARB',
  symbol: 'ARB',
}

const chainflipNetworkAtom = atom<ChainflipNetwork>('mainnet')
const swapSdkAtom = atom(
  get =>
    new SwapSDK({
      network: get(chainflipNetworkAtom),
    })
)

export const chainflipAssetsAtom = atom(async get => await get(swapSdkAtom).getAssets())
export const chainflipChainsAtom = atom(async get => await get(swapSdkAtom).getChains())

const tokensSelector = atom(async (get): Promise<CommonSwappableAssetType[]> => {
  const assets = await get(chainflipAssetsAtom)
  const chains = await get(chainflipChainsAtom)
  const tokens: CommonSwappableAssetType[] = []

  for (const asset of [...assets, REMOVE_THIS_LATER_mockedArbToken]) {
    const chain = [...chains, REMOVE_THIS_LATER_mockedArbitrum].find(chain => chain.chain === asset.chain)
    // for safety measure only, unless chainflip has bug
    if (!chain) continue
    const swappableAsset = chainflipAssetToSwappableAsset(asset, chain)
    if (swappableAsset) tokens.push(swappableAsset)
  }
  return tokens
})

const quote = atom(async (get): Promise<(BaseQuote & { data?: QuoteResponse }) | null> => {
  const sdk = get(swapSdkAtom)
  const fromAsset = get(fromAssetAtom)
  const toAsset = get(toAssetAtom)
  const fromAmount = get(fromAmountAtom)
  const assets = await get(chainflipAssetsAtom)
  if (!fromAsset || !toAsset || !fromAmount || fromAmount.planck === 0n) return null

  assets.push(REMOVE_THIS_LATER_mockedArbToken)
  const chainflipFromAsset = assets.find(
    asset =>
      asset.symbol.toLowerCase() === fromAsset.symbol.toLowerCase() &&
      asset.chain === CHAINFLIP_ID_TO_CHAIN_MAP[fromAsset.chainId.toString()]
  )
  const chainflipToAsset = assets.find(
    asset =>
      asset.symbol.toLowerCase() === toAsset.symbol.toLowerCase() &&
      asset.chain === CHAINFLIP_ID_TO_CHAIN_MAP[toAsset.chainId.toString()]
  )
  // asset not supported
  if (!chainflipFromAsset || !chainflipToAsset) return null

  const minFromAmount = Decimal.fromPlanck(chainflipFromAsset.minimumSwapAmount, fromAsset.decimals)
  if (fromAmount.planck < minFromAmount.planck)
    return {
      protocol: PROTOCOL,
      inputAmountBN: fromAmount.planck,
      error: `Minimum input amount: ${minFromAmount.toLocaleString()} ${fromAsset.symbol}`,
      fees: null,
    }

  try {
    const quote = await sdk.getQuote({
      amount: fromAmount.planck.toString(),
      srcAsset: chainflipFromAsset.asset,
      destAsset: chainflipToAsset.asset,
      srcChain: chainflipFromAsset.chain,
      destChain: chainflipToAsset.chain,
    })

    return {
      protocol: PROTOCOL,
      inputAmountBN: fromAmount.planck,
      outputAmountBN: BigInt(quote.quote.egressAmount),
      fees: null,
      data: quote,
    }
  } catch (_error) {
    console.error(_error)
    const error = _error as Error & { response?: { data?: { message: string } } }
    const errorMessage =
      error.name === 'AxiosError' && error.response?.data?.message?.includes('InsufficientLiquidity')
        ? 'Insufficient liquidity. Please try again with a smaller amount'
        : error.message === 'Request failed with status code 400'
        ? 'Pair not available. Please try another swapping a different asset pair'
        : error.message ?? 'Unknown error'
    // TODO handle insufficient liquidity error
    return {
      protocol: PROTOCOL,
      inputAmountBN: fromAmount.planck,
      error: errorMessage,
      fees: null,
    }
  }
})

// const swap = (get: Getter, set: Setter) => {
//   const sdk = get(swapSdkAtom)
//   if (!quote || quote.error) return false
//   const fromAsset = get(fromAssetAtom)
//   const toAsset = get(toAssetAtom)
//   const fromAmount = get(fromAmountAtom)
//   const quoteResponse = quote.data

//   if (!fromAsset || !toAsset || !fromAmount || fromAmount.planck === 0n || !quoteResponse) return false

//   set(fromAmountAtom, Decimal.fromPlanck(0n, fromAsset.decimals))

//   sdk.swap({
//     amount: fromAmount.planck.toString(),
//     srcAsset: fromAsset.id,
//     destAsset: toAsset.id,
//     srcChain: fromAsset.chainId,
//     destChain: toAsset.chainId,
//     quote: quoteResponse,
//   })
//   return true

// }

export const chainflipSwapModule: SwapModule = {
  protocol: PROTOCOL,
  tokensSelector,
  quote,
  swap: async () => true,
}
