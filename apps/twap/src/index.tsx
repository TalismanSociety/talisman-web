import { SwapSDK, type Asset, type AssetData, type Chain } from '@chainflip/sdk/swap'
import { Decimal } from '@talismn/math'
import { Chip, Identicon, Select, TalismanHandProgressIndicator, ThemeProvider, theme } from '@talismn/ui'
import { ErrorMessage, SwapForm, TokenSelectDialog } from '@talismn/ui-recipes'
import '@talismn/ui/assets/css/talismn.css'
import { ArrowRight, TalismanHand } from '@talismn/web-icons'
import { Provider, atom, useAtom, useAtomValue, useSetAtom, type Atom } from 'jotai'
import { atomEffect } from 'jotai-effect'
import { RESET, atomWithDefault, atomWithRefresh, loadable, useAtomCallback, useHydrateAtoms } from 'jotai/utils'
import React, {
  Suspense,
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type PropsWithChildren,
} from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { shortenAddress } from './utils'

const ENABLED_CHAINS: Chain[] = ['Ethereum', 'Polkadot']

type Account = {
  type: 'evm' | 'substrate'
  address: string
  name?: string
  readonly?: boolean
}

class InputError extends Error {}

const swapSdk = new SwapSDK({
  network: 'mainnet',
})

const accountsAtom = atom<Account[]>([])

const _srcAccountAtom = atomWithDefault(get => get(accountsAtom).at(0))

const srcAccountAtom = atom(
  get => {
    const account = get(_srcAccountAtom)

    return get(accountsAtom).find(x => x === account)
  },
  (_, set, account: Account) => set(_srcAccountAtom, () => account)
)

const srcChainsAtom = atom(async get => {
  const chains = await swapSdk.getChains()

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
  void get(srcAssetsAtom).then(() => startTransition(() => set(_srcAssetAtom, RESET)))
})

const srcAssetAtom = atom(
  async get => {
    get(srcAssetAtomEffect)
    return await get(_srcAssetAtom)
  },
  (_, set, asset: AssetData) => set(_srcAssetAtom, async () => asset)
)

const _destAssetAtom = atomWithDefault(async get => {
  const assets = await get(destAssetsAtom)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return assets.at(0)!
})

const destAssetAtomEffect = atomEffect((get, set) => {
  void get(destAssetsAtom).then(() => startTransition(() => set(_destAssetAtom, RESET)))
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
  void get(destAccountsAtom).then(() => startTransition(() => set(_destAccountAtom, RESET)))
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

const destAddressAtom = atom<string | undefined>(undefined)

const swapLimitsAtom = atom(async get => {
  const limits = await swapSdk.getSwapLimits()

  const srcAsset = await get(srcAssetAtom)

  const chainMinimum = limits.minimumSwapAmounts[srcAsset.chain]
  const minimum: bigint = chainMinimum[srcAsset.asset as keyof typeof chainMinimum]

  const chainMaximum = limits.maximumSwapAmounts[srcAsset.chain]
  const maximum: bigint | null = chainMaximum[srcAsset.asset as keyof typeof chainMaximum]

  return {
    minimum: Decimal.fromPlanck(minimum, srcAsset.decimals, srcAsset.symbol),
    maximum: maximum === null ? undefined : Decimal.fromPlanck(maximum, srcAsset.decimals, srcAsset.symbol),
  }
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
  const amount = await get(srcAmountAtom)
  const limit = await get(swapLimitsAtom)

  if (amount === undefined) {
    throw new InputError('No amount specified')
  }

  if (amount.planck < limit.minimum.planck) {
    throw new InputError(`Minimum swap of ${limit.minimum.toLocaleString()} required`)
  }

  if (limit.maximum !== undefined && amount.planck > limit.maximum.planck) {
    throw new InputError(`Maximum of ${limit.maximum.toLocaleString()} possible`)
  }

  const [srcAsset, destAsset] = await Promise.all([get(srcAssetAtom), get(destAssetAtom)])

  const quote = await swapSdk.getQuote({
    srcChain: srcAsset.chain,
    destChain: destAsset.chain,
    srcAsset: srcAsset.asset,
    destAsset: destAsset.asset,
    amount: amount.planck.toString(),
  })

  get(quoteAtomEffect)

  const assets = await get(assetsAtom)

  return {
    ...quote,
    quote: {
      ...quote.quote,
      includedFees: quote.quote.includedFees.map(fee => {
        const asset = assets.find(x => x.asset === fee.asset)

        if (asset === undefined) {
          throw new Error('No matching asset found')
        }

        return { type: fee.type, amount: Decimal.fromPlanck(fee.amount, asset.decimals, asset.symbol) }
      }),
    },
  }
})

const quoteLoadableAtom = loadable(quoteAtom)

const destAmountAtom = atom(async get => {
  const quote = await get(quoteAtom)
  const asset = await get(destAssetAtom)

  return Decimal.fromPlanck(quote.quote.egressAmount, asset.decimals, asset.symbol)
})

const destAmountLoadableAtom = loadable(destAmountAtom)

const depositAddressAtom = atom(async get => {
  const amount = await get(srcAmountAtom)
  const destAddress = get(destAddressAtom)

  if (amount === undefined || destAddress === undefined) {
    return undefined
  }

  const [srcAsset, destAsset] = await Promise.all([get(srcAssetAtom), get(destAssetAtom)])

  return await swapSdk.requestDepositAddress({
    srcChain: srcAsset.chain,
    destChain: destAsset.chain,
    srcAsset: srcAsset.asset,
    destAsset: destAsset.asset,
    amount: amount.planck.toString(),
    destAddress,
  })
})

type AssetSelectProps = {
  for: 'src' | 'dest'
}

const AssetSelect = (props: AssetSelectProps) => {
  const [open, setOpen] = useState(false)
  const asset = useAtomValue(props.for === 'src' ? srcAssetAtom : destAssetAtom)
  const chains = useAtomValue(props.for === 'src' ? srcChainsAtom : destChainsAtom)
  const assets = useAtomValue(props.for === 'src' ? srcAssetsAtom : destAssetsAtom)

  const chainItems = useMemo(() => chains.map(chain => ({ id: chain.chain, name: chain.name, iconSrc: '' })), [chains])
  const assetItems = useMemo(
    () =>
      assets.map(asset => ({
        id: asset.asset,
        name: asset.name,
        code: asset.symbol,
        iconSrc: `https://resources.acala.network/tokens/${asset.asset}.png`,
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
        iconSrc={`https://resources.acala.network/tokens/${asset.asset}.png`}
        onClick={() => setOpen(true)}
      />
      {open && (
        <TokenSelectDialog
          chains={chainItems}
          tokens={assetItems}
          onRequestDismiss={() => setOpen(false)}
          onSelectToken={async token => await setChainAndAsset(token.chainId as Chain, token.id as Asset)}
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
        term="Route"
        details={
          <span>
            <TalismanHand size="1em" /> <ArrowRight size="1em" /> <TalismanHand size="1em" /> <ArrowRight size="1em" />{' '}
            <TalismanHand size="1em" />
          </span>
        }
      />
      {quote.quote.includedFees.map((fee, index) => (
        <SwapForm.Summary.DescriptionList.Description
          key={index}
          term={`Est. ${fee.type.toLocaleLowerCase()} fee`}
          details={fee.amount.toLocaleString()}
        />
      ))}
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
  const [_, startTransition] = useTransition()

  const accounts = useAtomValue(accountsAtom)
  const [account, setAccount] = useAtom(srcAccountAtom)

  return (
    <Select
      value={account}
      onChangeValue={account => startTransition(() => setAccount(account))}
      css={{ width: '100%' }}
    >
      {accounts
        .filter(account => !account.readonly)
        .map((account, index) => (
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
  const [_, startTransition] = useTransition()

  const accounts = useAtomValue(destAccountsAtom)
  const [account, setAccount] = useAtom(destAccountAtom)

  return (
    <Select
      value={account}
      onChangeValue={account => startTransition(() => setAccount(account))}
      css={{ width: '100%' }}
    >
      {accounts
        .filter(account => !account.readonly)
        .map((account, index) => (
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

const _Swap = () => {
  const [amount, setAmount] = useState('')
  const deferredAmount = useDeferredValue(amount)

  const setAtomAmount = useSetAtom(srcAmountInputAtom)
  useEffect(() => {
    startTransition(() => setAtomAmount(deferredAmount))
  }, [deferredAmount, setAtomAmount])

  const quoteLoadable = useAtomValue(quoteLoadableAtom)
  const destAmountLoadable = useAtomValue(destAmountLoadableAtom)

  const inputError =
    deferredAmount.trim() !== '' && quoteLoadable.state === 'hasError' && quoteLoadable.error instanceof InputError
      ? quoteLoadable.error.message
      : undefined

  return (
    <SwapForm
      accountSelect={<SrcAccountSelect />}
      tokenSelect={<AssetSelect for="src" />}
      amount={amount}
      availableAmount="1 DOT"
      amountError={inputError}
      onChangeAmount={setAmount}
      destTokenSelect={<AssetSelect for="dest" />}
      destAmount={destAmountLoadable.state === 'hasData' ? destAmountLoadable.data?.toString() ?? '' : ''}
      destAccountSelect={<DestAccountSelect />}
      onRequestMaxAmount={() => {}}
      onChangeDestAmount={() => {}}
      onRequestReverse={() => {}}
      summary={<Summary />}
    />
  )
}

type HydrateSwapProps = PropsWithChildren<{
  accounts: Account[]
}>

const HydrateSwap = (props: HydrateSwapProps) => {
  useHydrateAtoms([[accountsAtom, props.accounts]])
  return props.children
}

export type SwapProps = {
  accounts: Account[]
}

const Swap = (props: SwapProps) => {
  return (
    <Provider>
      <Suspense>
        <HydrateSwap accounts={props.accounts}>
          <_Swap />
        </HydrateSwap>
      </Suspense>
    </Provider>
  )
}

const Root = () => (
  <React.StrictMode>
    <ThemeProvider theme={theme.greenDark}>
      <Swap
        accounts={[
          { type: 'evm', address: '0x5C9EBa3b10E45BF6db77267B40B95F3f91Fc5f67', name: 'EVM 1' },
          {
            type: 'substrate',
            address: '5GsJWiLXwy6yPS9Q8gLo27hmjjqV2DxuMbgif6CttN5j72Ls',
            name: 'Polkadot account 1',
          },
          {
            type: 'substrate',
            address: '5CLwQ5xmYfBshb9cwndyybRwbc673Rhh4f6s3i3qXbfDebXJ',
            name: 'Polkadot account 2',
          },
          { type: 'substrate', address: '5EfK2DKRJKU2heXXnmZU6BTSqk3kFoeAJ3ZkqpyWFsSEBGPA', readonly: true },
        ]}
      />
    </ThemeProvider>
  </React.StrictMode>
)

const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)

root.render(<Root />)
