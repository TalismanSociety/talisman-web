import { SuspensedSwapTokenSelector } from './SwapTokenSelector'
import {
  fromAssetAtom,
  toAddressAtom,
  toAssetAtom,
  type CommonSwappableAssetType,
} from './swap-modules/common.swap-module'
import { toAmountAtom } from './swaps.api'
import { writeableEvmAccountsState, writeableSubstrateAccountsState } from '@/domains/accounts'
import { selectedCurrencyState } from '@/domains/balances'
import { useTokenRates } from '@talismn/balances-react'
import { TextInput } from '@talismn/ui'
import { useAtom, useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

export const ToAmount: React.FC = () => {
  const [toAsset, setToAsset] = useAtom(toAssetAtom)
  const [fromAsset, setFromAsset] = useAtom(fromAssetAtom)
  const toAmountLoadable = useAtomValue(loadable(toAmountAtom))
  const evmAccounts = useRecoilValue(writeableEvmAccountsState)
  const substrateAccounts = useRecoilValue(writeableSubstrateAccountsState)
  const [toAddress] = useAtom(toAddressAtom)
  const rates = useTokenRates()
  const currency = useRecoilValue(selectedCurrencyState)
  const handleSelectAsset = useCallback(
    (asset: CommonSwappableAssetType | null) => {
      if (fromAsset && fromAsset.id === asset?.id) setFromAsset(toAsset)
      setToAsset(asset)
    },
    [fromAsset, setFromAsset, setToAsset, toAsset]
  )

  const usdValue = useMemo(() => {
    if (!toAsset || toAmountLoadable.state !== 'hasData' || !toAmountLoadable.data) return null
    const rate = rates[toAsset.id]
    if (!rate) return null
    const rateInCurrency = rate[currency]
    if (!rateInCurrency) return null
    return +toAmountLoadable.data.toString() * rateInCurrency
  }, [currency, toAsset, rates, toAmountLoadable])

  return (
    <TextInput
      className="!text-[18px] !font-semibold"
      containerClassName="[&>div:nth-child(2)]:!py-[8px] [&>div]:!pr-[8px]"
      leadingLabel="To receive"
      placeholder="0.00"
      inputMode="decimal"
      type="number"
      disabled
      value={toAmountLoadable.state === 'hasData' ? toAmountLoadable.data?.toString() ?? '' : ''}
      textBelowInput={
        <p className="text-gray-400 text-[10px] leading-none">
          {(usdValue ?? 0)?.toLocaleString(undefined, { currency, style: 'currency' })}
        </p>
      }
      trailingIcon={
        <SuspensedSwapTokenSelector
          balanceFor={{
            evm: toAddress?.startsWith('0x') ? toAddress : evmAccounts[0]?.address,
            substrate: !toAddress || toAddress.startsWith('0x') ? substrateAccounts[0]?.address : toAddress,
          }}
          onSelectAsset={handleSelectAsset}
          selectedAsset={toAsset}
          assetFilter={asset => {
            if (!fromAsset) return true
            if (fromAsset.chainId === 'polkadot') return asset.chainId !== 'polkadot'
            return asset.chainId === 'polkadot'
          }}
        />
      }
    />
  )
}
