import { CircularProgressIndicator, Tooltip } from '@talismn/ui'
import { formatDecimals } from '@talismn/util'
import { useEffect, useMemo, useState } from 'react'
import { constSelector, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { isAddress as isEvmAddress } from 'viem'

import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import AccountSelector from '@/components/widgets/AccountSelector'
import { writeableAccountsState } from '@/domains/accounts'
import { selectedCurrencyState } from '@/domains/balances'
import { tokenPriceState } from '@/domains/chains'
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
    asset,
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

    hasWallet,
    hasTransfer,
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
  const [hasSetFirstSender, setHasSetFirstSender] = useState(false)
  useEffect(() => {
    if (!validSenders.length) return
    if (hasSetFirstSender) return

    const firstSubSender = validSenders.find(({ address }) => !isEvmAddress(address))?.address
    const firstSender = firstSubSender ?? validSenders[0]?.address

    setSender(firstSender)
    setHasSetFirstSender(true)
  }, [hasSetFirstSender, sender, setSender, validSenders])

  const [sourceTokenSelectOpen, setSourceTokenSelectOpen] = useState(false)
  const [destTokenSelectOpen, setDestTokenSelectOpen] = useState(false)

  // reset back to details focus when sourceChain, destChain or amount is changed
  const [focusedSection, setFocusedSection] = useState<'details' | 'faq'>('details')
  useEffect(() => void setFocusedSection('details'), [sourceChain, destChain, amount])

  // get the fiat value of the selected asset
  const currency = useRecoilValue(selectedCurrencyState)
  const assetPriceLoadable = useRecoilValueLoadable(
    sourceAsset?.chaindataCoingeckoId
      ? tokenPriceState({ coingeckoId: sourceAsset.chaindataCoingeckoId })
      : constSelector(undefined)
  )
  const fiat = useMemo(() => {
    const price = assetPriceLoadable.valueMaybe()
    return typeof price === 'number' && typeof amount === 'string' && amount.length > 0
      ? (price * parseFloat(amount)).toLocaleString(undefined, { style: 'currency', currency })
      : undefined
  }, [amount, assetPriceLoadable, currency])

  const details = extrinsicError ? (
    <ErrorMessage title="Unable to process transfer" text={String(extrinsicError.message ?? extrinsicError)} />
  ) : fees ? (
    <Fees originFee={fees.sourceFee} destinationFee={fees.destFee} />
  ) : sender && sourceChain && destChain && asset ? (
    <ProgressIndicator
      title="Preparing transfer"
      text={!hasWallet ? `Connecting to ${sourceAsset?.chain?.name}` : !hasTransfer ? 'Calculating fees' : 'Loading'}
    />
  ) : (
    <ErrorMessage title="Select asset" text="To calculate transfer fees" />
  )

  return (
    <>
      {sourceTokenSelectOpen && (
        <TokenSelectDialog
          title={
            <div>
              Select <span className="italic">from</span> asset
            </div>
          }
          assets={tokenPickerSourceBySender}
          chains={sourceChainsBySender}
          onChange={asset => (setSourceChain(asset.chain.key), setAsset(asset.token.key))}
          onRequestDismiss={() => setSourceTokenSelectOpen(false)}
        />
      )}
      {destTokenSelectOpen && (
        <TokenSelectDialog
          title={
            <div>
              Select <span className="italic">to</span> asset
            </div>
          }
          assets={tokenPickerDest}
          chains={destChains}
          onChange={asset => (setDestChain(asset.chain.key), setAsset(asset.token.key))}
          onRequestDismiss={() => setDestTokenSelectOpen(false)}
        />
      )}
      <Form
        empty={!sourceChain || !destChain}
        amount={amount}
        fiat={
          fiat ??
          (typeof amount === 'number' && sourceAsset?.chaindataCoingeckoId ? (
            <CircularProgressIndicator size="1em" />
          ) : undefined)
        }
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
        tokenSelect={
          <TokenSelectButton
            title={
              <div>
                Select <span className="italic">from</span> asset
              </div>
            }
            empty={!sourceChain}
            asset={sourceAsset}
            onClick={() => setSourceTokenSelectOpen(true)}
          />
        }
        destTokenSelect={
          <TokenSelectButton
            title={
              <div>
                Select <span className="italic">to</span> asset
              </div>
            }
            empty={!destChain}
            asset={destAsset}
            onClick={() => setDestTokenSelectOpen(true)}
          />
        }
        reversible={canReverse}
        onRequestReverse={reverseRoute}
        destAccountSelect={
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
            />
          </div>
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
