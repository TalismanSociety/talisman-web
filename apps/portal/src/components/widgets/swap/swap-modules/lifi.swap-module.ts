import type { Chain as ViemChain } from 'viem/chains'
import * as sdk from '@lifi/sdk'
import { evmErc20TokenId, evmNativeTokenId } from '@talismn/balances'
import { evmNetworksByIdAtom, tokensByIdAtom } from '@talismn/balances-react'
import BigNumber from 'bignumber.js'
import { atom, Getter, Setter } from 'jotai'
import { atomFamily, loadable } from 'jotai/utils'
import { zeroAddress } from 'viem'

import { allEvmChains } from '@/components/widgets/swap/allEvmChains.ts'
import { lifiTalismanTokens } from '@/components/widgets/swap/curated-tokens'

import { knownEvmNetworksAtom } from '../helpers'
import {
  fromAddressAtom,
  fromAmountAtom,
  fromAssetAtom,
  getTokenIdForSwappableAsset,
  QuoteFunction,
  selectedSubProtocolAtom,
  SupportedSwapProtocol,
  SwapFunction,
  SwapModule,
  SwappableAssetBaseType,
  swapQuoteRefresherAtom,
  toAddressAtom,
  toAssetAtom,
} from './common.swap-module'

const PROTOCOL: SupportedSwapProtocol = 'lifi' as const
const PROTOCOL_NAME = 'LI.FI'
const DECENTRALISATION_SCORE = 2
const TALISMAN_FEE = 0.002 // We take a fee of 0.2%

sdk.createConfig({
  integrator: 'talisman',
  apiKey: import.meta.env.VITE_LIFI_SECRET,
})

export const allPairsCsvAtom = atom(async get => {
  const allTokens = await get(assetsSelector)

  const rows = allTokens

  return [['symbol', 'chain'].join(',')]
    .concat(rows.filter(token => token?.symbol && token?.chainId).map(token => `${token?.symbol},${token?.chainId}`))
    .join('\n')
})

const assetsSelector = atom(async (get): Promise<SwappableAssetBaseType[]> => {
  const allTokens = (await sdk.getTokens({ chainTypes: [sdk.ChainType.EVM, sdk.ChainType.SVM] }))?.tokens

  for (const talismanTokenId of lifiTalismanTokens ?? []) {
    const [chainId] = talismanTokenId.split('-')
    const [contractAddress] = talismanTokenId.split('-').slice(-1)
    if (!chainId || !contractAddress) continue
    const type = talismanTokenId.slice(chainId.length + 1).slice(0, -contractAddress.length - 1)
    if (type !== 'evm-erc20') continue

    try {
      const token = await sdk.getToken(parseInt(chainId, 10), contractAddress)
      allTokens[token?.chainId]?.push?.(token)
    } catch (cause) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to add lifi token ${talismanTokenId}`, cause)
    }
  }

  const networks = await get(evmNetworksByIdAtom)
  const chaindataTokensById = await get(tokensByIdAtom)
  const tokens = Object.entries(allTokens)
    .filter(([id]) => {
      return networks[id.toString()]
    })
    .map(([id, tokens]): SwappableAssetBaseType[] => {
      return tokens.map(t => {
        const chaindataId = getTokenIdForSwappableAsset('evm', id, t.address)
        const chaindataLogo = chaindataTokensById[chaindataId]?.logo
        return {
          chainId: id,
          context: {
            lifi: t,
          },
          decimals: t.decimals,
          name: t.name,
          networkType: 'evm',
          symbol: t.symbol,
          contractAddress: t.address === zeroAddress ? undefined : t.address,
          image: chaindataLogo ?? t.logoURI,
          id: t.address === zeroAddress ? evmNativeTokenId(id) : evmErc20TokenId(id, t.address),
        }
      })
    })

  return tokens.flat()
})

export const fromAssetsSelector = atom(async get => await get(assetsSelector))
export const toAssetsSelector = atom(async get => await get(assetsSelector))

const routesAtom = atom(async get => {
  try {
    const SWAP_PLACEHOLDER_ADDRESS = '0x70045A9F59A354550EC0272f73AAe03B01Fb8a7a'
    const fromAddress = get(fromAddressAtom) ?? SWAP_PLACEHOLDER_ADDRESS
    const toAddress = get(toAddressAtom) ?? SWAP_PLACEHOLDER_ADDRESS
    const fromAsset = get(fromAssetAtom)
    const toAsset = get(toAssetAtom)
    const fromAmount = get(fromAmountAtom)
    const networks = await get(knownEvmNetworksAtom)

    if (fromAmount.planck === 0n) return null
    // assets not supported
    if (fromAsset?.networkType !== 'evm' || toAsset?.networkType !== 'evm') return null
    const evmNetwork = networks[fromAsset.chainId.toString()]
    // network not supported
    if (!evmNetwork) return null

    get(swapQuoteRefresherAtom)

    return await sdk.getRoutes({
      fromAddress,
      toAddress,
      fromChainId: +fromAsset.chainId,
      toChainId: +toAsset.chainId,
      fromAmount: fromAmount.planck.toString(),
      fromTokenAddress: fromAsset.contractAddress ?? zeroAddress,
      toTokenAddress: toAsset.contractAddress ?? zeroAddress,
      options: {
        integrator: 'talisman',
        fee: TALISMAN_FEE,
      },
    })
  } catch (e) {
    return { routes: [], unavailableRoutes: { failed: [], filteredOut: [] } } as sdk.RoutesResponse
  }
})
const subProviderQuoteAtom = atomFamily((id: string) =>
  loadable(
    atom(async get => {
      const routes = await get(routesAtom)
      if (!routes) return null
      const route = routes.routes.find(r => r.id === id)
      const step = route?.steps[0]
      if (!step) return null
      const transaction = await sdk.getStepTransaction(step)
      if (!transaction?.transactionRequest) return null
      const fromAsset = get(fromAssetAtom)
      if (!fromAsset) return null

      const fees =
        step.estimate.feeCosts?.map(fee => ({
          amount: BigNumber(fee.amount).times(10 ** -fee.token.decimals),
          name: fee.name,
          tokenId:
            fee.token.address === zeroAddress
              ? evmNativeTokenId(fee.token.chainId.toString())
              : evmErc20TokenId(fee.token.chainId.toString(), fee.token.address),
        })) ?? []

      if (step.estimate.gasCosts) {
        step.estimate.gasCosts.forEach(c => {
          fees.push({
            amount: BigNumber(c.amount).times(10 ** -c.token.decimals),
            name: 'Gas',
            tokenId:
              c.token.address === zeroAddress
                ? evmNativeTokenId(c.token.chainId.toString())
                : evmErc20TokenId(c.token.chainId.toString(), c.token.address),
          })
        })
      }
      // add talisman fee
      fees.push({
        amount: BigNumber(step.estimate.fromAmount.toString())
          .times(10 ** -fromAsset.decimals)
          .times(TALISMAN_FEE),
        name: 'Talisman Fee',
        tokenId: fromAsset.id,
      })
      return {
        decentralisationScore: DECENTRALISATION_SCORE,
        fees,
        talismanFee: TALISMAN_FEE,
        inputAmountBN: BigInt(step.estimate.fromAmount),
        outputAmountBN: BigInt(route.toAmountMin),
        protocol: PROTOCOL,
        timeInSec: step.estimate.executionDuration,
        data: { ...route, transactionRequest: transaction.transactionRequest },
        providerLogo: step.toolDetails.logoURI,
        providerName: step.toolDetails.name,
        subProtocol: step.tool,
      }
    })
  )
)

const quoteAtom: QuoteFunction<sdk.Route & { transactionRequest: sdk.TransactionRequest }> = loadable(
  atom(async get => {
    const routes = await get(routesAtom)
    if (!routes) return null

    return routes.routes.map(r => get(subProviderQuoteAtom(r.id)))
  })
)

// if approval is required, returns the contract to approve for, the amount, and token contract
const approvalAtom = atom(get => {
  const quote = get(quoteAtom)
  const fromAsset = get(fromAssetAtom)
  if (quote.state !== 'hasData' || !quote.data || !fromAsset || !fromAsset.contractAddress) return null

  const selectedSubProtocol = get(selectedSubProtocolAtom)
  const quoteData = Array.isArray(quote.data)
    ? quote.data.map(d => (d.state === 'hasData' ? d.data : null)).find(d => d?.subProtocol === selectedSubProtocol)
    : quote.data
  const lifiData = quoteData?.data
  if (!lifiData?.transactionRequest) return null
  const contractAddress = lifiData.transactionRequest.to
  const chainId = lifiData.transactionRequest.chainId
  const fromAddress = lifiData.transactionRequest.from
  if (!contractAddress || chainId === undefined || !fromAddress) return null

  const amount = BigInt(lifiData.fromAmount)

  return {
    contractAddress,
    amount,
    tokenAddress: fromAsset.contractAddress,
    chainId,
    fromAddress,
    protocolName: PROTOCOL_NAME,
  }
})

const swap: SwapFunction<{ id: string }> = async (get: Getter, _: Setter, { evmWalletClient }) => {
  const quote = get(quoteAtom)
  const selectedSubProtocol = get(selectedSubProtocolAtom)

  if (quote.state !== 'hasData' || !quote.data) throw new Error('Swap not ready yet.')

  const networks = await get(knownEvmNetworksAtom)
  const fromAsset = get(fromAssetAtom)

  if (!evmWalletClient) throw new Error('Ethereum wallet not connected.')
  if (fromAsset?.networkType !== 'evm') throw new Error('Not supported on Lifi')

  const evmNetwork = networks[fromAsset.chainId.toString()]
  if (!evmNetwork) throw new Error('Network not supported')

  const quoteData = Array.isArray(quote.data)
    ? quote.data.map(d => (d.state === 'hasData' ? d.data : null)).find(d => d?.subProtocol === selectedSubProtocol)
    : quote.data
  const lifiData = quoteData?.data
  if (!lifiData?.transactionRequest) throw new Error('Please select the quote again.')
  const txRequest = lifiData.transactionRequest
  if (
    !txRequest ||
    txRequest.to === undefined ||
    txRequest.data === undefined ||
    txRequest.chainId === undefined ||
    txRequest.value === undefined ||
    txRequest.from === undefined ||
    txRequest.gasLimit === undefined
  )
    throw new Error('Unknown error, please try again.')

  if (txRequest.from.toLowerCase() !== evmWalletClient.account?.address.toLowerCase())
    throw new Error('Invalid sender address')

  const chain: ViemChain | undefined = Object.values(allEvmChains).find(c => c?.id === txRequest.chainId)
  if (!chain) throw new Error('Unknown chain')

  await evmWalletClient.switchChain({ id: chain.id })
  const swapHash = await evmWalletClient.sendTransaction({
    to: txRequest.to as `0x${string}`,
    value: BigInt(txRequest.value),
    data: txRequest.data as `0x${string}`,
    gasLimit: txRequest.gasLimit,
    account: txRequest.from as `0x${string}`,
    chain,
  })

  return {
    data: {
      id: swapHash,
    },
    depositRes: {
      chainId: chain.id,
      txHash: swapHash,
    },
    protocol: PROTOCOL,
  }
}

export const lifiSwapModule: SwapModule = {
  protocol: PROTOCOL,
  fromAssetsSelector,
  toAssetsSelector,
  quote: quoteAtom,
  swap,
  decentralisationScore: DECENTRALISATION_SCORE,
  approvalAtom,
}

const retryStatus = async (
  get: Getter,
  id: string,
  attempts = 0
): Promise<{ status: sdk.StatusResponse; expired?: boolean }> => {
  try {
    const status = await sdk.getStatus({ txHash: id })
    const expired = false

    if (status.substatus !== 'COMPLETED') {
      get(swapQuoteRefresherAtom)
    }

    return { status, expired }
  } catch (e) {
    const error = e as Error & { response?: { status: number } }
    // because we're using a broker, the tx isnt always available immediately in their api service
    // so we wait a bit and retry
    if (error.name === 'AxiosError' && error?.response?.status === 404 && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 5000))
      get(swapQuoteRefresherAtom)
    }
    throw e
  }
}

export const lifiSwapStatusAtom = atomFamily((id: string) => atom(async get => await retryStatus(get, id)))
