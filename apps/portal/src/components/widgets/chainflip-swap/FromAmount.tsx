import { SuspensedSwapTokenSelector } from './SwapTokenSelector'
import {
  fromAddressAtom,
  fromAmountInputAtom,
  fromAssetAtom,
  toAssetAtom,
  type CommonSwappableAssetType,
} from './swap-modules/common.swap-module'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator, TextInput } from '@talismn/ui'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback } from 'react'

export const FromAmount: React.FC<{
  // NOTE: we get this as a prop so we dont have to get this balance twice. The parent component also needs this to
  // check whether user has enough balance to swap
  availableBalance: { balance: Decimal; loading: boolean } | null
}> = ({ availableBalance }) => {
  const [fromAmountInput, setFromAmountInput] = useAtom(fromAmountInputAtom)
  const [fromAsset, setFromAsset] = useAtom(fromAssetAtom)
  const [toAsset, setToAsset] = useAtom(toAssetAtom)
  const fromAddress = useAtomValue(fromAddressAtom)

  const handleSelectAsset = useCallback(
    (asset: CommonSwappableAssetType | null) => {
      if (toAsset) {
        // reverse
        if (toAsset.id === asset?.id) setToAsset(fromAsset)
      }
      setFromAsset(asset)
    },
    [fromAsset, setFromAsset, setToAsset, toAsset]
  )

  return (
    <TextInput
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
      placeholder="0.00"
      className="text-ellipsis"
      containerClassName="[&>div:nth-child(2)]:!py-[8px] [&>div]:!pr-[8px]"
      value={fromAmountInput}
      onChangeText={setFromAmountInput}
      inputMode="decimal"
      type="number"
      trailingIcon={
        <div className="flex items-center gap-[8px] justify-end">
          {availableBalance && !availableBalance.loading && (
            <TextInput.LabelButton
              css={{ fontSize: 12, paddingTop: 4, paddingBottom: 4 }}
              onClick={() => setFromAmountInput(availableBalance.balance.toString())}
            >
              <p css={{ fontSize: 12, lineHeight: 1 }}>Max</p>
            </TextInput.LabelButton>
          )}
          <SuspensedSwapTokenSelector
            balanceFor={fromAddress ?? null}
            onSelectAsset={handleSelectAsset}
            selectedAsset={fromAsset}
          />
        </div>
      }
    />
  )
}
