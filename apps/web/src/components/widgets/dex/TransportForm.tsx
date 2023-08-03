import { FixedPointNumber } from '@acala-network/sdk-core'
import DexForm from '@components/recipes/DexForm/DexForm'
import { writeableSubstrateAccountsState } from '@domains/accounts'
import { bridgeAdapterState, bridgeState } from '@domains/bridge'
import { useExtrinsic } from '@domains/common'
import { type SubmittableExtrinsic } from '@polkadot/api/types'
import { type ISubmittableResult } from '@polkadot/types/types'
import { type Chain, type InputConfig } from '@polkawallet/bridge'
import * as Sentry from '@sentry/react'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator, toast } from '@talismn/ui'
import { Maybe } from '@util/monads'
import { isEmpty, uniqBy } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { RecoilLoadable, constSelector, useRecoilValue, useRecoilValueLoadable, type Loadable } from 'recoil'
import { Observable } from 'rxjs'
import { useAccountSelector } from '../AccountSelector'
import TokenSelectorButton from '../TokenSelectorButton'

const TransportForm = () => {
  const bridge = useRecoilValue(bridgeState)

  const [amount, setAmount] = useState('')
  const [sender, senderSelector] = useAccountSelector(useRecoilValue(writeableSubstrateAccountsState), 0)

  const [fromChain, setFromChain] = useState<Chain>()
  const [toChain, setToChain] = useState<Chain>()
  const [token, setToken] = useState<string>()

  const filterParams = <T extends Record<string, unknown>>(object: T) => {
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

  const tokens = useMemo(() => Array.from(new Set(bridge.router.getRouters().map(x => x.token))), [bridge.router])
  const routeTokens = useMemo(() => new Set(routes.map(x => x.token)), [routes])

  const onChangeToken = (token: string) => {
    setToken(token)

    if (!routeTokens.has(token)) {
      setFromChain(undefined)
      setToChain(undefined)
    }
  }

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

  const adapterLoadable = useRecoilValueLoadable(
    fromChain === undefined ? constSelector(undefined) : bridgeAdapterState(fromChain.id)
  )

  const [inputConfigLoadable, setInputConfigLoadable] = useState<Loadable<InputConfig>>()

  useEffect(() => {
    if (inputConfigLoadable?.state === 'hasError') {
      toast.error('Failed to get transferable amount')
      Sentry.captureException(inputConfigLoadable.contents)
      console.error(inputConfigLoadable.contents)
    }
  }, [inputConfigLoadable?.contents, inputConfigLoadable?.state])

  useEffect(() => {
    setInputConfigLoadable(undefined)

    const adapter = adapterLoadable.valueMaybe()

    if (adapter !== undefined && sender !== undefined && toChain !== undefined && token !== undefined) {
      setInputConfigLoadable(RecoilLoadable.loading())

      const subscription = new Observable<InputConfig>(observer =>
        adapter
          .subscribeInputConfig({
            address: sender.address,
            signer: sender.address,
            to: toChain.id,
            token,
          })
          .subscribe(observer)
      ).subscribe({
        next: x => setInputConfigLoadable(RecoilLoadable.of(x)),
        error: error => setInputConfigLoadable(RecoilLoadable.error(error)),
      })

      return () => subscription.unsubscribe()
    }

    return undefined
  }, [adapterLoadable, sender, toChain, token])

  const tokenInfo = useMemo(
    () => Maybe.of(token).mapOrUndefined(x => adapterLoadable.valueMaybe()?.getToken(x)),
    [adapterLoadable, token]
  )
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
          adapterLoadable.valueMaybe()?.api?.registry.chainDecimals[0] ?? 0,
          // @ts-expect-error
          adapterLoadable.valueMaybe()?.api?.registry.chainTokens[0]
        ),
        minInput: fixedPointNumberToDecimal(x.minInput, token),
        maxInput: fixedPointNumberToDecimal(x.maxInput, token),
        destFee: fixedPointNumberToDecimal(x.destFee.balance, x.destFee.token),
      })),
    [adapterLoadable, inputConfigLoadable, token]
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

    return undefined
  }, [amount, decimalAmount, parsedInputConfigLoadable])

  const ready = useMemo(
    () => amount !== '' && parsedInputConfigLoadable?.state === 'hasValue' && inputError === undefined,
    [amount, inputError, parsedInputConfigLoadable?.state]
  )

  const extrinsic = useExtrinsic(
    useMemo(() => {
      const adapter = adapterLoadable.valueMaybe()

      if (
        adapter === undefined ||
        token === undefined ||
        decimalAmount === undefined ||
        toChain === undefined ||
        sender === undefined
      ) {
        return
      }

      return adapter?.createTx({
        amount: FixedPointNumber.fromInner(decimalAmount.planck.toString(), decimalAmount?.decimals),
        to: toChain.id,
        token,
        address: sender.address,
      }) as SubmittableExtrinsic<'promise', ISubmittableResult> | undefined
    }, [adapterLoadable, decimalAmount, sender, toChain, token])
  )

  return (
    <DexForm
      // swapLink={<DexForm.SwapTab as={Link} to="/dex/swap" />}
      // transportLink={<DexForm.TransportTab as={Link} to="/dex/transport" selected />}
      swapLink={undefined}
      transportLink={undefined}
      form={
        <DexForm.Transport
          accountSelector={senderSelector}
          transferableAmount={
            parsedInputConfigLoadable?.state === 'loading' ? (
              <CircularProgressIndicator size="1em" />
            ) : parsedInputConfigLoadable?.state === 'hasValue' ? (
              parsedInputConfigLoadable?.contents?.maxInput.toHuman()
            ) : undefined
          }
          fromChains={originChains.map(x => ({ name: x.id, logoSrc: x.icon }))}
          selectedFromChainInitializing={adapterLoadable.state === 'loading'}
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
          tokenSelector={<TokenSelectorButton tokens={tokens} selectedToken={token} onChangeToken={onChangeToken} />}
          amount={amount}
          onChangeAmount={setAmount}
          originFee={Maybe.of(parsedInputConfigLoadable?.valueMaybe()).mapOrUndefined(
            fee => `~${fee.estimateFee.toHuman()}`
          )}
          destinationFee={parsedInputConfigLoadable?.valueMaybe()?.destFee.toHuman()}
          inputError={inputError}
        />
      }
      fees={[
        Maybe.of(parsedInputConfigLoadable?.valueMaybe()).mapOrUndefined(fee => ({
          name: 'Origin fee',
          amount: `~${fee.estimateFee.toHuman()}`,
        })),
        Maybe.of(parsedInputConfigLoadable?.valueMaybe()).mapOrUndefined(fee => ({
          name: 'Destination fee',
          amount: `~${fee.destFee.toHuman()}`,
        })),
      ]}
      submitButton={
        <DexForm.Transport.SubmitButton
          loading={extrinsic?.state === 'loading'}
          disabled={!ready}
          onClick={() => {
            if (sender !== undefined) {
              void extrinsic?.signAndSend(sender.address)
            }
          }}
        />
      }
    />
  )
}

export default TransportForm
