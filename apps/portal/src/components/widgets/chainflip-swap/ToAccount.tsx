import { toAddressState, useAssetAndChain } from './api'
import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import { cn } from '@/lib/utils'
import { Decimal } from '@talismn/math'
import { Surface } from '@talismn/ui'
import type React from 'react'
import { useRecoilState } from 'recoil'

export const ToAccount: React.FC<{ assetAndChain: ReturnType<typeof useAssetAndChain> }> = ({ assetAndChain }) => {
  const [toAddess, setToAddress] = useRecoilState(toAddressState)

  return (
    <Surface className="bg-card p-[16px] rounded-[8px] w-full">
      <h4 className="text-[16px] font-semibold">To Account</h4>
      <SeparatedAccountSelector
        accountsType={
          !assetAndChain.srcAssetChain ? 'all' : assetAndChain.srcAssetChain === 'Ethereum' ? 'substrate' : 'ethereum'
        }
        substrateAccountsFilter={a => !a.readonly}
        value={toAddess}
        onAccountChange={setToAddress}
        showBalances={{
          // if from asset is not seleted, we return the sum of all balances for that account
          filter: assetAndChain.toAssetJson
            ? balance => {
                // find the balance for the selected from asset
                const chainMatch =
                  assetAndChain.toAssetJson?.chain.chain === balance.chain?.chainName ||
                  assetAndChain.toAssetJson?.chain.evmChainId?.toString() === balance.evmNetworkId?.toString()

                if (assetAndChain.destAssetSymbol && chainMatch)
                  return balance.token.symbol === assetAndChain.destAssetSymbol
                return chainMatch
              }
            : undefined,
          output: b => {
            if (!assetAndChain.toAssetJson) {
              return (
                <p className="text-[14px] text-gray-400 whitespace-nowrap">
                  $
                  {b.sum
                    .fiat('usd')
                    .transferable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )
            }
            const loading = b.each.find(b => b.status !== 'live')
            return (
              <p className={cn('text-[14px] text-gray-400 whitespace-nowrap', { 'animate-pulse': loading })}>
                {Decimal.fromPlanck(b.sum.planck.total, assetAndChain.toAssetJson.decimals, {
                  currency: assetAndChain.destAssetSymbol ?? undefined,
                }).toLocaleString(undefined, {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                })}
              </p>
            )
          },
        }}
      />
    </Surface>
  )
}
