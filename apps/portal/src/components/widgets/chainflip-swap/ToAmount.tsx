import { SuspensedTokenSelector } from './TokenSelector'
import {
  fromAssetAtom,
  toAddressAtom,
  toAssetAtom,
  type CommonSwappableAssetType,
} from './swap-modules/common.swap-module'
import { toAmountAtom } from './swaps.api'
import { evmSignableAccountsState } from '@/domains/accounts'
import { useTokens } from '@talismn/balances-react'
import { TextInput } from '@talismn/ui'
import { useAtom, useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'

export const ToAmount: React.FC = () => {
  const [toAsset, setToAsset] = useAtom(toAssetAtom)
  const [fromAsset, setFromAsset] = useAtom(fromAssetAtom)
  const toAmountLoadable = useAtomValue(loadable(toAmountAtom))
  const [toAddress, setToAddress] = useAtom(toAddressAtom)
  const tokens = useTokens()
  const evmAccounts = useRecoilValue(evmSignableAccountsState)

  const handleSelectAsset = useCallback(
    (asset: CommonSwappableAssetType | null) => {
      if (fromAsset && fromAsset.id === asset?.id) setFromAsset(toAsset)
      setToAsset(asset)

      if (asset) {
        const token = tokens[asset.id]
        const evmAccount = evmAccounts[0]
        if (
          token &&
          (token.type === 'evm-erc20' || token.type === 'evm-native' || token.type === 'evm-uniswapv2') &&
          !toAddress &&
          evmAccount
        ) {
          setToAddress(evmAccount.address)
        }
      }
    },
    [evmAccounts, fromAsset, setFromAsset, setToAddress, setToAsset, toAddress, toAsset, tokens]
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
        <SuspensedTokenSelector
          balanceFor={toAddress ?? null}
          onSelectAsset={handleSelectAsset}
          selectedAsset={toAsset}
        />
      }
    />
  )
}
