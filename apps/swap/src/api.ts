import { assetCoingeckoIds, assetIcons } from './config'
import type { Account } from './types'
import { isSubstrateAddress } from './utils'
import { SwapSDK, type Asset, type AssetData, type Chain, type ChainflipNetwork } from '@chainflip/sdk/swap'
import { ApiPromise, WsProvider } from '@polkadot/api'
import '@polkadot/api-augment/substrate'
import type { Signer } from '@polkadot/api/types'
import { BigIntMath, Decimal } from '@talismn/math'
import '@talismn/ui/assets/css/talismn.css'
import { differenceInDays } from 'date-fns'
import { atom, type Atom, type SetStateAction } from 'jotai'
import { atomEffect } from 'jotai-effect'
import {
  RESET,
  atomFamily,
  atomWithDefault,
  atomWithRefresh,
  atomWithStorage,
  createJSONStorage,
  loadable,
  unstable_withStorageValidator,
  useAtomCallback,
} from 'jotai/utils'
import { startTransition, useCallback } from 'react'
import { createPublicClient, erc20Abi, http, isAddress as isEvmAddress, type WalletClient } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { z } from 'zod'

const EVM_CHAINS = [mainnet, sepolia]

const ENABLED_CHAINS: Chain[] = ['Ethereum', 'Polkadot']

export class InputError extends Error {}

export const chainflipNetworkAtom = atom<ChainflipNetwork>('mainnet')

export const swapSdkAtom = atom(
  get =>
    new SwapSDK({
      network: get(chainflipNetworkAtom),
    })
)

export const polkadotRpcAtom = atom(get =>
  get(chainflipNetworkAtom) === 'mainnet' ? 'wss://polkadot.api.onfinality.io/public' : 'wss://rpc-pdot.chainflip.io'
)

export const accountsAtom = atom<Account[]>([])

export const srcAccountsAtom = atom(get => get(accountsAtom).filter(account => !account.readonly))

const _srcAccountAtom = atomWithDefault(get => get(srcAccountsAtom).at(0))

export const srcAccountAtomEffect = atomEffect((get, set) => {
  get(accountsAtom)

  set(_srcAccountAtom, RESET)
})

export const srcAccountAtom = atom(
  get => {
    get(srcAccountAtomEffect)

    return get(_srcAccountAtom)
  },
  (_, set, account: Account) => set(_srcAccountAtom, () => account)
)

export const chainsAtoms = atom(async get => await get(swapSdkAtom).getChains())

export const srcChainsAtom = atom(async get => {
  const chains = await get(chainsAtoms)

  const srcAccount = get(srcAccountAtom)

  if (srcAccount === undefined) {
    return chains
  }

  switch (srcAccount.type) {
    case 'evm':
      return chains.filter(chain => chain.evmChainId !== undefined)
    case 'substrate':
      return chains.filter(chain => ['Polkadot'].includes(chain.chain))
    default:
      return chains
  }
})

export const srcChainAtom = atom(async get => {
  const [chains, srcAsset] = await Promise.all([get(chainsAtoms), get(srcAssetAtom)])

  const srcChain = chains.find(chain => chain.chain === srcAsset.chain)

  if (srcChain === undefined) {
    throw new Error(`Can't find chain ${srcAsset.chain}`)
  }

  return srcChain
})

export const assetsAtom = atom(async get => await get(swapSdkAtom).getAssets())

export const srcAssetsAtom = atom(async get => {
  const srcChains = await get(srcChainsAtom)

  const assets = await Promise.all(srcChains.map(async chain => await get(swapSdkAtom).getAssets(chain.chain)))

  return Array.from(
    assets
      .flat()
      .reduce((prev, curr) => prev.set(curr.asset, curr), new Map<Asset, AssetData>())
      .values()
  )
})

export const destChainsAtom = atom(async get =>
  (await get(swapSdkAtom).getChains((await get(srcAssetAtom)).chain)).filter(chain =>
    ENABLED_CHAINS.includes(chain.chain)
  )
)

export const destAssetsAtom = atom(async get => {
  const destChains = await get(destChainsAtom)

  const assets = await Promise.all(destChains.map(async chain => await get(swapSdkAtom).getAssets(chain.chain)))

  return Array.from(
    assets
      .flat()
      .reduce((prev, curr) => prev.set(curr.asset, curr), new Map<Asset, AssetData>())
      .values()
  )
})

const _srcAssetAtom = atomWithDefault(async get => {
  const assets = await get(srcAssetsAtom)

  return assets.at(0)!
})

export const srcAssetAtomEffect = atomEffect((get, set) => {
  void get(srcAssetsAtom)
  set(_srcAssetAtom, RESET)
})

export const srcAssetAtom = atom(
  async get => {
    get(srcAssetAtomEffect)
    const asset = await get(_srcAssetAtom)

    return {
      ...asset,
      minimumSwapAmount: Decimal.fromPlanck(asset.minimumSwapAmount, asset.decimals, { currency: asset.symbol }),
      maximumSwapAmount:
        asset.maximumSwapAmount === null
          ? undefined
          : Decimal.fromPlanck(asset.maximumSwapAmount, asset.decimals, { currency: asset.symbol }),
    }
  },
  (_, set, asset: AssetData) => set(_srcAssetAtom, async () => asset)
)

const _destAssetAtom = atomWithDefault(async get => {
  const assets = await get(destAssetsAtom)

  return assets.at(0)!
})

export const destAssetAtomEffect = atomEffect((get, set) => {
  void get(destAssetsAtom)
  set(_destAssetAtom, RESET)
})

export const destAssetAtom = atom(
  async get => {
    get(destAssetAtomEffect)
    return await get(_destAssetAtom)
  },
  (_, set, asset: AssetData) => set(_destAssetAtom, async () => asset)
)

export const destAccountsAtom = atom(async get => {
  const accounts = get(accountsAtom)
  const asset = await get(destAssetAtom)

  switch (asset.chain) {
    case 'Ethereum':
      return accounts.filter(account => account.type === 'evm')
    case 'Polkadot':
      return accounts.filter(account => account.type === 'substrate')
    default:
      return accounts
  }
})

const _destAccountAtom = atomWithDefault(async get => {
  const accounts = await get(destAccountsAtom)
  const srcAccount = get(srcAccountAtom)

  return accounts.find(account => account === srcAccount) ?? accounts.at(0)
})

export const destAccountAtomEffect = atomEffect((get, set) => {
  void get(destAccountsAtom)
  set(_destAccountAtom, RESET)
})

export const destAccountAtom = atom(
  async get => {
    get(destAccountAtomEffect)

    const [accounts, account] = await Promise.all([get(destAccountsAtom), get(_destAccountAtom)])

    return accounts.find(x => x === account)
  },
  (_, set, account: Account) => set(_destAccountAtom, async () => account)
)

export const srcAmountInputAtom = atom<string>('')

export const srcAmountAtom = atom(async get => {
  const asset = await get(srcAssetAtom)

  return Decimal.fromUserInputOrUndefined(get(srcAmountInputAtom), asset.decimals, { currency: asset.symbol })
})

const quoteAtomEffect = atomEffect((get, set) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeout: any | undefined

  void (async () => {
    let quote: Awaited<typeof quoteAtom extends Atom<infer V> ? V : never> | undefined
    try {
      quote = await get(quoteAtom)
    } catch {
      /* empty */
    }

    if (quote !== undefined) {
      timeout = setTimeout(() => set(quoteAtom), quote.quote.estimatedDurationSeconds * 1000)
    }
  })()

  return () => clearTimeout(timeout)
})

const quoteFocusAtomEffect = atomEffect((get, set) => {
  void Promise.all([get(srcAssetAtom), get(destAssetAtom), get(srcAmountAtom)])
  set(focusedInfoSection, 'details')
})

export const quoteAtom = atomWithRefresh(async get => {
  get(quoteFocusAtomEffect)

  const [srcAsset, destAsset, amount, inputAmount] = await Promise.all([
    get(srcAssetAtom),
    get(destAssetAtom),
    get(srcAmountAtom),
    get(srcAmountInputAtom),
  ])

  if (inputAmount.trim() === '' || amount === undefined) {
    throw new InputError('No amount specified')
  }

  if (amount.planck < srcAsset.minimumSwapAmount.planck) {
    throw new InputError(`Minimum ${srcAsset.minimumSwapAmount.toLocaleString()}`)
  }

  if (srcAsset.maximumSwapAmount !== undefined && amount.planck > srcAsset.maximumSwapAmount.planck) {
    throw new InputError(`Maximum ${srcAsset.maximumSwapAmount.toLocaleString()}`)
  }

  const assets = await get(assetsAtom)

  const quote = await get(swapSdkAtom).getQuote({
    srcChain: srcAsset.chain,
    destChain: destAsset.chain,
    srcAsset: srcAsset.asset,
    destAsset: destAsset.asset,
    amount: amount.planck.toString(),
  })

  get(quoteAtomEffect)

  const includedFees = await Promise.all(
    quote.quote.includedFees.map(async fee => {
      const asset = assets.find(x => x.asset === fee.asset)

      if (asset === undefined) {
        throw new Error('No matching asset found')
      }

      const amount = Decimal.fromPlanck(fee.amount, asset.decimals, { currency: asset.symbol })
      const fiatAmount = (await get(assetFiatPriceAtomFamily(asset.asset))) * amount.toNumber()

      return { type: fee.type, amount, fiatAmount }
    })
  )

  const totalFee = {
    amount: includedFees.reduce((prev, curr) => prev + curr.fiatAmount, 0),
    currency: get(currencyAtom),
  }

  return {
    ...quote,
    quote: {
      ...quote.quote,
      includedFees,
      totalFee,
    },
  }
})

const StoredSwaps = z.array(z.object({ id: z.string(), date: z.date() }))

type StoredSwaps = z.infer<typeof StoredSwaps>

const _swapsStorage = unstable_withStorageValidator(
  (value): value is StoredSwaps => StoredSwaps.safeParse(value).success
)(
  createJSONStorage(() => globalThis.localStorage, {
    reviver: (key, value) => {
      if (key === 'date' && typeof value === 'string') {
        return new Date(value)
      }

      return value
    },
  })
)

const filterAndSortStoredSwaps = (swaps: StoredSwaps) => {
  const currentDate = new Date()

  return swaps
    .filter(swap => differenceInDays(currentDate, swap.date) < 7)
    .toSorted((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 50)
}

const swapsStorage: typeof _swapsStorage = {
  ..._swapsStorage,
  getItem: (key, initialValue) => filterAndSortStoredSwaps(_swapsStorage.getItem(key, initialValue)),
  setItem: (key, newValue) => _swapsStorage.setItem(key, filterAndSortStoredSwaps(newValue)),
}

export const swapsAtomFamily = atomFamily((network: ChainflipNetwork) =>
  atomWithStorage<StoredSwaps>(`@talisman/swap/chainflip/${network}/swap-ids`, [], swapsStorage)
)

export const swapsAtom = atom(
  get => filterAndSortStoredSwaps(get(swapsAtomFamily(get(chainflipNetworkAtom)))),
  (get, set, swaps: SetStateAction<StoredSwaps>) => set(swapsAtomFamily(get(chainflipNetworkAtom)), swaps)
)

const _swapStatusRequestCounterAtom = atom(0)

const swapStatusRequestCounterEffect = atomEffect((_, set) => {
  const interval = globalThis.setInterval(
    () => startTransition(() => set(_swapStatusRequestCounterAtom, counter => counter + 1)),
    5000
  )

  return () => globalThis.clearInterval(interval)
})

const swapStatusRequestCounterAtom = atom(get => {
  get(swapStatusRequestCounterEffect)

  return get(_swapStatusRequestCounterAtom)
})

export const swapStatusAtomFamily = atomFamily((id: string) =>
  atom(async get => {
    const status = await get(swapSdkAtom).getStatus({ id })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(['FAILED', 'COMPLETE', 'BROADCAST_ABORTED'] as const).includes(status.state as any)) {
      get(swapStatusRequestCounterAtom)
    }

    const assets = await get(assetsAtom)
    const srcAsset = assets.find(x => x.asset === status.srcAsset)

    if (srcAsset === undefined) {
      throw new Error(`Can't find asset: ${status.srcAsset}`)
    }

    const destAsset = status.destAsset === undefined ? undefined : assets.find(x => x.asset === status.destAsset)

    return {
      state: (() => {
        switch (status.state) {
          case 'AWAITING_DEPOSIT':
          case 'BROADCASTED':
          case 'BROADCAST_REQUESTED':
          case 'DEPOSIT_RECEIVED':
          case 'EGRESS_SCHEDULED':
          case 'SWAP_EXECUTED':
            return 'pending' as const
          case 'COMPLETE':
            return 'complete' as const
          case 'BROADCAST_ABORTED':
          case 'FAILED':
            return 'failed' as const
        }
      })(),
      amount:
        status.depositAmount === undefined
          ? undefined
          : Decimal.fromPlanck(status.depositAmount, srcAsset.decimals, { currency: srcAsset.symbol }),
      egressAmount:
        destAsset === undefined || !('egressAmount' in status)
          ? undefined
          : Decimal.fromPlanck(status.egressAmount, destAsset.decimals, { currency: destAsset.symbol }),
      srcAssetIcon: assetIcons[srcAsset.asset],
      destAssetIcon:
        destAsset === undefined
          ? 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/unknown.svg'
          : assetIcons[destAsset?.asset],
      date: status.depositChannelCreatedAt === undefined ? undefined : new Date(status.depositChannelCreatedAt),
      externalLink: (() => {
        switch (get(chainflipNetworkAtom)) {
          case 'mainnet':
            return `https://scan.chainflip.io/channels/${id}`
          case 'perseverance':
            return `https://scan.perseverance.chainflip.io/channels/${id}`
          default:
            throw new Error(`Unimplemented swap external link for network: ${get(chainflipNetworkAtom)}`)
        }
      })(),
    }
  })
)

export const swapPromiseAtom = atom<Promise<void>>(Promise.resolve())

export const swapPromiseLoadableAtom = loadable(swapPromiseAtom)

export const quoteLoadableAtom = loadable(quoteAtom)

export const destAmountAtom = atom(async get => {
  const [quote, asset] = await Promise.all([get(quoteAtom), get(destAssetAtom)])

  return Decimal.fromPlanck(quote.quote.egressAmount, asset.decimals, { currency: asset.symbol })
})

export const destAmountLoadableAtom = loadable(destAmountAtom)

export const srcEvmChain = atom(async get => {
  const srcChain = await get(srcChainAtom)

  if (srcChain.evmChainId === undefined) {
    throw new Error("Can't initiate Viem client on non-EVM chain")
  }

  const chain = EVM_CHAINS.find(chain => chain.id === srcChain.evmChainId)

  if (chain === undefined) {
    throw new Error(`No chain found with ID: ${srcChain.evmChainId}`)
  }

  return chain
})

export const viemPublicClientAtomFamily = atomFamily((evmChainId: number) =>
  atom(async () => {
    return createPublicClient({
      chain: EVM_CHAINS.find(chain => chain.id === evmChainId),
      transport: http(),
    })
  })
)

export const viemWalletClientAtom = atomWithDefault<WalletClient>(() => {
  throw new Error('No Viem wallet client available')
})

const polkadotApiAtom = atom(async get => await ApiPromise.create({ provider: new WsProvider(get(polkadotRpcAtom)) }))

export const substrateSignerAtom = atomWithDefault<Signer>(() => {
  throw new Error('No Substrate signer available')
})

export const coingeckoApiEndpointAtom = atom('https://api.coingecko.com')

export const coingeckoApiKeyAtom = atom<string | undefined>(undefined)

export const coingeckoApiTierAtom = atom<'pro' | 'demo'>('demo')

export const currencyAtom = atom('usd')

export const assetFiatPriceAtomFamily = atomFamily((asset: Asset) =>
  atom(async get => {
    try {
      const currency = get(currencyAtom)

      const url = new URL('/api/v3/simple/price', get(coingeckoApiEndpointAtom))
      url.searchParams.set('ids', assetCoingeckoIds[asset])
      url.searchParams.set('vs_currencies', currency)

      const apiKey = get(coingeckoApiKeyAtom)
      const apiTier = get(coingeckoApiTierAtom)

      const result = await fetch(url, {
        headers:
          apiKey === undefined
            ? undefined
            : apiTier === 'pro'
            ? { 'x-cg-pro-api-key': apiKey }
            : apiTier === 'demo'
            ? { 'x-cg-demo-api-key': apiKey }
            : undefined,
      }).then(async x => await x.json())

      return result[assetCoingeckoIds[asset]][currency] as number
    } catch {
      return 0
    }
  })
)

const srcAssetAvailableAmountAtomEffect = atomEffect((_, set) => {
  const interval = globalThis.setInterval(() => startTransition(() => set(srcAssetAvailableAmountAtom)), 6000)

  return () => globalThis.clearInterval(interval)
})

export const assetAvailableAmountAtomFamily = atomFamily(
  ({ address, asset }: { address: string; asset: Asset }) =>
    atom(async get => {
      const [chains, assets] = await Promise.all([get(chainsAtoms), get(assetsAtom)])

      const assetData = assets.find(x => x.asset === asset)

      if (assetData === undefined) {
        throw new Error(`Can't find asset: ${asset}`)
      }

      const chainData = chains.find(x => x.chain === assetData.chain)

      if (chainData === undefined) {
        throw new Error(`Can't find chain: ${assetData.chain}`)
      }

      const zeroAmount = Decimal.fromUserInput('0', assetData.decimals, { currency: assetData.symbol })

      switch (assetData.chain) {
        case 'Ethereum': {
          if (chainData.evmChainId === undefined) {
            throw new Error('Invalid EVM chain')
          }

          if (!isEvmAddress(address)) {
            return zeroAmount
          }

          const client = await get(viemPublicClientAtomFamily(chainData.evmChainId))

          const balance =
            assetData.contractAddress === undefined
              ? await client.getBalance({ address })
              : await client.readContract({
                  abi: erc20Abi,
                  address: assetData.contractAddress as `0x${string}`,
                  functionName: 'balanceOf',
                  args: [address],
                })

          return Decimal.fromPlanck(balance, assetData.decimals, { currency: assetData.symbol })
        }
        case 'Polkadot': {
          if (!isSubstrateAddress(address)) {
            return zeroAmount
          }

          const api = await get(polkadotApiAtom)

          const balances = await api.derive.balances.all(address)

          return Decimal.fromPlanck(
            BigIntMath.max(
              0n,
              balances.availableBalance.toBigInt() - api.consts.balances.existentialDeposit.toBigInt()
            ),
            assetData.decimals,
            { currency: assetData.symbol }
          )
        }
        default:
          throw new Error(`Unsupported asset chain: ${assetData.chain}`)
      }
    }),
  (a, b) => a.address === b.address && a.asset === b.asset
)

assetAvailableAmountAtomFamily.setShouldRemove(createdAt => new Date().getTime() - createdAt > 6000)

export const srcAssetAvailableAmountAtom = atomWithRefresh(async get => {
  const account = get(srcAccountAtom)

  if (account === undefined) {
    return
  }

  get(srcAssetAvailableAmountAtomEffect)

  return await get(assetAvailableAmountAtomFamily({ address: account.address, asset: (await get(srcAssetAtom)).asset }))
})

export const focusedInfoSection = atom<'details' | 'activities' | 'faq'>('details')

export const useReverse = () =>
  useAtomCallback(
    useCallback(async (get, set) => {
      const [accounts, srcAsset, destAsset] = await Promise.all([
        get(accountsAtom),
        get(_srcAssetAtom),
        get(destAssetAtom),
      ])

      // TODO: remove this time bomb
      set(
        _srcAccountAtom,
        accounts.find(account => (destAsset.chain === 'Ethereum' ? account.type === 'evm' : 'substrate'))
      )

      set(srcAssetAtom, destAsset)
      set(destAssetAtom, srcAsset)
    }, [])
  )

export const useSwap = () =>
  useAtomCallback(
    useCallback(async (get, set) => {
      const srcAccount = get(srcAccountAtom)

      if (srcAccount === undefined) {
        throw new Error('No source account selected')
      }

      const [destAccount, amount, srcAsset, destAsset] = await Promise.all([
        get(destAccountAtom),
        get(srcAmountAtom),
        get(srcAssetAtom),
        get(destAssetAtom),
      ])

      if (destAccount === undefined || amount === undefined) {
        return
      }

      const depositAddress = await get(swapSdkAtom).requestDepositAddress({
        destAddress: destAccount.address,
        amount: amount.planck.toString(),
        srcChain: srcAsset.chain,
        srcAsset: srcAsset.asset,
        destChain: destAsset.chain,
        destAsset: destAsset.asset,
      })

      switch (srcAsset.chain) {
        case 'Ethereum': {
          if (srcAccount.type !== 'evm') {
            throw new Error("Can't swap from non-EVM account")
          }

          const chain = await get(srcEvmChain)
          const client = get(viemWalletClientAtom)

          await client.switchChain({ id: chain?.id })

          if (srcAsset.contractAddress === undefined) {
            await client.sendTransaction({
              chain,
              account: srcAccount.address,
              to: depositAddress.depositAddress as `0x${string}`,
              value: BigInt(depositAddress.amount),
            })
          } else {
            await client.writeContract({
              chain,
              abi: erc20Abi,
              address: srcAsset.contractAddress as `0x${string}`,
              functionName: 'transfer',
              account: srcAccount.address,
              args: [depositAddress.depositAddress as `0x${string}`, BigInt(depositAddress.amount)],
            })
          }

          break
        }
        case 'Polkadot': {
          const api = await get(polkadotApiAtom)
          const signer = get(substrateSignerAtom)

          await api.tx.balances
            .transferKeepAlive(depositAddress.depositAddress, depositAddress.amount)
            .signAndSend(srcAccount.address, { signer })

          break
        }
        default:
          throw new Error(`Unsupported swap from chain ${srcAsset.chain}`)
      }

      set(srcAmountInputAtom, '')

      // Need to do this as we have an effect that trigger navigation
      // to details tab on amount input change
      // which will be triggered by the above atom setter
      // we want to ensure that user will be navigated to 'activities'
      // tab after having reset the src amount
      globalThis.requestIdleCallback(() => {
        set(swapsAtom, ids => [...ids, { id: depositAddress.depositChannelId, date: new Date() }])
        set(focusedInfoSection, 'activities')
      })
    }, [])
  )
