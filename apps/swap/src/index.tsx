import { SwapSDK, type Asset, type AssetData, type Chain, type ChainflipNetwork } from '@chainflip/sdk/swap'
import { ApiPromise, WsProvider } from '@polkadot/api'
import '@polkadot/api-augment/substrate'
import type { Signer } from '@polkadot/api/types'
import { BigIntMath, Decimal } from '@talismn/math'
import {
  Chip,
  CircularProgressIndicator,
  Identicon,
  Select,
  TalismanHandProgressIndicator,
  Text,
  Tooltip,
  toast,
} from '@talismn/ui'
import { SwapForm, TokenSelectDialog } from '@talismn/ui-recipes'
import '@talismn/ui/assets/css/talismn.css'
import { differenceInDays } from 'date-fns'
import { Provider, atom, useAtom, useAtomValue, useSetAtom, type Atom, type SetStateAction } from 'jotai'
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
  useHydrateAtoms,
} from 'jotai/utils'
import {
  Suspense,
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { createPublicClient, erc20Abi, http, isAddress, type WalletClient } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { z } from 'zod'
import { assetCoingeckoIds, assetIcons, chainIcons } from './config'
import { shortenAddress } from './utils'

const EVM_CHAINS = [mainnet, sepolia]

const ENABLED_CHAINS: Chain[] = ['Ethereum', 'Polkadot']

type Account = { name?: string; readonly?: boolean } & (
  | {
      type: 'evm'
      address: `0x${string}`
    }
  | { type: 'substrate'; address: string }
)

class InputError extends Error {}

const chainflipNetworkAtom = atom<ChainflipNetwork>('mainnet')

const swapSdkAtom = atom(
  get =>
    new SwapSDK({
      network: get(chainflipNetworkAtom),
    })
)

const polkadotRpcAtom = atom(get =>
  get(chainflipNetworkAtom) === 'mainnet' ? 'wss://polkadot.api.onfinality.io/public' : 'wss://rpc-pdot.chainflip.io'
)

const accountsAtom = atom<Account[]>([])

const srcAccountsAtom = atom(get => get(accountsAtom).filter(account => !account.readonly))

const _srcAccountAtom = atomWithDefault(get => get(srcAccountsAtom).at(0))

const srcAccountAtomEffect = atomEffect((get, set) => {
  get(accountsAtom)

  set(_srcAccountAtom, RESET)
})

const srcAccountAtom = atom(
  get => {
    get(srcAccountAtomEffect)

    return get(_srcAccountAtom)
  },
  (_, set, account: Account) => set(_srcAccountAtom, () => account)
)

const chainsAtoms = atom(async get => await get(swapSdkAtom).getChains())

const srcChainsAtom = atom(async get => {
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

const srcChainAtom = atom(async get => {
  const [chains, srcAsset] = await Promise.all([get(chainsAtoms), get(srcAssetAtom)])

  const srcChain = chains.find(chain => chain.chain === srcAsset.chain)

  if (srcChain === undefined) {
    throw new Error(`Can't find chain ${srcAsset.chain}`)
  }

  return srcChain
})

const assetsAtom = atom(async get => await get(swapSdkAtom).getAssets())

const srcAssetsAtom = atom(async get => {
  const srcChains = await get(srcChainsAtom)

  const assets = await Promise.all(srcChains.map(async chain => await get(swapSdkAtom).getAssets(chain.chain)))

  return Array.from(
    assets
      .flat()
      .reduce((prev, curr) => prev.set(curr.asset, curr), new Map<Asset, AssetData>())
      .values()
  )
})

const destChainsAtom = atom(async get =>
  (await get(swapSdkAtom).getChains((await get(srcAssetAtom)).chain)).filter(chain =>
    ENABLED_CHAINS.includes(chain.chain)
  )
)

const destAssetsAtom = atom(async get => {
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

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return assets.at(0)!
})

const srcAssetAtomEffect = atomEffect((get, set) => {
  void get(srcAssetsAtom)
  set(_srcAssetAtom, RESET)
})

const srcAssetAtom = atom(
  async get => {
    get(srcAssetAtomEffect)
    const asset = await get(_srcAssetAtom)

    return {
      ...asset,
      minimumSwapAmount: Decimal.fromPlanck(asset.minimumSwapAmount, asset.decimals, asset.symbol),
      maximumSwapAmount:
        asset.maximumSwapAmount === null
          ? undefined
          : Decimal.fromPlanck(asset.maximumSwapAmount, asset.decimals, asset.symbol),
    }
  },
  (_, set, asset: AssetData) => set(_srcAssetAtom, async () => asset)
)

const _destAssetAtom = atomWithDefault(async get => {
  const assets = await get(destAssetsAtom)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return assets.at(0)!
})

const destAssetAtomEffect = atomEffect((get, set) => {
  void get(destAssetsAtom)
  set(_destAssetAtom, RESET)
})

const destAssetAtom = atom(
  async get => {
    get(destAssetAtomEffect)
    return await get(_destAssetAtom)
  },
  (_, set, asset: AssetData) => set(_destAssetAtom, async () => asset)
)

const destAccountsAtom = atom(async get => {
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

const destAccountAtomEffect = atomEffect((get, set) => {
  void get(destAccountsAtom)
  set(_destAccountAtom, RESET)
})

const destAccountAtom = atom(
  async get => {
    get(destAccountAtomEffect)

    const [accounts, account] = await Promise.all([get(destAccountsAtom), get(_destAccountAtom)])

    return accounts.find(x => x === account)
  },
  (_, set, account: Account) => set(_destAccountAtom, async () => account)
)

const srcAmountInputAtom = atom<string>('')

const srcAmountAtom = atom(async get => {
  const asset = await get(srcAssetAtom)

  return Decimal.fromUserInputOrUndefined(get(srcAmountInputAtom), asset.decimals, asset.symbol)
})

const quoteAtomEffect = atomEffect((get, set) => {
  let timeout: any | undefined

  void (async () => {
    let quote: Awaited<typeof quoteAtom extends Atom<infer V> ? V : never> | undefined
    try {
      quote = await get(quoteAtom)
    } catch {}

    if (quote !== undefined) {
      timeout = setTimeout(() => set(quoteAtom), quote.quote.estimatedDurationSeconds * 1000)
    }
  })()

  return () => clearTimeout(timeout)
})

const quoteAtom = atomWithRefresh(async get => {
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

      const amount = Decimal.fromPlanck(fee.amount, asset.decimals, asset.symbol)
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

// eslint-disable-next-line @typescript-eslint/no-redeclare
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

const swapsAtomFamily = atomFamily((network: ChainflipNetwork) =>
  atomWithStorage<StoredSwaps>(`@talisman/swap/chainflip/${network}/swap-ids`, [], swapsStorage)
)

const swapsAtom = atom(
  get => get(swapsAtomFamily(get(chainflipNetworkAtom))),
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

const swapStatusAtomFamily = atomFamily((id: string) =>
  atom(async get => {
    const status = await get(swapSdkAtom).getStatus({ id })

    if (!(['FAILED', 'COMPLETE', 'BROADCAST_ABORTED'] as const).includes(status.state as any)) {
      get(swapStatusRequestCounterAtom)
    }

    const assets = await get(assetsAtom)
    const asset = assets.find(x => x.asset === status.srcAsset)

    if (asset === undefined) {
      throw new Error(`Can't find asset: ${status.srcAsset}`)
    }

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
          : Decimal.fromPlanck(status.depositAmount, asset.decimals, asset.symbol),
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

const swapPromiseAtom = atom<Promise<void>>(Promise.resolve())

const swapPromiseLoadableAtom = loadable(swapPromiseAtom)

const quoteLoadableAtom = loadable(quoteAtom)

const destAmountAtom = atom(async get => {
  const [quote, asset] = await Promise.all([get(quoteAtom), get(destAssetAtom)])

  return Decimal.fromPlanck(quote.quote.egressAmount, asset.decimals, asset.symbol)
})

const destAmountLoadableAtom = loadable(destAmountAtom)

const srcEvmChain = atom(async get => {
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

const viemPublicClientAtomFamily = atomFamily((evmChainId: number) =>
  atom(async () => {
    return createPublicClient({
      chain: EVM_CHAINS.find(chain => chain.id === evmChainId),
      transport: http(),
    })
  })
)

const viemWalletClientAtom = atomWithDefault<WalletClient>(() => {
  throw new Error('No Viem wallet client available')
})

const polkadotApiAtom = atom(async get => await ApiPromise.create({ provider: new WsProvider(get(polkadotRpcAtom)) }))

const polkadotSignerAtom = atomWithDefault<Signer>(() => {
  throw new Error('No Polkadot signer available')
})

const coingeckoApiEndpointAtom = atom('https://api.coingecko.com')

const coingeckoApiKeyAtom = atom<string | undefined>(undefined)

const coingeckoApiTierAtom = atom<'pro' | 'demo'>('demo')

const currencyAtom = atom('usd')

const assetFiatPriceAtomFamily = atomFamily((asset: Asset) =>
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

const assetAvailableAmountAtomFamily = atomFamily(
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

      switch (assetData.chain) {
        case 'Ethereum': {
          if (chainData.evmChainId === undefined) {
            throw new Error('Invalid EVM chain')
          }

          if (!isAddress(address)) {
            throw new Error('Invalid EVM address')
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

          return Decimal.fromPlanck(balance, assetData.decimals, assetData.symbol)
        }
        case 'Polkadot': {
          const api = await get(polkadotApiAtom)

          const balances = await api.derive.balances.all(address)

          return Decimal.fromPlanck(
            BigIntMath.max(
              0n,
              balances.availableBalance.toBigInt() - api.consts.balances.existentialDeposit.toBigInt()
            ),
            assetData.decimals,
            assetData.symbol
          )
        }
        default:
          throw new Error(`Unsupported asset chain: ${assetData.chain}`)
      }
    }),
  (a, b) => a.address === b.address && a.asset === b.asset
)

assetAvailableAmountAtomFamily.setShouldRemove(createdAt => new Date().getTime() - createdAt > 6000)

const srcAssetAvailableAmountAtom = atomWithRefresh(async get => {
  const account = get(srcAccountAtom)

  if (account === undefined) {
    return
  }

  get(srcAssetAvailableAmountAtomEffect)

  return await get(assetAvailableAmountAtomFamily({ address: account.address, asset: (await get(srcAssetAtom)).asset }))
})

type AssetAmountProps = {
  account: Account
  asset: Asset
}

const AssetAmount = (props: AssetAmountProps) => (
  <>
    {useAtomValue(
      assetAvailableAmountAtomFamily({ address: props.account.address, asset: props.asset })
    )?.toLocaleString()}
  </>
)

type AssetFiatAmountProps = {
  account: Account
  asset: Asset
}

const AssetFiatAmount = (props: AssetFiatAmountProps) => {
  const currency = useAtomValue(currencyAtom)
  const price = useAtomValue(assetFiatPriceAtomFamily(props.asset))
  const amount = useAtomValue(assetAvailableAmountAtomFamily({ address: props.account.address, asset: props.asset }))

  return (price * amount.toNumber()).toLocaleString(undefined, { style: 'currency', currency })
}

type AssetSelectProps = {
  for: 'src' | 'dest'
}

const AssetSelect = (props: AssetSelectProps) => {
  const [open, setOpen] = useState(false)

  const account = useAtomValue(props.for === 'src' ? srcAccountAtom : destAccountAtom)
  const asset = useAtomValue(props.for === 'src' ? srcAssetAtom : destAssetAtom)
  const chains = useAtomValue(props.for === 'src' ? srcChainsAtom : destChainsAtom)
  const assets = useAtomValue(props.for === 'src' ? srcAssetsAtom : destAssetsAtom)

  const chainItems = useMemo(
    () => chains.map(chain => ({ id: chain.chain, name: chain.name, iconSrc: chainIcons[chain.chain] })),
    [chains]
  )
  const assetItems = useMemo(
    () =>
      assets.map(asset => ({
        id: asset.asset,
        name: asset.name,
        code: asset.symbol,
        iconSrc: assetIcons[asset.asset],
        chain: asset.chain,
        chainId: asset.chain,
        amount: account === undefined ? undefined : <AssetAmount account={account} asset={asset.asset} />,
        fiatAmount: account === undefined ? undefined : <AssetFiatAmount account={account} asset={asset.asset} />,
      })),
    [account, assets]
  )

  const setChainAndAsset = useAtomCallback(
    useCallback(
      async (_, set, chain: Chain, asset: Asset) => {
        const assetToSet = assets.find(x => x.chain === chain && x.asset === asset)

        if (assetToSet === undefined) {
          throw new Error(`Can't find asset ${asset} on chain ${chain}`)
        }

        if (props.for === 'src') {
          set(srcAssetAtom, assetToSet)
        } else {
          set(destAssetAtom, assetToSet)
        }
      },
      [assets, props.for]
    )
  )

  return (
    <>
      <SwapForm.TokenSelect
        name={asset.asset}
        chain={asset.chain}
        iconSrc={assetIcons[asset.asset]}
        onClick={() => setOpen(true)}
      />
      {open && (
        <TokenSelectDialog
          chains={chainItems}
          tokens={assetItems}
          onRequestDismiss={() => setOpen(false)}
          onSelectToken={token => {
            void setChainAndAsset(token.chainId as Chain, token.id as Asset)
          }}
        />
      )}
    </>
  )
}

type ActivityProps = {
  id: string
}

const Activity = (props: ActivityProps) => {
  const status = useAtomValue(swapStatusAtomFamily(props.id))

  return (
    <SwapForm.Info.Activities.Item
      state={status.state}
      amount={status.amount?.toLocaleString() ?? '...'}
      date={status.date ?? new Date()}
      externalLink={status.externalLink}
    />
  )
}

const Activities = () => {
  const swaps = useAtomValue(swapsAtom)

  return (
    <SwapForm.Info.Activities
      title={
        <span>
          View recent and pending swaps for the{' '}
          <Tooltip content="Up to 50 swaps">
            <span css={{ textDecoration: 'underline' }}>past week</span>.
          </Tooltip>
        </span>
      }
    >
      {swaps.map(swap => (
        <ErrorBoundary key={swap.id} fallback={<Text.Body as="div">Failed to fetch swap</Text.Body>}>
          <Suspense fallback={<SwapForm.Info.Activities.Item.Skeleton />}>
            <Activity id={swap.id} />
          </Suspense>
        </ErrorBoundary>
      ))}
    </SwapForm.Info.Activities>
  )
}

const Quote = () => {
  const quote = useAtomValue(quoteAtom)
  const srcAmount = useAtomValue(srcAmountAtom)
  const destAmount = useAtomValue(destAmountAtom)

  if (srcAmount === undefined || destAmount === undefined) {
    throw new Error("Can't have quote without src & dest amount")
  }

  const srcQuote = useMemo(() => srcAmount.mapNumber(() => 1), [srcAmount])
  const destQuote = useMemo(
    () => destAmount.mapNumber(() => destAmount.toNumber() / srcAmount.toNumber()),
    [destAmount, srcAmount]
  )

  return (
    <SwapForm.Info.Summary.DescriptionList>
      <SwapForm.Info.Summary.DescriptionList.Description
        term="Est. swap fees"
        details={
          <Tooltip
            content={quote.quote.includedFees.map((fee, index) => (
              <div key={index}>
                <Text.Body alpha="high" css={{ textTransform: 'capitalize' }}>
                  {fee.type.toLocaleLowerCase()}
                </Text.Body>
                : {fee.amount.toLocaleString()}
              </div>
            ))}
          >
            <span>
              {quote.quote.totalFee.amount.toLocaleString(undefined, {
                style: 'currency',
                currency: quote.quote.totalFee.currency,
              })}
            </span>
          </Tooltip>
        }
      />
      <SwapForm.Info.Summary.DescriptionList.Description
        term="Est. rate"
        details={
          <span>
            {srcQuote.toLocaleString()} = {destQuote.toLocaleString()}
          </span>
        }
      />
    </SwapForm.Info.Summary.DescriptionList>
  )
}

const Info = () => {
  const quoteLoadable = useAtomValue(quoteLoadableAtom)

  const route = useMemo(
    () =>
      quoteLoadable.state !== 'hasData'
        ? []
        : [
            { iconSrc: assetIcons[quoteLoadable.data.srcAsset] },
            { iconSrc: assetIcons.USDC },
            { iconSrc: assetIcons[quoteLoadable.data.destAsset] },
          ],
    // @ts-expect-error
    [quoteLoadable.data?.destAsset, quoteLoadable.data?.srcAsset, quoteLoadable.state]
  )

  return (
    <SwapForm.Info
      summary={
        quoteLoadable.state === 'loading' ? (
          <SwapForm.Info.Summary.ProgressIndicator />
        ) : quoteLoadable.state === 'hasError' && quoteLoadable.error instanceof InputError ? undefined : (
          <ErrorBoundary
            fallbackRender={({ error }) => {
              const errorMessage: string = error.name === 'AxiosError' ? error.response.data.message : error.message

              const message = errorMessage.includes('InsufficientLiquidity')
                ? 'There are not enough liquidity to complete the swap. Please try again with a lower amount'
                : errorMessage

              return <SwapForm.Info.Summary.ErrorMessage title="Unable to obtain quote" text={message} />
            }}
          >
            <SwapForm.Info.Summary route={route} descriptions={<Quote />} />
          </ErrorBoundary>
        )
      }
      activities={<Activities />}
      faq={
        <SwapForm.Info.Faq>
          <SwapForm.Info.Faq.Question question="How does the swap works?" answer="foo" />
          <SwapForm.Info.Faq.Question question="What is included in the fees?" answer="foo" />
          <SwapForm.Info.Faq.Question question="What are the risks?" answer="foo" />
        </SwapForm.Info.Faq>
      }
      footer={
        <SwapForm.Info.Footer>
          Swap provided by{' '}
          <Chip
            containerColor="linear-gradient(90deg, rgba(255, 73, 162, 0.10) 0%, rgba(70, 221, 147, 0.10) 100%)"
            css={{ textTransform: 'uppercase' }}
          >
            <img src="https://chainflip.io/images/home/logo-white.svg" css={{ height: '1em' }} />
          </Chip>
        </SwapForm.Info.Footer>
      }
    />
  )
}

const SrcAccountSelect = () => {
  const accounts = useAtomValue(accountsAtom)
  const [account, setAccount] = useAtom(srcAccountAtom)

  return (
    <Select
      placeholder="Please select an account"
      value={account}
      onChangeValue={account => setAccount(account)}
      css={{ width: '100%' }}
    >
      {accounts.map((account, index) => (
        <Select.Option
          key={index}
          value={account}
          leadingIcon={<Identicon value={account.address} size="4rem" />}
          headlineContent={account.name ?? shortenAddress(account.address)}
        />
      ))}
    </Select>
  )
}

const DestAccountSelect = () => {
  const accounts = useAtomValue(destAccountsAtom)
  const [account, setAccount] = useAtom(destAccountAtom)

  return (
    <Select
      placeholder="Please select an account"
      value={account}
      onChangeValue={account => setAccount(account)}
      css={{ width: '100%' }}
    >
      {accounts.map((account, index) => (
        <Select.Option
          key={index}
          value={account}
          leadingIcon={<Identicon value={account.address} size="4rem" />}
          headlineContent={account.name ?? shortenAddress(account.address)}
        />
      ))}
    </Select>
  )
}

const AvailableAmount = () => useAtomValue(srcAssetAvailableAmountAtom)?.toLocaleString()

const inputErrorAtom = atom(async get => {
  const [amount, availableAmount] = await Promise.all([get(srcAmountAtom), get(srcAssetAvailableAmountAtom)])

  if (amount !== undefined && availableAmount !== undefined && amount.planck > availableAmount.planck) {
    return 'Insufficient balance'
  }

  try {
    await get(quoteAtom)
  } catch (error) {
    if (error instanceof InputError) {
      return error.message
    }
  }

  return undefined
})

const inputErrorLoadableAtom = loadable(inputErrorAtom)

const _Swap = () => {
  const [amount, setAmount] = useState('')
  const deferredAmount = useDeferredValue(amount)

  const setAtomAmount = useSetAtom(srcAmountInputAtom)
  useEffect(() => {
    startTransition(() => setAtomAmount(deferredAmount))
  }, [deferredAmount, setAtomAmount])

  const destAmountLoadable = useAtomValue(destAmountLoadableAtom)
  const inputErrorLoadable = useAtomValue(inputErrorLoadableAtom)
  const quoteLoadable = useAtomValue(quoteLoadableAtom)

  const inputError =
    deferredAmount.trim() !== '' && inputErrorLoadable.state === 'hasData' ? inputErrorLoadable.data : undefined

  const swap = useAtomCallback(
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
          const signer = get(polkadotSignerAtom)

          await api.tx.balances
            .transferKeepAlive(depositAddress.depositAddress, depositAddress.amount)
            .signAndSend(srcAccount.address, { signer })

          break
        }
        default:
          throw new Error(`Unsupported swap from chain ${srcAsset.chain}`)
      }

      set(swapsAtom, ids => [...ids, { id: depositAddress.depositChannelId, date: new Date() }])
    }, [])
  )

  return (
    <SwapForm
      accountSelect={<SrcAccountSelect />}
      tokenSelect={<AssetSelect for="src" />}
      amount={amount}
      availableAmount={<AvailableAmount />}
      amountError={inputError}
      onChangeAmount={setAmount}
      destTokenSelect={<AssetSelect for="dest" />}
      destAmount={destAmountLoadable.state === 'hasData' ? destAmountLoadable.data?.toString() ?? '' : ''}
      destAccountSelect={
        // TODO: this is to prevent suspense of entire component when dest accounts change
        // better to use transition
        <Suspense
          fallback={
            <Select
              css={{ width: '100%' }}
              renderSelected={() => (
                <Select.Option
                  leadingIcon={<CircularProgressIndicator size="4rem" />}
                  headlineContent="..."
                  supportingContent={`\u200B`}
                />
              )}
            />
          }
        >
          <DestAccountSelect />
        </Suspense>
      }
      onRequestMaxAmount={useAtomCallback(
        useCallback(async get => {
          const amount = await get(srcAssetAvailableAmountAtom)

          if (amount !== undefined) {
            setAmount(amount.toString())
          }
        }, [])
      )}
      onRequestReverse={useAtomCallback(
        useCallback(async (get, set) => {
          const [srcAccounts, srcAsset, destAsset] = await Promise.all([
            get(srcAccountsAtom),
            get(_srcAssetAtom),
            get(destAssetAtom),
          ])

          // TODO: remove this time bomb
          set(
            _srcAccountAtom,
            srcAccounts.find(account => (destAsset.chain === 'Ethereum' ? account.type === 'evm' : 'substrate'))
          )

          set(srcAssetAtom, destAsset)
          set(destAssetAtom, srcAsset)
        }, [])
      )}
      info={<Info />}
      onRequestSwap={useAtomCallback(
        useCallback(
          async (_, set) => {
            const promise = swap()

            void toast.promise(promise, {
              loading: 'Requesting swap',
              success: 'Swap executed',
              error: 'Failed to execute swap',
            })

            set(swapPromiseAtom, promise)

            await promise
          },
          [swap]
        )
      )}
      canSwap={
        quoteLoadable.state === 'hasData' &&
        inputErrorLoadable.state === 'hasData' &&
        inputErrorLoadable.data === undefined
      }
      swapInProgress={useAtomValue(swapPromiseLoadableAtom).state === 'loading'}
    />
  )
}

type HydrateSwapProps = PropsWithChildren<{
  accounts: Account[]
  currency: string
  viemWalletClient?: WalletClient
  polkadotSigner?: Signer
  coingeckoApiEndpoint?: string
  coingeckoApiTier?: string
  coingeckoApiKey?: string
  useTestnet?: boolean
}>

const HydrateSwap = (props: HydrateSwapProps) => {
  const stableAccounts = useMemo(
    () => props.accounts,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(props.accounts)]
  )

  useHydrateAtoms(
    new Map(
      [
        [accountsAtom, stableAccounts],
        [currencyAtom, props.currency],
        [viemWalletClientAtom, props.viemWalletClient],
        [polkadotSignerAtom, props.polkadotSigner],
        [coingeckoApiEndpointAtom, props.coingeckoApiEndpoint],
        [coingeckoApiTierAtom, props.coingeckoApiTier],
        [coingeckoApiKeyAtom, props.coingeckoApiKey],
        [chainflipNetworkAtom, props.useTestnet ? 'perseverance' : 'mainnet'],
      ].filter(([_, value]) => value !== undefined) as Array<[any, any]>
    ),
    { dangerouslyForceHydrate: true }
  )

  return props.children
}

export type SwapProps = HydrateSwapProps

const Swap = (props: SwapProps) => {
  return (
    <Provider>
      <Suspense fallback={<TalismanHandProgressIndicator />}>
        <HydrateSwap {...props}>
          <_Swap />
        </HydrateSwap>
      </Suspense>
    </Provider>
  )
}

export default Swap
