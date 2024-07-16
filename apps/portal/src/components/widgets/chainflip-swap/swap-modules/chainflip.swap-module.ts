import {
  fromAmountAtom,
  fromAssetAtom,
  getTokenIdForSwappableAsset,
  toAssetAtom,
  type CommonSwappableAssetType,
  type BaseQuote,
  type SupportedSwapProtocol,
  type SwapModule,
  fromAddressAtom,
  toAddressAtom,
  type SwapFunction,
  type QuoteFunction,
  swapQuoteRefresherAtom,
  type GetEstimateGasTxFunction,
} from './common.swap-module'
import {
  SwapSDK,
  type ChainflipNetwork,
  type Chain,
  type QuoteResponse,
  type AssetData,
  type ChainData,
  type SwapStatusResponse,
} from '@chainflip/sdk/swap'
import { isAddress as isSubstrateAddress } from '@polkadot/util-crypto'
import { Decimal } from '@talismn/math'
import { atom, type Getter, type Setter } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { encodeFunctionData, erc20Abi, isAddress } from 'viem'
import { arbitrum, mainnet, sepolia } from 'viem/chains'

const PROTOCOL: SupportedSwapProtocol = 'chainflip'
const EVM_CHAINS = [mainnet, sepolia, arbitrum]

const CHAINFLIP_CHAIN_TO_ID_MAP: Record<Chain, string> = {
  Arbitrum: '42161',
  Ethereum: '1',
  Polkadot: 'polkadot',
  Bitcoin: 'unsupported',
}

const CHAINFLIP_ID_TO_CHAIN_MAP: Record<string, Chain> = {
  '42161': 'Arbitrum',
  '421614': 'Arbitrum', // arbitrum testnet
  '1': 'Ethereum',
  '11155111': 'Ethereum', // sepolia testnet
  polkadot: 'Polkadot',
  unsupported: 'Bitcoin',
}

/**
 * Given an asset and chain from chainflip, convert it to a unified swappable asset type
 */
export const chainflipAssetToSwappableAsset = (asset: AssetData, chain: ChainData): CommonSwappableAssetType | null => {
  const chainId = chain.evmChainId?.toString() ?? CHAINFLIP_CHAIN_TO_ID_MAP[chain.chain] ?? 'unsupported'
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
const swappableAssetToChainflipAsset = (
  swappableAsset: CommonSwappableAssetType,
  assets: AssetData[]
): AssetData | undefined => {
  const chain = CHAINFLIP_ID_TO_CHAIN_MAP[swappableAsset.chainId.toString()]
  if (chain === 'Bitcoin') return undefined
  return assets.find(a => {
    if (a.chain !== chain) return false
    if (chain === 'Polkadot') {
      return a.asset === 'DOT'
    } else if (swappableAsset.contractAddress) {
      return a.contractAddress?.toLowerCase() === swappableAsset.contractAddress.toLowerCase()
    } else {
      // we're likely looking for native asset at this point, just double check that the symbol matches
      return !a.contractAddress && a.symbol.toLowerCase() === swappableAsset.symbol.toLowerCase()
    }
  })
}

const chainflipNetworkAtom = atom<ChainflipNetwork>('mainnet')
export const polkadotRpcAtom = atom(get =>
  get(chainflipNetworkAtom) === 'mainnet' ? 'wss://polkadot.api.onfinality.io/public' : 'wss://rpc-pdot.chainflip.io'
)

const brokerUrlAtom = atom(get => {
  switch (get(chainflipNetworkAtom)) {
    case 'mainnet':
      return 'https://broker.chainflip.talisman.xyz'
    case 'perseverance':
      return 'https://broker.perseverance.chainflip.talisman.xyz'
    default:
      return undefined
  }
})

export const CHAINFLIP_COMMISSION_BPS = 150
const swapSdkAtom = atom(get => {
  const network = get(chainflipNetworkAtom)
  const brokerUrl = get(brokerUrlAtom)
  return new SwapSDK({
    network,
    broker: brokerUrl ? { url: brokerUrl, commissionBps: CHAINFLIP_COMMISSION_BPS } : undefined,
  })
})

export const chainflipAssetsAtom = atom(async get =>
  (await get(swapSdkAtom).getAssets()).filter(a => a.asset !== 'FLIP')
)
export const chainflipChainsAtom = atom(async get => await get(swapSdkAtom).getChains())

const tokensSelector = atom(async (get): Promise<CommonSwappableAssetType[]> => {
  const assets = await get(chainflipAssetsAtom)
  const chains = await get(chainflipChainsAtom)
  const tokens: CommonSwappableAssetType[] = []

  for (const asset of assets) {
    const chain = chains.find(chain => chain.chain === asset.chain)
    // for safety measure only, unless chainflip has bug
    if (!chain) continue
    const swappableAsset = chainflipAssetToSwappableAsset(asset, chain)
    if (swappableAsset) tokens.push(swappableAsset)
  }

  return tokens.sort((a, b) => {
    if (a.symbol === 'FLIP') return 1
    if (b.symbol === 'FLIP') return -1
    return 0
  })
})

const quote: QuoteFunction = async (get): Promise<(BaseQuote & { data?: QuoteResponse }) | null> => {
  const sdk = get(swapSdkAtom)
  const fromAsset = get(fromAssetAtom)
  const toAsset = get(toAssetAtom)
  const fromAmount = get(fromAmountAtom)
  const assets = await get(chainflipAssetsAtom)
  if (!fromAsset || !toAsset || !fromAmount || fromAmount.planck === 0n) return null

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
      boostFeeBps: CHAINFLIP_COMMISSION_BPS,
    })

    return {
      protocol: PROTOCOL,
      inputAmountBN: fromAmount.planck,
      outputAmountBN: BigInt(quote.quote.egressAmount),
      talismanFeeBps: CHAINFLIP_COMMISSION_BPS,
      fees: null,
      data: quote,
    }
  } catch (_error) {
    console.error(_error)
    const error = _error as Error & { response?: { data?: { message: string } } }
    const errorMessage =
      error.name === 'AxiosError'
        ? error.response?.data?.message.includes('InsufficientLiquidity') ||
          error.response?.data?.message.toLowerCase().includes('insufficient liquidity')
          ? 'Chainflip: Insufficient liquidity. Please try again with a smaller amount'
          : `Chainflip: ${error.response?.data?.message}`
        : error.message ?? 'Unknown error'

    return {
      protocol: PROTOCOL,
      inputAmountBN: fromAmount.planck,
      error: errorMessage,
      fees: null,
    }
  }
}

export type ChainflipSwapActivityData = {
  id: string
  network: ChainflipNetwork
}

const saveAddressForQuest = async (swapId: string, fromAddress: string) => {
  const api = import.meta.env.REACT_APP_QUEST_API
  if (!api) return
  await fetch(`${api}/api/quests/chainflip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ swapId, fromAddress }),
  })
}

const swap: SwapFunction<ChainflipSwapActivityData> = async (
  get: Getter,
  _: Setter,
  { evmWalletClient, getSubstrateApi, substrateWallet }
) => {
  const sdk = get(swapSdkAtom)
  const network = get(chainflipNetworkAtom)
  const fromAsset = get(fromAssetAtom)
  const toAsset = get(toAssetAtom)
  const fromAmount = get(fromAmountAtom)
  const fromAddress = get(fromAddressAtom)
  const toAddress = get(toAddressAtom)
  const assets = await get(chainflipAssetsAtom)
  const chains = await get(chainflipChainsAtom)

  // make sure we have all the parameters we need
  if (!fromAsset) throw new Error('From asset not selected.')
  if (!toAsset) throw new Error('To asset not selected.')
  if (!fromAddress) throw new Error('Missing from address')
  if (!toAddress) throw new Error('Missing to address')
  if (fromAmount.planck === 0n) throw new Error('Cannot swap 0 amount')

  // map assets to chainflip assets
  const chainflipFromAsset = swappableAssetToChainflipAsset(fromAsset, assets)
  const chainflipToAsset = swappableAssetToChainflipAsset(toAsset, assets)
  const chainflipFromChain = chains.find(c => c.chain === CHAINFLIP_ID_TO_CHAIN_MAP[fromAsset.chainId.toString()])
  if (!chainflipFromAsset) throw new Error(`${fromAsset.symbol} on ${fromAsset.chainId} not supported on Chainflip`)
  if (!chainflipToAsset) throw new Error(`${toAsset.symbol} on ${toAsset.chainId} not supported on Chainflip`)
  if (!chainflipFromChain) throw new Error(`Chain ${fromAsset.chainId} not supported on Chainflip`)

  // validate from address for the source chain
  const swappingFromEVM = EVM_CHAINS.some(c => c.id.toString() === fromAsset.chainId.toString())
  if (swappingFromEVM && !isAddress(fromAddress))
    throw new Error(`Cannot swap from EVM chain with non-EVM address: ${fromAddress}`)
  if (!swappingFromEVM && !isSubstrateAddress(fromAddress))
    throw new Error(`Cannot swap from Polkadot chain with non-Polkadot address: ${fromAddress}`)

  // validate to address for the source chain
  const swappingToEVM = EVM_CHAINS.some(c => c.id.toString() === toAsset.chainId.toString())
  if (swappingToEVM && !isAddress(toAddress))
    throw new Error(`Cannot swap to EVM chain with non-EVM address: ${toAddress}`)
  if (!swappingToEVM && !isSubstrateAddress(toAddress))
    throw new Error(`Cannot swap to Polkadot chain with non-Polkadot address: ${toAddress}`)

  try {
    // request a deposit address to send funds to
    const depositAddress = await sdk.requestDepositAddress({
      destAddress: toAddress,
      amount: fromAmount.planck.toString(),
      destChain: chainflipToAsset.chain,
      destAsset: chainflipToAsset.asset,
      srcAsset: chainflipFromAsset.asset,
      srcChain: chainflipFromAsset.chain,
    })

    // begin swap
    if (swappingFromEVM) {
      if (!evmWalletClient) throw new Error('Ethereum account not connected')
      if (chainflipFromChain.evmChainId === undefined) throw new Error('Missing evmChainId, this is likely a bug.')

      await evmWalletClient.switchChain({ id: chainflipFromChain.evmChainId })
      const chain = EVM_CHAINS.find(c => c.id.toString() === fromAsset.chainId.toString())
      if (!chain) throw new Error('Chain not found')
      if (!chainflipFromAsset.contractAddress) {
        await evmWalletClient.sendTransaction({
          chain,
          to: depositAddress.depositAddress as `0x${string}`,
          value: BigInt(depositAddress.amount),
          account: fromAddress as `0x${string}`,
        })
      } else {
        await evmWalletClient.writeContract({
          chain,
          abi: erc20Abi,
          address: fromAsset.contractAddress as `0x${string}`,
          functionName: 'transfer',
          account: fromAddress as `0x${string}`,
          args: [depositAddress.depositAddress as `0x${string}`, BigInt(depositAddress.amount)],
        })
      }
      saveAddressForQuest(depositAddress.depositChannelId, fromAddress)

      return { protocol: PROTOCOL, data: { id: depositAddress.depositChannelId, network } }
    } else {
      const signer = substrateWallet?.signer
      if (!signer) throw new Error('Substrate wallet not connected.')
      const polkadotRpc = get(polkadotRpcAtom)
      const polkadotApi = await getSubstrateApi(polkadotRpc)

      await polkadotApi.tx.balances
        .transferKeepAlive(depositAddress.depositAddress, depositAddress.amount)
        .signAndSend(fromAddress, { signer })

      saveAddressForQuest(depositAddress.depositChannelId, fromAddress)
      return { protocol: PROTOCOL, data: { id: depositAddress.depositChannelId, network } }
    }
  } catch (e) {
    console.error(e)
    // TODO: convert to user friendly error messages
    throw e
  }
}

const getEstimateGasTx: GetEstimateGasTxFunction = async (get, { getSubstrateApi }) => {
  const fromAsset = get(fromAssetAtom)
  const fromAddress = get(fromAddressAtom)
  if (!fromAsset) return null
  if (!fromAddress) return null

  const swappingFromEVM = EVM_CHAINS.some(c => c.id.toString() === fromAsset.chainId.toString())
  if (swappingFromEVM) {
    if (!isAddress(fromAddress)) return null // invalid ethereum address

    // the to address and amount dont matter, we just need to place any address here for the estimation
    return {
      type: 'evm',
      chainId: +fromAsset.chainId,
      tx: {
        from: fromAddress as `0x${string}`,
        data: fromAsset.contractAddress
          ? encodeFunctionData({ abi: erc20Abi, functionName: 'transfer', args: [fromAddress, 0n] })
          : undefined,

        to: fromAsset.contractAddress ? (fromAsset.contractAddress as `0x${string}`) : fromAddress,
        value: 0n,
      },
    }
  }

  // swapping from Polkadot

  const chainRpc = get(polkadotRpcAtom)
  const polkadotApi = await getSubstrateApi(chainRpc)
  const fromAmount = get(fromAmountAtom)

  return {
    type: 'substrate',
    fromAddress,
    tx: polkadotApi.tx.balances.transferKeepAlive(fromAddress, fromAmount.planck),
  }
}

export const chainflipSwapModule: SwapModule = {
  protocol: PROTOCOL,
  tokensSelector,
  getEstimateGasTx,
  quote,
  swap,
}

// helpers

const retryStatus = async (
  get: Getter,
  id: string,
  attempts = 0
): Promise<SwapStatusResponse & { expired: boolean }> => {
  try {
    const status = await get(swapSdkAtom).getStatus({ id })
    let expired = false

    if (!['FAILED', 'COMPLETE', 'BROADCAST_ABORTED'].includes(status.state)) {
      if (status.estimatedDepositChannelExpiryTime && status.state === 'AWAITING_DEPOSIT') {
        const now = new Date().getTime()
        expired = now > status.estimatedDepositChannelExpiryTime
      }
      if (!expired) get(swapQuoteRefresherAtom)
    }

    return { ...status, expired }
  } catch (e) {
    const error = e as Error & { response?: { status: number } }
    // because we're using a broker, the tx isnt always available immediately in their api service
    // so we wait a bit and retry
    if (error.name === 'AxiosError' && error?.response?.status === 404 && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 5000))
      return retryStatus(get, id, attempts + 1)
    }
    throw e
  }
}

export const chainflipSwapStatusAtom = atomFamily((id: string) => atom(async get => await retryStatus(get, id)))
