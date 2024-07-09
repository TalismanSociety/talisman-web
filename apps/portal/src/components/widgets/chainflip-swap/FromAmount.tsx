import { SuspensedSwapTokenSelector } from './SwapTokenSelector'
import {
  fromAddressAtom,
  fromAmountAtom,
  fromAmountInputAtom,
  fromAssetAtom,
  toAssetAtom,
  type CommonSwappableAssetType,
} from './swap-modules/common.swap-module'
import { writeableEvmAccountsState, writeableSubstrateAccountsState } from '@/domains/accounts'
import { selectedCurrencyState } from '@/domains/balances'
import { cn } from '@/lib/utils'
import { useTokenRates } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator, TextInput } from '@talismn/ui'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

export const FromAmount: React.FC<{
  // NOTE: we get this as a prop so we dont have to get this balance twice. The parent component also needs this to
  // check whether user has enough balance to swap
  availableBalance: { balance: Decimal; loading: boolean } | null
  wouldReapAccount?: boolean
  insufficientBalance?: boolean
}> = ({ availableBalance, insufficientBalance }) => {
  const [fromAmountInput, setFromAmountInput] = useAtom(fromAmountInputAtom)
  const [fromAsset, setFromAsset] = useAtom(fromAssetAtom)
  const [toAsset, setToAsset] = useAtom(toAssetAtom)
  const fromAddress = useAtomValue(fromAddressAtom)
  const evmAccounts = useRecoilValue(writeableEvmAccountsState)
  const substrateAccounts = useRecoilValue(writeableSubstrateAccountsState)
  const fromAmount = useAtomValue(fromAmountAtom)
  const rates = useTokenRates()
  const currency = useRecoilValue(selectedCurrencyState)
  const handleSelectAsset = useCallback(
    (asset: CommonSwappableAssetType | null) => {
      // reverse
      if (toAsset) if (toAsset.id === asset?.id) setToAsset(fromAsset)
      if (fromAsset) setFromAmountInput('')
      setFromAsset(asset)
    },
    [fromAsset, setFromAmountInput, setFromAsset, setToAsset, toAsset]
  )

  const usdValue = useMemo(() => {
    if (!fromAsset) return null
    const rate = rates[fromAsset.id]
    if (!rate) return null
    const rateInCurrency = rate[currency]
    if (!rateInCurrency) return null
    return +fromAmount.toString() * rateInCurrency
  }, [currency, fromAmount, fromAsset, rates])

  return (
    <TextInput
      autoComplete="off"
      leadingLabel="You're paying"
      trailingLabel={
        availableBalance ? (
          availableBalance.loading ? (
            <CircularProgressIndicator size={12} />
          ) : (
            `Balance: ${availableBalance.balance.toLocaleString()}`
          )
        ) : null
      }
      textBelowInput={
        <div className="flex">
          <p className="text-gray-400 text-[10px] leading-none">
            {(usdValue ?? 0)?.toLocaleString(undefined, { currency, style: 'currency' })}
          </p>
          {insufficientBalance ? (
            <p className="text-red-400 text-[10px] leading-none pl-[8px] ml-[8px] border-l border-l-gray-600">
              Insufficient balance
            </p>
          ) : null}
        </div>
      }
      placeholder="0.00"
      className="text-ellipsis !text-[18px] !font-semibold"
      containerClassName={cn(
        '[&>div:nth-child(2)]:!py-[8px] [&>div]:!pr-[8px] [&>div:nth-child(2)]:border [&>div:nth-child(2)]:border-red-500/0',
        {
          '[&>div:nth-child(2)]:border-red-400 ': insufficientBalance,
        }
      )}
      value={fromAmountInput}
      onChangeText={setFromAmountInput}
      inputMode="decimal"
      type="number"
      trailingIcon={
        <div className="flex items-center gap-[8px] justify-end">
          {availableBalance && !availableBalance.loading && (
            <TextInput.LabelButton
              css={{ fontSize: 12, paddingTop: 4, paddingBottom: 4 }}
              onClick={() =>
                setFromAmountInput(
                  Decimal.fromPlanck(availableBalance.balance.planck, availableBalance.balance.decimals).toString()
                )
              }
            >
              <p css={{ fontSize: 12, lineHeight: 1 }}>Max</p>
            </TextInput.LabelButton>
          )}
          <SuspensedSwapTokenSelector
            balanceFor={{
              evm: fromAddress?.startsWith('0x') ? fromAddress : evmAccounts[0]?.address,
              substrate: !fromAddress || fromAddress.startsWith('0x') ? substrateAccounts[0]?.address : fromAddress,
            }}
            onSelectAsset={handleSelectAsset}
            selectedAsset={fromAsset}
          />
        </div>
      }
    />
  )
}
