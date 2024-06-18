import {
  chainflipAssetsAndChainsState,
  chainflipSwappableAssets,
  chainflipSwappableChains,
  polkadotRpcAtom,
  swapSdkState,
} from './chainflip.api'
import { swapInfoTabState } from './side-panel'
import type { SwappableAssetType, SwappableChainId, SwappableChainType } from './swap.types'
import { accountsState, evmAccountsState, substrateAccountsState, type Account } from '@/domains/accounts'
import { substrateApiState } from '@/domains/common'
import { storageEffect } from '@/domains/common/effects'
import { connectedSubstrateWalletState } from '@/domains/extension'
import { type ChainData } from '@chainflip/sdk/swap'
import '@polkadot/api-augment/substrate'
import { type DispatchError } from '@polkadot/types/interfaces'
import { isAddress as isSubstrateAddress } from '@polkadot/util-crypto'
import { array, jsonParser, number, object, or, string } from '@recoiljs/refine'
import { type Balances } from '@talismn/balances'
import { useBalances } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { toast } from '@talismn/ui'
import '@talismn/ui/assets/css/talismn.css'
import { useCallback, useEffect, useMemo } from 'react'
import {
  atom,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil'
import { createPublicClient, erc20Abi, http, isAddress, type SendTransactionReturnType } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { useWalletClient } from 'wagmi'

const EVM_CHAINS = [mainnet, sepolia]

export type AssetsWithProtocols = {
  symbol: string
  name: string
  chainId: SwappableChainId
  contractAddress?: string
  assets: SwappableAssetType[]
}

export const allSwappableChainsState = selector({
  key: 'allSwappableChains',
  get: ({ get }) => {
    const chainflipChains = get(chainflipSwappableChains)
    const chains: Partial<Record<SwappableChainId, SwappableChainType>> = {}
    chainflipChains.forEach(chain => {
      chains[chain.chainId] = chain
    })
    return chains
  },
})

export const allSwappableAssetsState = selector({
  key: 'allSwappableAssets',
  get: ({ get }): AssetsWithProtocols[] => {
    const chainflipAssets = get(chainflipSwappableAssets)
    const chainsById = get(allSwappableChainsState)
    const assetsWithProtocols: AssetsWithProtocols[] = []
    chainflipAssets.forEach(asset => {
      let assetIndex = assetsWithProtocols.findIndex(a => {
        const chain = chainsById[asset.chainId]
        if (!chain) return false
        const chainMatch = asset.chainId === a.chainId
        if (!chainMatch) return false
        if (chain.evmChainId !== undefined) {
          return asset.contractAddress === a.contractAddress
        }
        // TODO: in the future we may have to do some manual check for substrate assets
        return asset.symbol === a.symbol
      })
      if (assetIndex === -1)
        assetIndex =
          assetsWithProtocols.push({
            name: asset.name,
            symbol: asset.symbol,
            contractAddress: asset.contractAddress,
            chainId: asset.chainId,
            assets: [],
          }) - 1

      assetsWithProtocols[assetIndex]!.assets.push(asset)
    })

    return assetsWithProtocols
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

export const swapsState = atom<readonly { id: string; date: string | number }[]>({
  key: '@talisman/swap/chainflip/mainnet/swap-ids',
  default: [],
  effects: [
    storageEffect(localStorage, {
      parser: jsonParser(
        array(
          object({
            id: string(),
            date: or(string(), number()),
          })
        )
      ),
    }),
  ],
})

export const swapStatusSelector = selectorFamily({
  key: 'swapStatus',
  get:
    (id: string) =>
    async ({ get }) => {
      const sdk = get(swapSdkState)
      const status = await sdk.getStatus({ id })
      let expired = false

      if (!(['FAILED', 'COMPLETE', 'BROADCAST_ABORTED'] as const).includes(status.state as any)) {
        if (status.estimatedDepositChannelExpiryTime && status.state === 'AWAITING_DEPOSIT') {
          const now = new Date().getTime()
          expired = now > status.estimatedDepositChannelExpiryTime
        }
        if (!expired) get(quoteRefresherState)
      }
      return { ...status, expired }
    },
})

export const swappingState = atom<boolean>({
  key: 'swapping',
  default: false,
})

export const processingSwapState = atom<boolean>({
  key: 'processingSwap',
  default: false,
})

export const getBalanceForChainflipAsset = (balances: Balances, tokenSymbol: string, chainData: ChainData) =>
  balances.find(b => {
    const chainMatch = b.evmNetworkId === `${chainData.evmChainId}` || b.chain?.name === chainData.chain
    const tokenMatch = b.token.symbol === tokenSymbol
    return tokenMatch && chainMatch && !b.subSource
  })

// ==== HOOKS ====

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

  // TODO: need a better identifier for chains before we turn on arbitrum
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
    const loading = targetBalances.each.find(b => b.status === 'initializing') !== undefined
    return {
      balance: Decimal.fromPlanck(targetBalances.sum.planck.transferable, tokenDecimal, { currency: tokenSymbol }),
      loading,
    }
  }, [balances, address, tokenSymbol, tokenDecimal, chainData])
}

export const useSwap = () => {
  const fromAccount = useRecoilValue(fromAccountState)
  const toAccount = useRecoilValue(toAccountState)
  const setFromAountInput = useSetRecoilState(fromAmountInputState)
  const setInfoTab = useSetRecoilState(swapInfoTabState)
  const fromAssetLoadable = useRecoilValueLoadable(fromAssetState)
  const toAssetLoadable = useRecoilValueLoadable(toAssetState)
  const fromAmountLoadable = useRecoilValueLoadable(fromAmountState)
  const sdk = useRecoilValue(swapSdkState)
  const { data: evmWalletClient } = useWalletClient()
  const [swapping, setSwapping] = useRecoilState(swappingState)
  const setProcessingSwap = useSetRecoilState(processingSwapState)
  const polkadotRpc = useRecoilValue(polkadotRpcAtom)
  const substrateApiLoadable = useRecoilValueLoadable(substrateApiState(polkadotRpc))
  const substrateWallet = useRecoilValue(connectedSubstrateWalletState)
  const setSwaps = useSetRecoilState(swapsState)

  const swap = useCallback(async () => {
    try {
      setSwapping(true)
      if (!fromAccount || !toAccount) throw new Error('Missing accounts')
      if (
        fromAssetLoadable.state !== 'hasValue' ||
        toAssetLoadable.state !== 'hasValue' ||
        fromAmountLoadable.state !== 'hasValue'
      )
        throw new Error('Missing swap parameters')
      const fromAsset = fromAssetLoadable.contents
      const toAsset = toAssetLoadable.contents
      const fromAmount = fromAmountLoadable.contents

      if (!toAsset) throw new Error('Missing asset to receive')
      if (!fromAsset) throw new Error('Missing asset to send')
      if (!fromAmount) throw new Error('Missing amount to send')

      const depositAddress = await sdk.requestDepositAddress({
        destAddress: toAccount.address,
        destChain: toAsset.chain.chain,
        amount: fromAmount.planck.toString(),
        destAsset: toAsset.asset,
        srcAsset: fromAsset.asset,
        srcChain: fromAsset.chain.chain,
      })

      switch (fromAsset.chain.chain) {
        case 'Ethereum': {
          if (fromAccount.type !== 'ethereum') throw new Error("Can't swap from non-EVM account")
          if (!evmWalletClient) throw new Error('Ethereum account not connected')
          if (fromAsset.chain.evmChainId === undefined) throw new Error('Missing evmChainId, this is likely a bug.')
          const chain = EVM_CHAINS.find(chain => chain.id === fromAsset.chain.evmChainId)
          if (!chain) throw new Error('Missing evmChain, this is likely a bug.')

          // make sure user is swapping on the right chain
          await evmWalletClient.switchChain({ id: chain.id })

          let txHash: SendTransactionReturnType
          if (!fromAsset.contractAddress) {
            txHash = await evmWalletClient.sendTransaction({
              chain,
              to: depositAddress.depositAddress as `0x${string}`,
              value: BigInt(depositAddress.amount),
              account: fromAccount.address as `0x${string}`,
            })
          } else {
            txHash = await evmWalletClient.writeContract({
              chain,
              abi: erc20Abi,
              address: fromAsset.contractAddress as `0x${string}`,
              functionName: 'transfer',
              account: fromAccount.address as `0x${string}`,
              args: [depositAddress.depositAddress as `0x${string}`, BigInt(depositAddress.amount)],
            })
          }

          setProcessingSwap(true)
          setSwaps(prev => [{ id: depositAddress.depositChannelId, date: new Date().toISOString() }, ...prev])
          setInfoTab('activities')
          setFromAountInput('')

          const client = createPublicClient({ chain, transport: http() })
          const receipt = await client.waitForTransactionReceipt({ hash: txHash })
          // make sure we dont store ids for deposits that failed or they will appear stuck in the ui
          if (receipt.status === 'reverted') throw new Error('Transaction reverted.')
          break
        }
        case 'Polkadot': {
          if (substrateApiLoadable.state !== 'hasValue') throw new Error('Polkadot API not connected')
          if (!substrateWallet) throw new Error('Polkadot wallet not connected')

          const api = substrateApiLoadable.contents
          const signer = substrateWallet.signer

          let redirected = false
          // only store ids for successful deposits
          await new Promise((resolve, reject) => {
            api.tx.balances
              .transferKeepAlive(depositAddress.depositAddress, depositAddress.amount)
              .signAndSend(fromAccount.address, { signer }, ({ status, events }) => {
                setProcessingSwap(true)
                setSwaps(prev =>
                  prev.find(({ id }) => id === depositAddress.depositChannelId)
                    ? prev
                    : [{ id: depositAddress.depositChannelId, date: new Date().toISOString() }, ...prev]
                )
                if (!redirected && (status.isBroadcast || status.isFinalized || status.isInBlock)) {
                  redirected = true
                  setInfoTab('activities')
                  setFromAountInput('')
                }
                if (status.isInBlock || status.isFinalized) {
                  const systemFailedEvent = events
                    // find/filter for failed events
                    .find(({ event }) => api.events.system.ExtrinsicFailed.is(event))
                  if (!systemFailedEvent) return resolve(true)
                  // we know that data for system.ExtrinsicFailed is
                  // (DispatchError, DispatchInfo)
                  const {
                    event: {
                      data: [_error],
                    },
                  } = systemFailedEvent
                  const error = _error as DispatchError
                  if ((error as DispatchError)?.isModule) {
                    // for module errors, we have the section indexed, lookup
                    const decoded = api.registry.findMetaError(error.asModule)
                    const { docs, method, section } = decoded

                    reject(`${section}.${method}: ${docs.join(' ')}`)
                  } else {
                    // Other, CannotLookup, BadOrigin, no extra info
                    console.error(error?.toString())
                    reject(`Transaction failed, please check log for details.`)
                  }
                }
              })
              .catch(reject)
          })
          break
        }
        default: {
          throw new Error(`Unsupported swap from chain ${fromAsset.chain.chain}`)
        }
      }
    } catch (e) {
      console.error(e)
      const error = e as any
      toast.error(error?.shortMessage ?? error?.details ?? error.message ?? 'unknown error')
    } finally {
      setProcessingSwap(false)
      setSwapping(false)
    }
  }, [
    fromAccount,
    toAccount,
    sdk,
    fromAssetLoadable,
    toAssetLoadable,
    fromAmountLoadable,
    evmWalletClient,
    substrateWallet,
    substrateApiLoadable,
    setSwaps,
    setFromAountInput,
    setInfoTab,
    setSwapping,
    setProcessingSwap,
  ])

  return { swap, initializing: substrateApiLoadable.state !== 'hasValue', swapping }
}
