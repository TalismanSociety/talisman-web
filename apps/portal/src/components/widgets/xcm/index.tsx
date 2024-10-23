// import { chainsByGenesisHashAtom, useTokens as useBalancesLibTokens } from '@talismn/balances-react'
import { Tooltip } from '@talismn/ui'
import { formatDecimals } from '@talismn/util'
// import { useAtomValue } from 'jotai'
// import { loadable } from 'jotai/utils'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { isAddress as isEvmAddress } from 'viem'

import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import AccountSelector from '@/components/widgets/AccountSelector'
import { writeableAccountsState } from '@/domains/accounts'
// import { selectedCurrencyState } from '@/domains/balances'
// import { tokenPriceState } from '@/domains/chains'
import { useExtrinsic, useSetJotaiSubstrateApiState } from '@/domains/common'

import { useXcmApi } from './api'
import { toPreciseDecimals } from './api/utils/toPreciseDecimals'
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
    // asset,
    setAsset,
    amount,
    setAmount,
    requestMax,

    tokenPickerSourceBySender,
    tokenPickerDest,
    sourceChainsBySender,
    destChains,
    sourceAsset,
    destAsset,
    canReverse,
    reverseRoute,

    sourceBalance,
    fees,
    minMaxAmounts,
    extrinsic: pjsExtrinsic,
    extrinsicError,
    loading,
  } = useXcmApi()

  const extrinsic = useExtrinsic(pjsExtrinsic)

  // select first account on mount
  const validSenders = useRecoilValue(writeableAccountsState)
  useEffect(() => {
    const firstSubSender = validSenders.find(({ address }) => !isEvmAddress(address))?.address
    const firstSender = firstSubSender ?? validSenders[0]?.address
    setSender(firstSender)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [sourceTokenSelectOpen, setSourceTokenSelectOpen] = useState(false)
  const [destTokenSelectOpen, setDestTokenSelectOpen] = useState(false)

  // reset back to details focus when sourceChain, destChain or amount is changed
  const [focusedSection, setFocusedSection] = useState<'details' | 'faq'>('details')
  useEffect(() => void setFocusedSection('details'), [sourceChain, destChain, amount])

  // TODO
  // const currency = useRecoilValue(selectedCurrencyState)
  // const chainsByGenesisHash = useAtomValue(loadable(chainsByGenesisHashAtom))
  // const balancesLibTokens = useBalancesLibTokens()
  // const tokenPriceLoadable = useRecoilValueLoadable(
  //   !token?.coingeckoId ? constSelector(undefined) : tokenPriceState({ coingeckoId: token.coingeckoId })
  // )
  // const fiatAmount = useMemo(() => {
  //   const price = undefined // tokenPriceLoadable.valueMaybe()
  //   return price === undefined || decimalAmount === undefined ? undefined : price * decimalAmount.toNumber()
  // }, [decimalAmount])

  const details = extrinsicError ? (
    <ErrorMessage title="Unable to process transfer" text={String(extrinsicError.message ?? extrinsicError)} />
  ) : fees ? (
    <Fees originFee={fees.sourceFee} destinationFee={fees.destFee} />
  ) : (
    <ProgressIndicator />
  )

  return (
    <>
      {sourceTokenSelectOpen && (
        <TokenSelectDialog
          assets={tokenPickerSourceBySender}
          chains={sourceChainsBySender}
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
        amount={amount}
        // fiat={
        //   fiatAmount?.toLocaleString(undefined, { style: 'currency', currency }) ?? (
        //     <CircularProgressIndicator size="1em" />
        //   )
        // }
        available={
          sourceBalance ? (
            <Tooltip content={`${toPreciseDecimals(sourceBalance)} ${sourceBalance.symbol}`}>
              <span className="text-foreground shrink-0">
                {formatDecimals(toPreciseDecimals(sourceBalance))}&nbsp;{sourceBalance.symbol}
              </span>
            </Tooltip>
          ) : undefined
        }
        max={
          minMaxAmounts?.max && sourceBalance?.amount !== minMaxAmounts.max.amount ? (
            <Tooltip content={`${toPreciseDecimals(minMaxAmounts.max)} ${minMaxAmounts.max.symbol} after fees`}>
              <span className="shrink-0">
                ({formatDecimals(toPreciseDecimals(minMaxAmounts.max))}&nbsp;{minMaxAmounts.max.symbol} after fees)
              </span>
            </Tooltip>
          ) : undefined
        }
        onChangeAmount={setAmount}
        onRequestMaxAmount={requestMax}
        amountError={extrinsicError?.message}
        accountSelect={
          <div className="[&>div>button]:!rounded-[1.2rem]">
            <AccountSelector
              accounts={validSenders}
              prefix={validPrefix(sourceChain?.ss58Format)}
              selectedAccount={sender}
              onChangeSelectedAccount={account => setSender(account?.address)}
            />
          </div>
        }
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
            details={details}
            faq={<Faq />}
            footer={<Footer />}
          />
        }
      />
    </>
  )
}
