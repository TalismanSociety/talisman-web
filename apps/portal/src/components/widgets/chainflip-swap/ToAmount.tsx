import { SuspensedSwapTokenSelector } from './SwapTokenSelector'
import {
  fromAssetAtom,
  toAddressAtom,
  toAssetAtom,
  type CommonSwappableAssetType,
} from './swap-modules/common.swap-module'
import { toAmountAtom } from './swaps.api'
import { TextInput } from '@talismn/ui'
import { useAtom, useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { useCallback } from 'react'

export const ToAmount: React.FC = () => {
  const [toAsset, setToAsset] = useAtom(toAssetAtom)
  const [fromAsset, setFromAsset] = useAtom(fromAssetAtom)
  const toAmountLoadable = useAtomValue(loadable(toAmountAtom))
  const [toAddress] = useAtom(toAddressAtom)

  const handleSelectAsset = useCallback(
    (asset: CommonSwappableAssetType | null) => {
      if (fromAsset && fromAsset.id === asset?.id) setFromAsset(toAsset)
      setToAsset(asset)
    },
    [fromAsset, setFromAsset, setToAsset, toAsset]
  )

  return (
    <TextInput
      containerClassName="[&>div:nth-child(2)]:!py-[8px] [&>div]:!pr-[8px]"
      leadingLabel="To receive"
      placeholder="0.00"
      inputMode="decimal"
      type="number"
      disabled
      value={toAmountLoadable.state === 'hasData' ? toAmountLoadable.data?.toString() ?? '' : ''}
      trailingIcon={
        <SuspensedSwapTokenSelector
          balanceFor={toAddress ?? null}
          onSelectAsset={handleSelectAsset}
          selectedAsset={toAsset}
        />
      }
    />
  )
}
