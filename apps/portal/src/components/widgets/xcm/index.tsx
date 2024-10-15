import type { Loadable } from 'recoil'
import { FixedPointNumber } from '@acala-network/sdk-core'
import * as Sentry from '@sentry/react'
import {
  chainsByGenesisHashAtom,
  useTokens as useBalancesLibTokens,
  useChains,
  useChainsByGenesisHash,
} from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator, Text, toast } from '@talismn/ui'
import { useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { constSelector, RecoilLoadable, selector, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { Observable } from 'rxjs'

import type { Account } from '@/domains/accounts'
// import { bridgeAdapterState, bridgeState } from './api/old'
import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import { useAccountSelector } from '@/components/widgets/AccountSelector'
import { evmAccountsState, substrateAccountsState, writeableSubstrateAccountsState } from '@/domains/accounts'
import { balancesState, selectedCurrencyState } from '@/domains/balances'
import { tokenPriceState } from '@/domains/chains'
import { useExtrinsic, useSetJotaiSubstrateApiState } from '@/domains/common'
import { Maybe } from '@/util/monads'

import { useXcmApi } from './api'
import { validPrefix } from './api/utils/validPrefix'
import { ErrorMessage } from './ErrorMessage'
import { Faq } from './Faq'
import { Fees } from './Fees'
import { Footer } from './Footer'
import { Form } from './Form'
import { Info } from './Info'
import { ProgressIndicator } from './ProgressIndicator'
import { TokenSelectButton } from './TokenSelectButton'
import { TokenSelectDialog } from './TokenSelectDialog'

// const routesState = selector({
//   key: 'Transport/Routes',
//   get: ({ get }) => get(bridgeState).router.getAvailableRouters(),
// })

export function XcmForm() {
  useSetJotaiSubstrateApiState()
  const {
    sender,
    setSender,
    recipient,
    setRecipient,
    sourceChain,
    setSourceChain,
    destChain,
    setDestChain,
    asset,
    setAsset,
    amount,
    setAmount,
    requestMax,

    tokenPickerSource,
    tokenPickerDest,
    sourceChains,
    destChains,
    sourceAsset,
    destAsset,
    canReverse,
    reverseRoute,

    sourceBalance,
    fees,
    extrinsic: pjsExtrinsic,
    extrinsicError,
    loading,
  } = useXcmApi()

  const currency = useRecoilValue(selectedCurrencyState)
  // const balances = useRecoilValue(balancesState)

  const firstAccountIndex = 0
  const [[senderAccount], senderAccountSelector] = useAccountSelector(
    useRecoilValue(writeableSubstrateAccountsState),
    firstAccountIndex, // default to first user account
    { prefix: validPrefix(sourceChain?.ss58Format) }
  )
  useEffect(() => void setSender(senderAccount?.address), [senderAccount, setSender])

  const chainsByGenesisHash = useAtomValue(loadable(chainsByGenesisHashAtom))
  const balancesLibTokens = useBalancesLibTokens()

  // const routes = useMemo(
  //   () =>
  //     availableRoutes.filter(route => {
  //       switch (senderAccount?.type) {
  //         case 'ethereum':
  //           return isEvmChain(route.from)
  //         case 'ecdsa':
  //         case 'ed25519':
  //         case 'sr25519':
  //           return !isEvmChain(route.from)
  //         case undefined:
  //           return true
  //         default:
  //           throw new Error(`Unknown account type: ${senderAccount?.type ?? 'undefined'}`)
  //       }
  //     }),
  //   [availableRoutes, senderAccount?.type]
  // )

  // const tokenPriceLoadable = useRecoilValueLoadable(
  //   !token?.coingeckoId ? constSelector(undefined) : tokenPriceState({ coingeckoId: token.coingeckoId })
  // )

  // useEffect(() => {
  //   if (sender !== undefined) {
  //     setRecipient(sender)
  //   }
  // }, [sender, setRecipient])

  const [sourceTokenSelectOpen, setSourceTokenSelectOpen] = useState(false)
  const fromTokens = useMemo(() => [], [])
  // const fromTokens = useMemo(
  //   () =>
  //     Array.from(
  //       new Map(
  //         routes
  //           .map(route => {
  //             const token = Object.values(balancesLibTokens).find(
  //               token => token.symbol.toLowerCase() === route.token.toLowerCase()
  //             )
  //             const balance = balances
  //               .find({ address: sender })
  //               .find(
  //                 balance =>
  //                   balance.token?.symbol.toLowerCase() === route.token.toLowerCase() &&
  //                   !!balance.chain &&
  //                   (route.from.paraChainId === -1
  //                     ? balancesLibChains[balance.chain.id]?.paraId === null
  //                     : balancesLibChains[balance.chain.id]?.paraId === route.from.paraChainId)
  //               )

  //             return [
  //               `${route.from.id}-${route.token}`,
  //               {
  //                 id: route.token,
  //                 name: route.token,
  //                 code: route.token,
  //                 chain: route.from.display,
  //                 chainId: route.from.id,
  //                 iconSrc:
  //                   token?.logo ??
  //                   'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/tokens/unknown.svg',
  //                 amount: Decimal.fromPlanck(balance.sum.planck.transferable, balance.each.at(0)?.decimals ?? 0, {
  //                   currency: route.token,
  //                 }).toLocaleString(),
  //                 fiatAmount: balance.sum
  //                   .fiat(currency)
  //                   .transferable.toLocaleString(undefined, { style: 'currency', currency }),
  //                 sortKey: balance.sum.fiat(currency).transferable,
  //               },
  //             ] as const
  //           })
  //           .toSorted((a, b) => b[1].sortKey - a[1].sortKey || a[1].name.localeCompare(b[1].name))
  //       ).values()
  //     ),
  //   [balances, balancesLibChains, balancesLibTokens, currency, routes, sender]
  // )

  const [destTokenSelectOpen, setDestTokenSelectOpen] = useState(false)
  const toTokens = useMemo(() => [], [])
  // const toTokens = useMemo(
  //   () =>
  //     Array.from(
  //       new Map(
  //         routes
  //           .filter(x => x.from.id === route.from.id && x.token === route.token)
  //           .map(route => {
  //             const token = Object.values(balancesLibTokens).find(
  //               token => token.symbol.toLowerCase() === route.token.toLowerCase()
  //             )
  //             const balance = balances
  //               .find({ address: sender })
  //               .find(
  //                 balance =>
  //                   balance.token?.symbol.toLowerCase() === route.token.toLowerCase() &&
  //                   !!balance.chain &&
  //                   (route.to.paraChainId === -1
  //                     ? balancesLibChains[balance.chain.id]?.paraId === null
  //                     : balancesLibChains[balance.chain.id]?.paraId === route.to.paraChainId)
  //               )

  //             return [
  //               `${route.to.id}-${route.token}`,
  //               {
  //                 id: route.token,
  //                 name: route.token,
  //                 code: route.token,
  //                 chain: route.to.display,
  //                 chainId: route.to.id,
  //                 iconSrc:
  //                   token?.logo ??
  //                   'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/tokens/unknown.svg',
  //                 amount: Decimal.fromPlanck(balance.sum.planck.transferable, balance.each.at(0)?.decimals ?? 0, {
  //                   currency: route.token,
  //                 }).toLocaleString(),
  //                 fiatAmount: balance.sum
  //                   .fiat(currency)
  //                   .transferable.toLocaleString(undefined, { style: 'currency', currency }),
  //                 sortKey: balance.sum.fiat(currency).transferable,
  //               },
  //             ] as const
  //           })
  //           .toSorted((a, b) => b[1].sortKey - a[1].sortKey || a[1].name.localeCompare(b[1].name))
  //       ).values()
  //     ),
  //   [balances, balancesLibChains, balancesLibTokens, currency, route.from.id, route.token, routes, sender]
  // )

  // const originChains = useMemo(
  //   () => Array.from(new Map(routes.map(route => [route.from.id, route.from] as const)).values()),
  //   [routes]
  // )

  // const destinationChains = useMemo(
  //   () =>
  //     Array.from(
  //       new Map(
  //         routes
  //           .filter(x => x.from.id === route.from.id && x.token === route.token)
  //           .map(route => [route.to.id, route.from] as const)
  //       ).values()
  //     ),
  //   [route.from.id, route.token, routes]
  // )

  // const [inputConfigLoadable, setInputConfigLoadable] = useState<Loadable<InputConfig>>()
  // useEffect(() => {
  //   if (inputConfigLoadable?.state === 'hasError') {
  //     toast.error('Failed to get transferable amount')
  //     Sentry.captureException(inputConfigLoadable.contents)
  //     console.error(inputConfigLoadable.contents)
  //   }
  // }, [inputConfigLoadable?.contents, inputConfigLoadable?.state])

  // const fiatAmount = useMemo(() => {
  //   const price = undefined // tokenPriceLoadable.valueMaybe()

  //   return price === undefined || decimalAmount === undefined ? undefined : price * decimalAmount.toNumber()
  // }, [decimalAmount])

  // const parsedInputConfigLoadable = useMemo(
  //   () =>
  //     inputConfigLoadable?.map(x => ({
  //       ...x,
  //       estimateFee: fixedPointNumberToDecimal(x.estimateFee.balance, x.estimateFee.token),
  //       minInput: fixedPointNumberToDecimal(x.minInput, route.token),
  //       maxInput: fixedPointNumberToDecimal(x.maxInput, route.token),
  //       destFee: fixedPointNumberToDecimal(x.destFee.balance, x.destFee.token),
  //     })),
  //   [inputConfigLoadable, route.token]
  // )

  // const inputError = useMemo(() => {
  //   if (parsedInputConfigLoadable?.state !== 'hasValue' || decimalAmount === undefined) {
  //     return
  //   }

  //   if (amount === '') {
  //     return
  //   }

  //   if (decimalAmount.planck > parsedInputConfigLoadable.contents.maxInput.planck) {
  //     return `Insufficient balance`
  //   }

  //   if (decimalAmount.planck < parsedInputConfigLoadable.contents.minInput.planck) {
  //     return `Minimum ${parsedInputConfigLoadable.contents.minInput.toLocaleString()}`
  //   }

  //   return undefined
  // }, [amount, decimalAmount, parsedInputConfigLoadable])

  const extrinsic = useExtrinsic(pjsExtrinsic)

  const [focusedSection, setFocusedSection] = useState<'details' | 'faq'>('details')
  useEffect(() => {
    setFocusedSection('details')
  }, [amount /*,route*/])

  // // TODO: Use this to select the destination account (and maybe also the source account?)
  // <SeparatedAccountSelector />

  return (
    <>
      {sourceTokenSelectOpen && (
        <TokenSelectDialog
          assets={tokenPickerSource}
          chains={sourceChains}
          onChange={asset => (setSourceChain(asset.chain.key), setAsset(asset.token.key))}
          onRequestDismiss={() => setSourceTokenSelectOpen(false)}
        />
      )}
      {destTokenSelectOpen && (
        <TokenSelectDialog
          assets={tokenPickerDest}
          chains={destChains}
          onChange={asset => (setDestChain(asset.chain.key), setAsset(asset.token.key))}
          onRequestDismiss={() => setDestTokenSelectOpen(false)}
        />
      )}
      <Form
        amount={amount ?? '0'}
        // fiatAmount={
        //   fiatAmount?.toLocaleString(undefined, { style: 'currency', currency }) ?? (
        //     <CircularProgressIndicator size="1em" />
        //   )
        // }
        availableAmount={
          sourceBalance ? (
            `${sourceBalance.toDecimal()} ${sourceBalance.symbol}`
          ) : (
            <CircularProgressIndicator size="1em" />
          )
        }
        onChangeAmount={setAmount}
        onRequestMaxAmount={requestMax}
        amountError={extrinsicError?.message}
        accountSelect={<div className="[&>div>button]:!rounded-[1.2rem]">{senderAccountSelector}</div>}
        tokenSelect={<TokenSelectButton asset={sourceAsset} onClick={() => setSourceTokenSelectOpen(true)} />}
        destTokenSelect={<TokenSelectButton asset={destAsset} onClick={() => setDestTokenSelectOpen(true)} />}
        reversible={canReverse}
        onRequestReverse={reverseRoute}
        destAccountSelect={
          <>
            <div className="[&>div>button]:!rounded-[1.2rem]">
              <SeparatedAccountSelector
                accountsType={destChain?.usesH160Acc ? 'ethereum' : 'substrate'}
                allowInput
                substrateAccountPrefix={validPrefix(destChain?.ss58Format)}
                substrateAccountsFilter={account => !account.readonly}
                evmAccountsFilter={account => !account.canSignEvm}
                value={recipient}
                // only invoked if a valid address is pasted
                onAccountChange={recipient => setRecipient(recipient ?? undefined)}
                // showBalances={{
                //   // use this to filter out irrelevant assets
                //   filter: selectedAsset
                //     ? balance => balance.tokenId === selectedAsset.id
                //     : undefined,
                //   output: (account, b) => {
                //     // use this to format the output, can be string / jsx
                //     return Decimal.fromPlanck(b.sum.planck.transferable, selectedAsset.decimals, {
                //           currency: selectedAsset.symbol ?? undefined,
                //         }).toLocaleString()
                //   }
                // }}
              />
            </div>
          </>
        }
        canTransport={Boolean(extrinsic)}
        onRequestTransport={() => (extrinsic && sender ? extrinsic.signAndSend(sender) : undefined)}
        transportInProgress={extrinsic?.state === 'loading'}
        loading={loading}
        info={
          <Info
            focusedSection={focusedSection}
            onChangeFocusedSection={setFocusedSection}
            summary={(() => {
              if (extrinsicError)
                return (
                  <ErrorMessage
                    title="Unable to process transfer"
                    text={String(extrinsicError.message ?? extrinsicError)}
                  />
                )
              if (!fees) return <ProgressIndicator />
              return <Fees originFee={fees.sourceFee} destinationFee={fees.destFee} />
            })()}
            faq={<Faq />}
            footer={<Footer />}
          />
        }
      />
    </>
  )
}
