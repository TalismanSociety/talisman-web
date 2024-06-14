import { TokenSelector } from './TokenSelector'
import { fromAccountState, fromAddressState, fromAmountInputState, useAssetAndChain } from './api'
import { Decimal } from '@talismn/math'
import { TextInput } from '@talismn/ui'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export const FromAmount: React.FC<{
  assetAndChain: ReturnType<typeof useAssetAndChain>
  availableBalance: Decimal | null
}> = ({ assetAndChain, availableBalance }) => {
  const [fromAmountInput, setFromAmountInput] = useRecoilState(fromAmountInputState)
  const fromAccount = useRecoilValue(fromAccountState)
  const setFromAddress = useSetRecoilState(fromAddressState)

  return (
    <TextInput
      leadingLabel="You're paying"
      trailingLabel={
        availableBalance
          ? `Balance: ${availableBalance.toLocaleString(undefined, {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}`
          : null
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
          {availableBalance && (
            <TextInput.LabelButton
              css={{ fontSize: 12, paddingTop: 4, paddingBottom: 4 }}
              onClick={() => {
                setFromAmountInput(availableBalance.toString())
              }}
            >
              <p css={{ fontSize: 12, lineHeight: 1 }}>Max</p>
            </TextInput.LabelButton>
          )}
          <TokenSelector
            balanceFor={fromAccount?.address ?? null}
            selectedAssetSymbol={assetAndChain.srcAssetSymbol}
            selectedAssetChain={assetAndChain.srcAssetChain}
            onSelectToken={token => {
              if (!token) {
                assetAndChain.setSrcAssetSymbol(null)
                assetAndChain.setSrcAssetChain(null)

                return
              }
              assetAndChain.setSrcAssetSymbol(token.code)
              assetAndChain.setSrcAssetChain(token.chainId)

              if (fromAccount) {
                if (
                  (token.chain === 'Ethereum' && fromAccount.type !== 'ethereum') ||
                  (token.chain === 'Polkadot' && fromAccount.type === 'ethereum')
                ) {
                  setFromAddress(null)
                }
              }

              if (token.chain === assetAndChain.destAssetChain) {
                assetAndChain.setDestAssetChain(assetAndChain.srcAssetChain)
                assetAndChain.setDestAssetSymbol(assetAndChain.srcAssetSymbol)
              }
            }}
          />
        </div>
      }
    />
  )
}
