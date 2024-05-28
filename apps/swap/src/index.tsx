import {
  InputError,
  accountsAtom,
  assetAvailableAmountAtomFamily,
  assetFiatPriceAtomFamily,
  chainflipNetworkAtom,
  coingeckoApiEndpointAtom,
  coingeckoApiKeyAtom,
  coingeckoApiTierAtom,
  currencyAtom,
  destAccountAtom,
  destAccountsAtom,
  destAmountAtom,
  destAmountLoadableAtom,
  destAssetAtom,
  destAssetsAtom,
  destChainsAtom,
  focusedInfoSection,
  quoteAtom,
  quoteLoadableAtom,
  srcAccountAtom,
  srcAccountsAtom,
  srcAmountAtom,
  srcAmountInputAtom,
  srcAssetAtom,
  srcAssetAvailableAmountAtom,
  srcAssetsAtom,
  srcChainsAtom,
  substrateSignerAtom,
  swapPromiseAtom,
  swapPromiseLoadableAtom,
  swapStatusAtomFamily,
  swapsAtom,
  useReverse,
  useSwap,
  viemWalletClientAtom,
} from './api'
import { assetIcons, chainIcons } from './config'
import type { Account } from './types'
import { shortenAddress } from './utils'
import { type Asset, type Chain } from '@chainflip/sdk/swap'
import '@polkadot/api-augment/substrate'
import type { Signer } from '@polkadot/api/types'
import {
  Chip,
  CircularProgressIndicator,
  DescriptionList,
  Identicon,
  Select,
  TalismanHandProgressIndicator,
  Text,
  Tooltip,
  toast,
} from '@talismn/ui'
import { SwapForm, TokenSelectDialog } from '@talismn/ui-recipes'
import '@talismn/ui/assets/css/talismn.css'
import { Provider, atom, useAtom, useAtomValue } from 'jotai'
import { loadable, useAtomCallback, useHydrateAtoms } from 'jotai/utils'
import { Suspense, useCallback, useMemo, useState, type PropsWithChildren } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { type WalletClient } from 'viem'

type AssetAmountProps = {
  account: Account
  asset: Asset
}

const AssetAmount = (props: AssetAmountProps) => (
  <>
    {useAtomValue(
      assetAvailableAmountAtomFamily({ address: props.account.address, asset: props.asset })
    ).toLocaleString()}
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
      srcAmount={status.amount?.toLocaleString() ?? '...'}
      destAmount={status.egressAmount?.toLocaleString() ?? '...'}
      srcAssetIconSrc={status.srcAssetIcon}
      destAssetIconSrc={status.destAssetIcon}
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

  const [focusedSection, setFocusedSection] = useAtom(focusedInfoSection)

  return (
    <SwapForm.Info
      focusedSection={focusedSection}
      onChangeFocusedSection={setFocusedSection}
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
        <SwapForm.Info.Faq footer={<SwapForm.Info.Faq.Footer discordUrl="https://discord.gg/talisman" />}>
          <SwapForm.Info.Faq.Question
            question="How does the swap works?"
            answer={
              <>
                Chainflip is a decentralized exchange that uses a consensus-driven software and a network of Validator
                nodes to manage private keys and execute trades. It utilizes Multi Party Computation (MPC) to govern
                high-threshold multi-signature wallets, ensuring a supermajority is required to function.
                <br />
                <br />
                The State Chain defines the AMM and accounting rules, while the Validator Software manages shares of the
                multisig wallets. In essence, Validators operate a virtual AMM system for swapping liquid assets.
              </>
            }
          />
          <SwapForm.Info.Faq.Question
            question="How long does the swap take?"
            answer={
              <>
                During a swap, the transactions into and out of Chainflip are on-chain, so the time depends on the speed
                of the blockchains involved.
                <br />
                <br />
                Typically, the new asset should reach the user's wallet within 5 minutes. This is significantly faster
                than existing bridges and faster than the average centralised exchange.
              </>
            }
          />
          <SwapForm.Info.Faq.Question
            question="What is included in the fees?"
            answer={
              <DescriptionList>
                <DescriptionList.Description>
                  <DescriptionList.Details>Deposit Gas Fees</DescriptionList.Details>
                  <DescriptionList.Term>Varies per chain</DescriptionList.Term>
                </DescriptionList.Description>
                <DescriptionList.Description>
                  <DescriptionList.Details>Liquidity Fee Per Pool</DescriptionList.Details>
                  <DescriptionList.Term>{(0.2).toLocaleString(undefined, { style: 'percent' })}</DescriptionList.Term>
                </DescriptionList.Description>
                <DescriptionList.Description>
                  <DescriptionList.Details>Network Fee</DescriptionList.Details>
                  <DescriptionList.Term>{(0.1).toLocaleString(undefined, { style: 'percent' })}</DescriptionList.Term>
                </DescriptionList.Description>
                <DescriptionList.Description>
                  <DescriptionList.Details>Broadcast Fee</DescriptionList.Details>
                  <DescriptionList.Term>Varies per chain</DescriptionList.Term>
                </DescriptionList.Description>
              </DescriptionList>
            }
          />
        </SwapForm.Info.Faq>
      }
      footer={
        <SwapForm.Info.Footer>
          Swap powered by {/* eslint-disable-next-line react/jsx-no-target-blank */}
          <a href="https://docs.chainflip.io/concepts/welcome" target="_blank" css={{ display: 'contents' }}>
            <Chip
              containerColor="linear-gradient(90deg, rgba(255, 73, 162, 0.10) 0%, rgba(70, 221, 147, 0.10) 100%)"
              size="sm"
              css={{ textTransform: 'uppercase', cursor: 'pointer' }}
            >
              <img src="https://chainflip.io/images/home/logo-white.svg" css={{ height: '1em' }} />
            </Chip>
          </a>
        </SwapForm.Info.Footer>
      }
    />
  )
}

const SrcAccountSelect = () => {
  const accounts = useAtomValue(srcAccountsAtom)
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
  const [amount, setAmount] = useAtom(srcAmountInputAtom)

  const destAmountLoadable = useAtomValue(destAmountLoadableAtom)
  const inputErrorLoadable = useAtomValue(inputErrorLoadableAtom)
  const quoteLoadable = useAtomValue(quoteLoadableAtom)

  const inputError =
    amount.trim() !== '' && inputErrorLoadable.state === 'hasData' ? inputErrorLoadable.data : undefined

  const swap = useSwap()

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
        useCallback(
          async get => {
            const amount = await get(srcAssetAvailableAmountAtom)

            if (amount !== undefined) {
              setAmount(amount.toString())
            }
          },
          [setAmount]
        )
      )}
      onRequestReverse={useReverse()}
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
  substrateSigner?: Signer
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
        [substrateSignerAtom, props.substrateSigner],
        [coingeckoApiEndpointAtom, props.coingeckoApiEndpoint],
        [coingeckoApiTierAtom, props.coingeckoApiTier],
        [coingeckoApiKeyAtom, props.coingeckoApiKey],
        [chainflipNetworkAtom, props.useTestnet ? 'perseverance' : 'mainnet'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
