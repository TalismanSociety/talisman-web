import { TokenSelector } from './TokenSelector'
import { toAccountState, toAmountState, useAssetAndChain } from './swap.api'
import { TextInput } from '@talismn/ui'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

export const ToAmount: React.FC<{ assetAndChain: ReturnType<typeof useAssetAndChain> }> = ({ assetAndChain }) => {
  const toAmountLoadable = useRecoilValueLoadable(toAmountState)
  const toAccount = useRecoilValue(toAccountState)

  return (
    <TextInput
      containerClassName="[&>div:nth-child(2)]:!py-[8px] [&>div]:!pr-[8px]"
      leadingLabel="To receive"
      placeholder="0.00"
      inputMode="decimal"
      type="number"
      disabled
      value={toAmountLoadable.state === 'hasValue' ? toAmountLoadable.contents?.toString() ?? '' : ''}
      trailingIcon={
        <TokenSelector
          balanceFor={toAccount?.address ?? null}
          selectedAssetSymbol={assetAndChain.destAssetSymbol}
          selectedAssetChain={assetAndChain.destAssetChain}
          assetFilter={a => {
            if (assetAndChain.srcAssetChain === null) return true
            return a.chain !== assetAndChain.srcAssetChain
          }}
          onSelectToken={token => {
            assetAndChain.setDestAssetSymbol(token?.code ?? null)
            assetAndChain.setDestAssetChain(token?.chainId ?? null)
          }}
        />
      }
    />
  )
}
