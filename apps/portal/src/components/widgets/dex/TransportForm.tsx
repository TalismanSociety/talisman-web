import {
  evmAccountsState,
  substrateAccountsState,
  writeableSubstrateAccountsState,
  type Account,
} from '../../../domains/accounts'
import { balancesState, selectedCurrencyState } from '../../../domains/balances'
import { bridgeAdapterState, bridgeState } from '../../../domains/bridge'
import { tokenPriceState } from '../../../domains/chains'
import { useExtrinsic } from '../../../domains/common'
import { Maybe } from '../../../util/monads'
import { useAccountSelector } from '../AccountSelector'
import { FixedPointNumber } from '@acala-network/sdk-core'
import { type SubmittableExtrinsic } from '@polkadot/api/types'
import { type ISubmittableResult } from '@polkadot/types/types'
import type { Chain, ChainId, InputConfig } from '@polkawallet/bridge'
import * as Sentry from '@sentry/react'
import { useTokens as useBalancesLibTokens, useChains } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator, Text, toast } from '@talismn/ui'
import { TokenSelectDialog, TransportForm } from '@talismn/ui-recipes'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { RecoilLoadable, constSelector, selector, useRecoilValue, useRecoilValueLoadable, type Loadable } from 'recoil'
import { Observable } from 'rxjs'

const routesState = selector({
  key: 'Transport/Routes',
  get: ({ get }) => get(bridgeState).router.getAvailableRouters(),
})

// TODO: remove once bug is fixed
const isEvmChain = (chain: Chain) => chain.id === 'moonbeam' || chain.type === 'ethereum'

const Transport = () => {
  const currency = useRecoilValue(selectedCurrencyState)
  const availableRoutes = useRecoilValue(routesState)
  const balances = useRecoilValue(balancesState)

  const [[sender], senderSelector] = useAccountSelector(useRecoilValue(writeableSubstrateAccountsState), 0)

  const [amount, setAmount] = useState('')

  const balancesLibChains = useChains()
  const balancesLibTokens = useBalancesLibTokens()

  const routes = useMemo(
    () =>
      availableRoutes.filter(route => {
        switch (sender?.type) {
          case 'ethereum':
            return isEvmChain(route.from)
          case 'ecdsa':
          case 'ed25519':
          case 'sr25519':
            return !isEvmChain(route.from)
          case undefined:
            return true
          default:
            throw new Error(`Unknown account type: ${sender?.type ?? 'undefined'}`)
        }
      }),
    [availableRoutes, sender?.type]
  )

  const [route, setRoute] = useState(routes.at(0)!)

  const [[recipient, setRecipient], recipientSelector] = useAccountSelector(
    useRecoilValue(isEvmChain(route.to) ? evmAccountsState : substrateAccountsState),
    useCallback(
      (x: Account[] | undefined) => x?.find(y => y.address === sender?.address) ?? x?.at(0),
      [sender?.address]
    )
  )

  const token = useMemo(
    () =>
      Object.values(balancesLibTokens).find(
        x =>
          x.symbol.toLowerCase() === route.token.toLowerCase() &&
          x.chain &&
          (route.from.paraChainId === -1
            ? balancesLibChains[x.chain.id]?.paraId === null
            : balancesLibChains[x.chain.id]?.paraId === route.from.paraChainId)
      ),
    [balancesLibChains, balancesLibTokens, route.from.paraChainId, route.token]
  )

  const tokenPriceLoadable = useRecoilValueLoadable(
    !token?.coingeckoId ? constSelector(undefined) : tokenPriceState({ coingeckoId: token.coingeckoId })
  )

  useEffect(() => {
    if (sender !== undefined) {
      setRecipient(sender)
    }
  }, [sender, setRecipient])

  const [fromTokenDialogOpen, setFromTokenDialogOpen] = useState(false)
  const fromTokens = useMemo(
    () =>
      Array.from(
        new Map(
          routes
            .map(route => {
              const token = Object.values(balancesLibTokens).find(
                token => token.symbol.toLowerCase() === route.token.toLowerCase()
              )
              const balance = balances
                .find({ address: sender?.address })
                .find(
                  balance =>
                    balance.token.symbol.toLowerCase() === route.token.toLowerCase() &&
                    (route.from.paraChainId === -1
                      ? balancesLibChains[balance.chain.id]?.paraId === null
                      : balancesLibChains[balance.chain.id]?.paraId === route.from.paraChainId)
                )

              return [
                `${route.from.id}-${route.token}`,
                {
                  id: route.token,
                  name: route.token,
                  code: route.token,
                  chain: route.from.display,
                  chainId: route.from.id,
                  iconSrc:
                    token?.logo ??
                    'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/tokens/unknown.svg',
                  amount: Decimal.fromPlanck(balance.sum.planck.transferable, balance.each.at(0)?.decimals ?? 0, {
                    currency: route.token,
                  }).toLocaleString(),
                  fiatAmount: balance.sum
                    .fiat(currency)
                    .transferable.toLocaleString(undefined, { style: 'currency', currency }),
                  sortKey: balance.sum.fiat(currency).transferable,
                },
              ] as const
            })
            .toSorted((a, b) => b[1].sortKey - a[1].sortKey || a[1].name.localeCompare(b[1].name))
        ).values()
      ),
    [balances, balancesLibChains, balancesLibTokens, currency, routes, sender?.address]
  )

  const [toTokenDialogOpen, setToTokenDialogOpen] = useState(false)
  const toTokens = useMemo(
    () =>
      Array.from(
        new Map(
          routes
            .filter(x => x.from.id === route.from.id && x.token === route.token)
            .map(route => {
              const token = Object.values(balancesLibTokens).find(
                token => token.symbol.toLowerCase() === route.token.toLowerCase()
              )
              const balance = balances
                .find({ address: sender?.address })
                .find(
                  balance =>
                    balance.token.symbol.toLowerCase() === route.token.toLowerCase() &&
                    (route.to.paraChainId === -1
                      ? balancesLibChains[balance.chain.id]?.paraId === null
                      : balancesLibChains[balance.chain.id]?.paraId === route.to.paraChainId)
                )

              return [
                `${route.to.id}-${route.token}`,
                {
                  id: route.token,
                  name: route.token,
                  code: route.token,
                  chain: route.to.display,
                  chainId: route.to.id,
                  iconSrc:
                    token?.logo ??
                    'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/tokens/unknown.svg',
                  amount: Decimal.fromPlanck(balance.sum.planck.transferable, balance.each.at(0)?.decimals ?? 0, {
                    currency: route.token,
                  }).toLocaleString(),
                  fiatAmount: balance.sum
                    .fiat(currency)
                    .transferable.toLocaleString(undefined, { style: 'currency', currency }),
                  sortKey: balance.sum.fiat(currency).transferable,
                },
              ] as const
            })
            .toSorted((a, b) => b[1].sortKey - a[1].sortKey || a[1].name.localeCompare(b[1].name))
        ).values()
      ),
    [balances, balancesLibChains, balancesLibTokens, currency, route.from.id, route.token, routes, sender?.address]
  )

  const originChains = useMemo(
    () => Array.from(new Map(routes.map(route => [route.from.id, route.from] as const)).values()),
    [routes]
  )

  const destinationChains = useMemo(
    () =>
      Array.from(
        new Map(
          routes
            .filter(x => x.from.id === route.from.id && x.token === route.token)
            .map(route => [route.to.id, route.from] as const)
        ).values()
      ),
    [route.from.id, route.token, routes]
  )

  const onChangeFromToken = (token: string, chainId: ChainId) => {
    const route = routes.find(route => route.token === token && route.from.id === chainId)

    if (route === undefined) {
      throw new Error(`Can't find route from ${token}@${chainId}`)
    }

    setRoute(route)
  }

  const onChangeToToken = (token: string, chainId: ChainId) => {
    const newRoute = routes.find(x => x.token === token && x.from.id === route.from.id && x.to.id === chainId)

    if (newRoute === undefined) {
      throw new Error(`Can't find route from ${token}@${chainId}`)
    }

    setRoute(newRoute)
  }

  const reversedRoute = useMemo(() => {
    return routes.find(x => x.token === route.token && x.from.id === route.to.id && x.to.id === route.from.id)
  }, [route.from.id, route.to.id, route.token, routes])

  const routeReversible = reversedRoute !== undefined

  const adapterLoadable = useRecoilValueLoadable(bridgeAdapterState(route.from.id))

  const [inputConfigLoadable, setInputConfigLoadable] = useState<Loadable<InputConfig>>()

  useEffect(() => {
    if (inputConfigLoadable?.state === 'hasError') {
      toast.error('Failed to get transferable amount')
      Sentry.captureException(inputConfigLoadable.contents)
      console.error(inputConfigLoadable.contents)
    }
  }, [inputConfigLoadable?.contents, inputConfigLoadable?.state])

  useEffect(() => {
    const adapter = adapterLoadable.valueMaybe()

    if (adapter === undefined) {
      setInputConfigLoadable(undefined)
    }

    if (adapter !== undefined && sender !== undefined && recipient !== undefined) {
      setInputConfigLoadable(RecoilLoadable.loading())

      const subscription = new Observable<InputConfig>(observer =>
        adapter
          .subscribeInputConfig({
            address: recipient.address,
            signer: sender.address,
            to: route.to.id,
            token: route.token,
          })
          .subscribe(observer)
      ).subscribe({
        next: x => setInputConfigLoadable(RecoilLoadable.of(x)),
        error: error => setInputConfigLoadable(RecoilLoadable.error(error)),
      })

      return () => subscription.unsubscribe()
    }

    return undefined
  }, [adapterLoadable, recipient, route.to.id, route.token, sender])

  const tokenInfo = useMemo(() => adapterLoadable.valueMaybe()?.getToken(route.token), [adapterLoadable, route.token])

  const decimalAmount = useMemo(
    () => Maybe.of(tokenInfo).mapOrUndefined(token => Decimal.fromUserInputOrUndefined(amount, token.decimals)),
    [amount, tokenInfo]
  )

  const fiatAmount = useMemo(() => {
    const price = tokenPriceLoadable.valueMaybe()

    return price === undefined || decimalAmount === undefined ? undefined : price * decimalAmount.toNumber()
  }, [decimalAmount, tokenPriceLoadable])

  const fixedPointNumberToDecimal = (fn: FixedPointNumber, symbol?: string) =>
    Decimal.fromPlanck(fn._getInner().integerValue().toString(), fn.getPrecision(), { currency: symbol })

  const parsedInputConfigLoadable = useMemo(
    () =>
      inputConfigLoadable?.map(x => ({
        ...x,
        estimateFee: fixedPointNumberToDecimal(x.estimateFee.balance, x.estimateFee.token),
        minInput: fixedPointNumberToDecimal(x.minInput, route.token),
        maxInput: fixedPointNumberToDecimal(x.maxInput, route.token),
        destFee: fixedPointNumberToDecimal(x.destFee.balance, x.destFee.token),
      })),
    [inputConfigLoadable, route.token]
  )

  const inputError = useMemo(() => {
    if (parsedInputConfigLoadable?.state !== 'hasValue' || decimalAmount === undefined) {
      return
    }

    if (amount === '') {
      return
    }

    if (decimalAmount.planck > parsedInputConfigLoadable.contents.maxInput.planck) {
      return `Insufficient balance`
    }

    if (decimalAmount.planck < parsedInputConfigLoadable.contents.minInput.planck) {
      return `Minimum ${parsedInputConfigLoadable.contents.minInput.toLocaleString()}`
    }

    return undefined
  }, [amount, decimalAmount, parsedInputConfigLoadable])

  const ready = useMemo(
    () => amount !== '' && parsedInputConfigLoadable?.state === 'hasValue' && inputError === undefined,
    [amount, inputError, parsedInputConfigLoadable?.state]
  )

  const extrinsic = useExtrinsic(
    useMemo(() => {
      const adapter = adapterLoadable.valueMaybe()

      if (adapter === undefined || token === undefined || decimalAmount === undefined || recipient === undefined) {
        return
      }

      return adapter?.createTx({
        amount: FixedPointNumber.fromInner(decimalAmount.planck.toString(), decimalAmount?.decimals),
        to: route.to.id,
        token: route.token,
        address: recipient.address,
      }) as SubmittableExtrinsic<'promise', ISubmittableResult> | undefined
    }, [adapterLoadable, decimalAmount, recipient, route.to.id, route.token, token]),
    adapterLoadable.valueMaybe()?.getApi()?.genesisHash.toHex()
  )

  const [focusedSection, setFocusedSection] = useState<'details' | 'faq'>('details')

  useEffect(() => {
    setFocusedSection('details')
  }, [amount, route])

  return (
    <>
      {fromTokenDialogOpen && (
        <TokenSelectDialog
          tokens={fromTokens}
          chains={originChains.map(chain => ({ id: chain.id, name: chain.display, iconSrc: chain.icon }))}
          onSelectToken={token => onChangeFromToken(token.id, token.chainId as any)}
          onRequestDismiss={() => setFromTokenDialogOpen(false)}
        />
      )}
      {toTokenDialogOpen && (
        <TokenSelectDialog
          tokens={toTokens}
          chains={destinationChains.map(chain => ({ id: chain.id, name: chain.display, iconSrc: chain.icon }))}
          onSelectToken={token => onChangeToToken(token.id, token.chainId as any)}
          onRequestDismiss={() => setToTokenDialogOpen(false)}
        />
      )}
      <TransportForm
        amount={amount}
        fiatAmount={
          fiatAmount?.toLocaleString(undefined, { style: 'currency', currency }) ?? (
            <CircularProgressIndicator size="1em" />
          )
        }
        availableAmount={
          parsedInputConfigLoadable?.valueMaybe()?.maxInput.toLocaleString() ?? <CircularProgressIndicator size="1em" />
        }
        onChangeAmount={setAmount}
        onRequestMaxAmount={() => setAmount(parsedInputConfigLoadable?.valueMaybe()?.maxInput.toString() ?? '')}
        amountError={inputError}
        accountSelect={senderSelector}
        tokenSelect={
          <TransportForm.TokenSelect
            name={route.token}
            chain={route.from.display}
            iconSrc={route.from.icon}
            onClick={() => setFromTokenDialogOpen(true)}
          />
        }
        destTokenSelect={
          <TransportForm.TokenSelect
            name={route.token}
            chain={route.to.display}
            iconSrc={route.to.icon}
            onClick={() => setToTokenDialogOpen(true)}
          />
        }
        reversible={routeReversible}
        onRequestReverse={() => {
          if (reversedRoute === undefined) {
            throw new Error("Can't reverse irreversible route")
          }

          setRoute(reversedRoute)
        }}
        destAccountSelect={recipientSelector}
        canTransport={ready}
        onRequestTransport={() => {
          if (sender === undefined) {
            throw new Error("Can't swap with no sender")
          }

          if (extrinsic === undefined) {
            throw new Error("Extrinsic isn't ready yet")
          }

          void extrinsic.signAndSend(sender.address)
        }}
        transportInProgress={extrinsic?.state === 'loading'}
        info={
          <TransportForm.Info
            focusedSection={focusedSection}
            onChangeFocusedSection={setFocusedSection}
            summary={(() => {
              switch (parsedInputConfigLoadable?.state) {
                case 'loading':
                case undefined:
                  return <TransportForm.Info.Summary.ProgressIndicator />
                case 'hasValue':
                  return (
                    <TransportForm.Info.Summary
                      originFee={`~${parsedInputConfigLoadable.contents.estimateFee.toLocaleString()}`}
                      destinationFee={`~${parsedInputConfigLoadable.contents.destFee.toLocaleString()}`}
                    />
                  )
                case 'hasError':
                  return (
                    <TransportForm.Info.Summary.ErrorMessage
                      title="Unable to process transport"
                      text="Please try again later"
                    />
                  )
              }
            })()}
            faq={
              <TransportForm.Info.Faq
                footer={<TransportForm.Info.Faq.Footer discordUrl="https://discord.gg/talisman" />}
              >
                <TransportForm.Info.Faq.Question
                  question="How does transport work?"
                  answer={
                    <span>
                      Talisman’s transport feature leverages XCMP on Polkadot to send assets between networks. The
                      Talisman portal crafts the relevant transaction before requesting a signature before sending the
                      transaction to the “from” network, which executes the transfer of tokens to your specified
                      “destination” chain. Learn more about Polkadot’s XCMP{' '}
                      <Text.Noop.A href="https://polkadot.network/features/cross-chain-communication/" target="_blank">
                        here
                      </Text.Noop.A>
                      .
                    </span>
                  }
                />
                <TransportForm.Info.Faq.Question
                  question="How do I perform a teleport?"
                  answer={
                    <span>
                      A “teleport” is an XCM instruction that moves assets between two networks. It is implemented by
                      networks that trust one-another, e.g. Statemint & Polkadot. Performing a teleport in the Talisman
                      Portal is like performing any other cross-chain transport in the “Transport” feature: by
                      specifying the asset, amount, “from” network, and “to” network you are interested in.
                    </span>
                  }
                />
                <TransportForm.Info.Faq.Question
                  question="How do I perform a teleport?"
                  answer={
                    <span>
                      A “teleport” is an XCM instruction that moves assets between two networks. It is implemented by
                      networks that trust one-another, e.g. Statemint & Polkadot. Performing a teleport in the Talisman
                      Portal is like performing any other cross-chain transport in the “Transport” feature: by
                      specifying the asset, amount, “from” network, and “to” network you are interested in.
                    </span>
                  }
                />
                <TransportForm.Info.Faq.Question
                  question="What are the risks?"
                  answer={
                    <span>
                      Sending assets between networks is generally a safe procedure on the Talisman portal, since
                      Talisman interacts directly with the networks to execute your transaction, and our team have
                      tested all routes we offer. However depending on the assets and networks involved, you may find:
                      <br />
                      <br />
                      <ul>
                        <li>
                          Your transferred assets on a chain where your account does not have the necessary token to pay
                          for further txs.
                        </li>
                        <li>
                          When transferring some assets you might be at risk of losing your existential deposit, which
                          may reap your account on the “from” network.
                        </li>
                        <li>
                          An (increasingly rare) bug in an XCM configuration on a network means a transfer is not
                          processed correctly.
                        </li>
                      </ul>
                      <br />
                      Additionally, always make sure that the URL of the Dapp you are using is correct. In this case:
                      app.talisman.xyz.
                    </span>
                  }
                />
              </TransportForm.Info.Faq>
            }
            footer={<TransportForm.Info.Footer>Transport via XCM</TransportForm.Info.Footer>}
          />
        }
      />
    </>
  )
}

export default Transport
