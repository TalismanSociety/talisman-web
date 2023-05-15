import { FixedPointNumber } from '@acala-network/sdk-core'
import TeleportFormDialogComponent from '@components/recipes/TeleportDialog'
import TeleportFormComponent from '@components/recipes/TeleportForm'
import TokenSelectorDialog, { TokenSelectorItem } from '@components/recipes/TokenSelectorDialog'
import { injectedSubstrateAccountsState } from '@domains/accounts'
import { selectedBalancesState } from '@domains/balances/recoils'
import { bridgeApiProvider, bridgeConfig, bridgeNodeList, bridgeState } from '@domains/bridge'
import { extrinsicMiddleware } from '@domains/common/extrinsicMiddleware'
import { toastExtrinsic } from '@domains/common/utils'
import { type SubmittableExtrinsic } from '@polkadot/api/types'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { type ISubmittableResult } from '@polkadot/types/types'
import { Chain, InputConfig } from '@polkawallet/bridge'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator, toast } from '@talismn/ui'
import { Maybe } from '@util/monads'
import { isEmpty, uniqBy } from 'lodash'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loadable, RecoilLoadable, useRecoilCallback, useRecoilValue, waitForAll } from 'recoil'
import { Observable, switchMap } from 'rxjs'
import { useAccountSelector } from './AccountSelector'

const TeleportForm = () => {
  const [_balances, bridge] = useRecoilValue(waitForAll([selectedBalancesState, bridgeState]))

  const [amount, setAmount] = useState('')
  const [sender, senderSelector] = useAccountSelector(useRecoilValue(injectedSubstrateAccountsState), 0)

  const balances = useMemo(
    () => (sender === undefined ? _balances : _balances.find(x => x.address === sender.address)),
    [_balances, sender]
  )

  const [fromChain, setFromChain] = useState<Chain>()
  const [toChain, setToChain] = useState<Chain>()
  const [token, setToken] = useState<string>()

  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false)

  const filterParams = <T extends Object>(object: T) => {
    const params = Object.fromEntries(Object.entries(object).filter(([_, value]) => value !== undefined))

    if (isEmpty(params)) {
      return undefined
    }

    return params
  }

  const routes = useMemo(
    () =>
      bridge.router
        .getAvailableRouters()
        .filter(x => fromChain === undefined || x.from.id === fromChain.id)
        .filter(x => toChain === undefined || x.to.id === toChain.id)
        .filter(x => token === undefined || x.token === token),
    [bridge.router, toChain, fromChain, token]
  )

  const originChains = useMemo(
    () =>
      uniqBy(
        routes.map(x => x.from),
        'id'
      ),
    [routes]
  )
  const destinationChains = useMemo(
    () =>
      uniqBy(
        routes.map(x => x.to),
        'id'
      ),
    [routes]
  )

  const routeReversible = useMemo(() => {
    const routes = bridge.router.getRouters(filterParams({ token }))

    if (fromChain === undefined && toChain === undefined) {
      return false
    }

    if (fromChain !== undefined && toChain === undefined && routes.some(x => x.to.id === fromChain.id)) {
      return true
    }

    if (toChain !== undefined && fromChain === undefined && routes.some(x => x.from.id === toChain.id)) {
      return true
    }

    if (
      toChain !== undefined &&
      fromChain !== undefined &&
      routes.some(x => x.to.id === fromChain.id && x.from.id === toChain.id)
    ) {
      return true
    }

    return false
  }, [bridge.router, fromChain, toChain, token])

  const tokens = useMemo(() => [...new Set(routes.map(x => x.token))], [routes])
  const tokensWithBalance = useMemo(
    () =>
      tokens.map(symbol => {
        const tokenBalances = balances.find(x => x.token?.symbol !== undefined && x.token.symbol === symbol)

        return {
          symbol,
          logo: tokenBalances.each.at(0)?.token?.logo,
          amount: Decimal.fromUserInput(
            tokenBalances.each
              .reduce(
                (previous, current) =>
                  previous +
                  Decimal.fromPlanck(current.free.planck, current.decimals ?? 0, current.token?.symbol).toNumber(),
                0
              )
              .toFixed(2),
            2,
            tokenBalances.each.at(0)?.token?.symbol
          ),
          fiatAmount: tokenBalances.sum.fiat('usd').free,
        }
      }),
    [balances, tokens]
  )

  const tokenBalance = useMemo(() => tokensWithBalance.find(x => x.symbol === token), [token, tokensWithBalance])

  const adapter = useMemo(
    () => Maybe.of(fromChain).mapOrUndefined(bridge.findAdapter.bind(bridge)),
    [bridge, fromChain]
  )

  const [inputConfigLoadable, setInputConfigLoadable] = useState<Loadable<InputConfig>>()

  useEffect(() => {
    if (inputConfigLoadable?.state === 'hasError') {
      toast.error('Failed to get transferable amount')
    }
  }, [inputConfigLoadable?.state])

  useEffect(() => {
    setInputConfigLoadable(undefined)
    if (adapter !== undefined && sender !== undefined && toChain !== undefined && token !== undefined) {
      setInputConfigLoadable(RecoilLoadable.loading())
      const subscription = bridgeApiProvider
        .connectFromChain([adapter.chain.id], bridgeNodeList)
        .pipe(
          switchMap(() => adapter.init(bridgeApiProvider.getApi(adapter.chain.id))),
          switchMap(
            () =>
              // Observable returned from `@polkawallet/bridge` is not instance of `Observable` for some reason
              // might be a webpack issue where 2 instances of rxjs library are created
              // https://github.com/ReactiveX/rxjs/issues/6628
              new Observable<InputConfig>(observer =>
                adapter
                  .subscribeInputConfig({
                    address: sender.address,
                    signer: sender.address,
                    to: toChain.id,
                    token,
                  })
                  .subscribe(observer)
              )
          )
        )
        .subscribe({
          next: x => setInputConfigLoadable(RecoilLoadable.of(x)),
          error: error => setInputConfigLoadable(RecoilLoadable.error(error)),
        })

      return subscription.unsubscribe.bind(subscription)
    }
  }, [adapter, sender, toChain, token])

  const tokenInfo = useMemo(() => Maybe.of(token).mapOrUndefined(x => adapter?.getToken(x)), [adapter, token])
  const decimalAmount = useMemo(
    () => Maybe.of(tokenInfo).mapOrUndefined(token => Decimal.fromUserInput(amount, token.decimals)),
    [amount, tokenInfo]
  )

  const fixedPointNumberToDecimal = (fn: FixedPointNumber, symbol?: string) =>
    Decimal.fromPlanck(fn._getInner().integerValue().toString(), fn.getPrecision(), symbol)

  const parsedInputConfigLoadable = useMemo(
    () =>
      inputConfigLoadable?.map(x => ({
        ...x,
        estimateFee: Decimal.fromPlanck(
          x.estimateFee,
          // @ts-expect-error
          adapter?.api?.registry.chainDecimals[0] ?? 0,
          // @ts-expect-error
          adapter?.api?.registry.chainTokens[0]
        ),
        minInput: fixedPointNumberToDecimal(x.minInput, token),
        maxInput: fixedPointNumberToDecimal(x.maxInput, token),
        destFee: fixedPointNumberToDecimal(x.destFee.balance, x.destFee.token),
      })),
    [
      // @ts-expect-error
      adapter?.api?.registry.chainDecimals,
      // @ts-expect-error
      adapter?.api?.registry.chainTokens,
      inputConfigLoadable,
      token,
    ]
  )

  const inputError = useMemo(() => {
    if (parsedInputConfigLoadable?.state !== 'hasValue' || decimalAmount === undefined) {
      return
    }

    if (amount === '') {
      return
    }

    if (decimalAmount.planck.gte(parsedInputConfigLoadable.contents.maxInput.planck)) {
      return `Insufficient balance`
    }

    if (decimalAmount.planck.lte(parsedInputConfigLoadable.contents.minInput.planck)) {
      return `Minimum ${parsedInputConfigLoadable.contents.minInput.toHuman()}`
    }
  }, [amount, decimalAmount, parsedInputConfigLoadable])

  const ready = useMemo(
    () => amount !== '' && parsedInputConfigLoadable?.state === 'hasValue' && inputError === undefined,
    [amount, inputError, parsedInputConfigLoadable?.state]
  )

  const [extrinsicInProgress, setExtrinsicInProgress] = useState(false)

  return (
    <>
      <TeleportFormComponent
        accountSelector={senderSelector}
        transferableAmount={
          parsedInputConfigLoadable?.state === 'loading' ? (
            <CircularProgressIndicator size="1em" />
          ) : parsedInputConfigLoadable?.state === 'hasValue' ? (
            parsedInputConfigLoadable?.contents?.maxInput.toHuman()
          ) : undefined
        }
        fromChains={originChains.map(x => ({ name: x.id, logoSrc: x.icon }))}
        selectedFromChainIndex={useMemo(
          () => originChains.findIndex(x => x.id === fromChain?.id),
          [fromChain?.id, originChains]
        )}
        onSelectFromChainIndex={index =>
          setFromChain(Maybe.of(index).mapOrUndefined(originChains.at.bind(originChains)))
        }
        toChains={destinationChains.map(x => ({ name: x.id, logoSrc: x.icon }))}
        selectedToChainIndex={useMemo(
          () => destinationChains.findIndex(x => x.id === toChain?.id),
          [destinationChains, toChain?.id]
        )}
        onSelectToChainIndex={index =>
          setToChain(Maybe.of(index).mapOrUndefined(destinationChains.at.bind(destinationChains)))
        }
        canReverseChainRoute={routeReversible}
        onReverseChainRoute={() => {
          setFromChain(toChain)
          setToChain(fromChain)
        }}
        token={Maybe.of(tokenBalance).mapOrUndefined(x => ({ name: x.symbol, logoSrc: x.logo ?? '' }))}
        onRequestTokenChange={() => {
          if (token === undefined) {
            setTokenSelectorOpen(true)
          } else {
            setToken(undefined)
          }
        }}
        amount={amount}
        onChangeAmount={setAmount}
        originFee={Maybe.of(parsedInputConfigLoadable?.valueMaybe()).mapOrUndefined(
          fee => `~${fee.estimateFee.toHuman()}`
        )}
        destinationFee={parsedInputConfigLoadable?.valueMaybe()?.destFee.toHuman()}
        onConfirmTransfer={
          // TODO: extrinsic middleware logic to domains similar to `useExtrinsic`
          useRecoilCallback(callbackInterface => () => {
            if (
              adapter === undefined ||
              decimalAmount === undefined ||
              fromChain === undefined ||
              toChain === undefined ||
              token === undefined ||
              sender === undefined
            ) {
              return
            }

            const tx = adapter.createTx({
              amount: FixedPointNumber.fromInner(decimalAmount.planck.toString(), decimalAmount?.decimals),
              to: toChain.id,
              token,
              address: sender.address,
              signer: sender.address,
            }) as SubmittableExtrinsic<'rxjs', ISubmittableResult>

            web3FromAddress(sender.address).then(web3 => {
              const result = tx.signAndSend(sender.address, { signer: web3.signer })

              setExtrinsicInProgress(true)

              let resolve = (_: ISubmittableResult) => {}
              let reject = (_: any) => {}
              const promise = new Promise<ISubmittableResult>((_resolve, _reject) => {
                resolve = _resolve
                reject = _reject
              })

              const subscription = result.subscribe({
                next: result => {
                  extrinsicMiddleware(fromChain.id, tx, result, callbackInterface)
                  if (result.isFinalized) {
                    resolve(result)
                    setExtrinsicInProgress(false)
                    subscription.unsubscribe()
                  }
                },
                error: error => {
                  reject(error)
                  setExtrinsicInProgress(false)
                },
              })

              const config = bridgeConfig[adapter.chain.id]

              toastExtrinsic(
                [[tx.method.section, tx.method.method]],
                promise,
                config !== undefined && 'subscanUrl' in config ? config.subscanUrl : undefined
              )
            })
          })
        }
        confirmTransferState={extrinsicInProgress ? 'pending' : ready ? undefined : 'disabled'}
        inputError={inputError}
      />
      <TokenSelectorDialog
        open={tokenSelectorOpen}
        onRequestDismiss={useCallback(() => setTokenSelectorOpen(false), [])}
      >
        {tokensWithBalance
          .sort((a, b) => b.fiatAmount - a.fiatAmount || b.amount.planck.cmp(a.amount.planck))
          .map(x => (
            <TokenSelectorItem
              logoSrc={x.logo ?? ''}
              name={x.symbol}
              amount={x.amount.toHuman()}
              fiatAmount={x.fiatAmount.toLocaleString(undefined, {
                style: 'currency',
                currency: 'usd',
                compactDisplay: 'short',
              })}
              onClick={() => {
                setToken(x.symbol)
                setTokenSelectorOpen(false)
              }}
            />
          ))}
      </TokenSelectorDialog>
    </>
  )
}

const TeleportDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const open = searchParams.get('action') === 'teleport'

  return (
    <TeleportFormDialogComponent
      open={open}
      onRequestDismiss={() => setSearchParams(new URLSearchParams())}
      teleportForm={<Suspense fallback={<TeleportFormComponent.Skeleton />}>{open && <TeleportForm />}</Suspense>}
    />
  )
}

export default TeleportDialog
