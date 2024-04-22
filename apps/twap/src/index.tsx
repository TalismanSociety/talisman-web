import { SwapSDK, type Asset, type AssetData, type Chain } from '@chainflip/sdk/swap'
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
  ToastMessage,
  Tooltip,
  toast,
} from '@talismn/ui'
import { ErrorMessage, SwapForm, TokenSelectDialog } from '@talismn/ui-recipes'
import '@talismn/ui/assets/css/talismn.css'
import { Provider, atom, useAtom, useAtomValue, useSetAtom, type Atom } from 'jotai'
import { atomEffect } from 'jotai-effect'
import {
  RESET,
  atomFamily,
  atomWithDefault,
  atomWithRefresh,
  atomWithStorage,
  createJSONStorage,
  loadable,
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
import { createPublicClient, http, type WalletClient } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { erc20Abi } from './abi'
import { assetCoingeckoIds, assetIcons, chainIcons } from './config'
import { shortenAddress, sleep } from './utils'

const EVM_CHAINS = [mainnet, sepolia]

const POLKADOT_RPC = 'wss://rpc-pdot.chainflip.io'

const ENABLED_CHAINS: Chain[] = ['Ethereum', 'Polkadot']

type Account = { name?: string; readonly?: boolean } & (
  | {
      type: 'evm'
      address: `0x${string}`
    }
  | { type: 'substrate'; address: string }
)

class InputError extends Error {}

const swapSdk = new SwapSDK({
  network: 'perseverance',
})

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

const chainsAtoms = atom(async () => await swapSdk.getChains())

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

const assetsAtom = atom(async () => await swapSdk.getAssets())

const srcAssetsAtom = atom(async get => {
  const srcChains = await get(srcChainsAtom)

  const assets = await Promise.all(srcChains.map(async chain => await swapSdk.getAssets(chain.chain)))

  return Array.from(
    assets
      .flat()
      .reduce((prev, curr) => prev.set(curr.asset, curr), new Map<Asset, AssetData>())
      .values()
  )
})

const destChainsAtom = atom(async get =>
  (await swapSdk.getChains((await get(srcAssetAtom)).chain)).filter(chain => ENABLED_CHAINS.includes(chain.chain))
)

const destAssetsAtom = atom(async get => {
  const destChains = await get(destChainsAtom)

  const assets = await Promise.all(destChains.map(async chain => await swapSdk.getAssets(chain.chain)))

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
    throw new InputError(`Minimum swap of ${srcAsset.minimumSwapAmount.toLocaleString()} required`)
  }

  if (srcAsset.maximumSwapAmount !== undefined && amount.planck > srcAsset.maximumSwapAmount.planck) {
    throw new InputError(`Maximum of ${srcAsset.maximumSwapAmount.toLocaleString()} possible`)
  }

  const assets = await get(assetsAtom)

  const quote = await swapSdk.getQuote({
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

const inProgressSwapIdsAtom = atomWithStorage<string[]>(
  '@talisman/swap/chainflip-swap-ids',
  [],
  createJSONStorage(() => globalThis.sessionStorage)
)

const swapPromiseAtom = atom<Promise<void>>(Promise.resolve())

const swapPromiseLoadableAtom = loadable(swapPromiseAtom)

const swapStatusAtomEffect = atomEffect((get, set) => {
  const ids = get(inProgressSwapIdsAtom)
  const abortController = new AbortController()

  const cleanupToast = () => ids.forEach(id => toast.remove(id))

  const effect = async (id: string) => {
    while (true) {
      if (abortController.signal.aborted) {
        cleanupToast()
        break
      }

      const status = await swapSdk.getStatus({ id }, { signal: abortController.signal })

      const progress = (() => {
        switch (status.state) {
          case 'AWAITING_DEPOSIT':
            return { state: 'pending', message: 'Depositing funds' } as const
          case 'DEPOSIT_RECEIVED':
            return { state: 'pending', message: 'Executing swap' } as const
          case 'SWAP_EXECUTED':
          case 'EGRESS_SCHEDULED':
          case 'BROADCAST_REQUESTED':
          case 'BROADCASTED':
            return { state: 'pending', message: 'Sending funds' } as const
          case 'COMPLETE':
            return { state: 'fulfilled', message: 'Swapping complete' } as const
          case 'BROADCAST_ABORTED':
          case 'FAILED':
            return { state: 'rejected', message: 'Failed to swap' } as const
        }
      })()

      switch (progress.state) {
        case 'pending':
          toast.loading(
            <ToastMessage
              headlineContent={progress.message}
              supportingContent="Please be patience, cross-chain swap could take up to several minutes"
            />,
            { id }
          )
          break
        case 'fulfilled':
          toast.success(progress.message, { id })
          break
        case 'rejected':
          toast.error(progress.message, { id })
      }

      if (progress.state === 'fulfilled' || progress.state === 'rejected') {
        set(inProgressSwapIdsAtom, ids => ids.filter(x => x !== id))
        break
      }

      await sleep(5000)
    }
  }

  for (const id of ids) {
    void effect(id)
  }

  return () => {
    cleanupToast()
    abortController.abort()
  }
})

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

const viemPublicClientAtom = atom(async get => {
  return createPublicClient({
    chain: await get(srcEvmChain),
    transport: http(),
  })
})

const viemWalletClientAtom = atomWithDefault<WalletClient>(() => {
  throw new Error('No Viem wallet client available')
})

const polkadotApiAtom = atom(async () => await ApiPromise.create({ provider: new WsProvider(POLKADOT_RPC) }))

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

const srcAssetAvailableAmountAtom = atomWithRefresh(async get => {
  const srcAccount = get(srcAccountAtom)

  if (srcAccount === undefined) {
    return undefined
  }

  const srcAsset = await get(srcAssetAtom)

  get(srcAssetAvailableAmountAtomEffect)

  switch (srcAccount.type) {
    case 'evm': {
      const client = await get(viemPublicClientAtom)

      const balance =
        srcAsset.contractAddress === undefined
          ? await client.getBalance({ address: srcAccount.address })
          : await client.readContract({
              abi: erc20Abi,
              address: srcAsset.contractAddress as `0x${string}`,
              functionName: 'balanceOf',
              args: [srcAccount.address],
            })

      return Decimal.fromPlanck(balance, srcAsset.decimals, srcAsset.symbol)
    }
    case 'substrate': {
      const api = await get(polkadotApiAtom)

      const balances = await api.derive.balances.all(srcAccount.address)

      return Decimal.fromPlanck(
        BigIntMath.max(0n, balances.availableBalance.toBigInt() - api.consts.balances.existentialDeposit.toBigInt()),
        srcAsset.decimals,
        srcAsset.symbol
      )
    }
  }
})

type AssetSelectProps = {
  for: 'src' | 'dest'
}

const AssetSelect = (props: AssetSelectProps) => {
  const [open, setOpen] = useState(false)
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
        amount: '',
        fiatAmount: '',
      })),
    [assets]
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
    <SwapForm.Summary.DescriptionList>
      <SwapForm.Summary.DescriptionList.Description
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
      <SwapForm.Summary.DescriptionList.Description
        term="Est. rate"
        details={
          <span>
            {srcQuote.toLocaleString()} = {destQuote.toLocaleString()}
          </span>
        }
      />
    </SwapForm.Summary.DescriptionList>
  )
}

const Summary = () => {
  const quoteLoadable = useAtomValue(quoteLoadableAtom)

  return (
    <SwapForm.Summary
      route={useMemo(
        () =>
          quoteLoadable.state !== 'hasData'
            ? undefined
            : [
                { iconSrc: assetIcons[quoteLoadable.data.srcAsset] },
                { iconSrc: assetIcons.USDC },
                { iconSrc: assetIcons[quoteLoadable.data.destAsset] },
              ],
        [quoteLoadable]
      )}
      descriptions={
        quoteLoadable.state === 'loading' ? (
          <div css={{ display: 'flex', justifyContent: 'center' }}>
            <TalismanHandProgressIndicator />
          </div>
        ) : quoteLoadable.state === 'hasError' && quoteLoadable.error instanceof InputError ? undefined : (
          <ErrorBoundary
            fallbackRender={({ error }) => {
              const errorMessage: string = error.name === 'AxiosError' ? error.response.data.message : error.message

              const message = errorMessage.includes('InsufficientLiquidity')
                ? 'There are not enough liquidity to complete the swap. Please try again with a lower amount'
                : errorMessage

              return <ErrorMessage title="Unable to obtain quote" message={message} />
            }}
          >
            <Quote />
          </ErrorBoundary>
        )
      }
      faq={
        <SwapForm.Summary.Faq>
          <SwapForm.Summary.Faq.Question question="How does the swap works?" answer="foo" />
          <SwapForm.Summary.Faq.Question question="What is included in the fees?" answer="foo" />
          <SwapForm.Summary.Faq.Question question="What are the risks?" answer="foo" />
        </SwapForm.Summary.Faq>
      }
      footer={
        <SwapForm.Summary.Footer>
          Swap provided by{' '}
          <Chip
            containerColor="linear-gradient(90deg, rgba(255, 73, 162, 0.10) 0%, rgba(70, 221, 147, 0.10) 100%)"
            css={{ textTransform: 'uppercase' }}
          >
            <img src="https://chainflip.io/images/home/logo-white.svg" css={{ height: '1em' }} />
          </Chip>
        </SwapForm.Summary.Footer>
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
          leadingIcon={<Identicon value={account.address} />}
          headlineContent={account.name ?? shortenAddress(account.address)}
          supportingContent={account.name !== undefined && shortenAddress(account.address)}
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
          leadingIcon={<Identicon value={account.address} />}
          headlineContent={account.name ?? shortenAddress(account.address)}
          supportingContent={account.name !== undefined && shortenAddress(account.address)}
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
    setAtomAmount(deferredAmount)
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

      const depositAddress = await swapSdk.requestDepositAddress({
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

      set(inProgressSwapIdsAtom, ids => [...ids, depositAddress.depositChannelId])
    }, [])
  )

  useAtom(swapStatusAtomEffect)

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
                  leadingIcon={<CircularProgressIndicator />}
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
      summary={<Summary />}
      onRequestSwap={useAtomCallback(
        useCallback(
          async (_, set) => {
            const promise = swap()

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
  viemWalletClient?: WalletClient
  polkadotSigner?: Signer
  coingeckoApiEndpoint?: string
  coingeckoApiTier?: string
  coingeckoApiKey?: string
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
        [viemWalletClientAtom, props.viemWalletClient],
        [polkadotSignerAtom, props.polkadotSigner],
        [coingeckoApiEndpointAtom, props.coingeckoApiEndpoint],
        [coingeckoApiTierAtom, props.coingeckoApiTier],
        [coingeckoApiKeyAtom, props.coingeckoApiKey],
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

// const Root = () => (
//   <React.StrictMode>
//     <ThemeProvider theme={theme.greenDark}>
//       <Swap
//         accounts={[
//           { type: 'evm', address: '0x5C9EBa3b10E45BF6db77267B40B95F3f91Fc5f67', name: 'EVM 1' },
//           {
//             type: 'substrate',
//             address: '5GsJWiLXwy6yPS9Q8gLo27hmjjqV2DxuMbgif6CttN5j72Ls',
//             name: 'Polkadot account 1',
//           },
//           {
//             type: 'substrate',
//             address: '5CLwQ5xmYfBshb9cwndyybRwbc673Rhh4f6s3i3qXbfDebXJ',
//             name: 'Polkadot account 2',
//           },
//           { type: 'substrate', address: '5EfK2DKRJKU2heXXnmZU6BTSqk3kFoeAJ3ZkqpyWFsSEBGPA', readonly: true },
//         ]}
//       />
//     </ThemeProvider>
//   </React.StrictMode>
// )

// const container = document.getElementById('root')
// // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
// const root = createRoot(container!)

// root.render(<Root />)
