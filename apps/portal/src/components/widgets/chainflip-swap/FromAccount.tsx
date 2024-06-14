import { fromAddressState, useAssetAndChain } from './api'
import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import { cn } from '@/lib/utils'
import { Decimal } from '@talismn/math'
import { Surface } from '@talismn/ui'
import type React from 'react'
import { useRecoilState } from 'recoil'

export const FromAccount: React.FC<{ assetAndChain: ReturnType<typeof useAssetAndChain> }> = ({ assetAndChain }) => {
  const [fromAddress, setFromAddress] = useRecoilState(fromAddressState)

  return (
    <Surface className="bg-card p-[16px] rounded-[8px] w-full">
      <h4 className="text-[16px] font-semibold">From Account</h4>
      <SeparatedAccountSelector
        accountsType={
          !assetAndChain.srcAssetChain ? 'all' : assetAndChain.srcAssetChain === 'Ethereum' ? 'ethereum' : 'substrate'
        }
        substrateAccountsFilter={a => !a.readonly}
        value={fromAddress}
        onAccountChange={setFromAddress}
        showBalances={{
          // if from asset is not seleted, we return the sum of all balances for that account
          filter: assetAndChain.fromAssetJson
            ? balance => {
                // find the balance for the selected from asset
                const chainMatch =
                  assetAndChain.fromAssetJson?.chain.chain === balance.chain?.chainName ||
                  assetAndChain.fromAssetJson?.chain.evmChainId?.toString() === balance.evmNetworkId?.toString()

                if (assetAndChain.srcAssetSymbol && chainMatch)
                  return balance.token.symbol === assetAndChain.srcAssetSymbol
                return chainMatch
              }
            : undefined,
          output: b => {
            if (!assetAndChain.fromAssetJson) {
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
                {Decimal.fromPlanck(b.sum.planck.transferable, assetAndChain.fromAssetJson.decimals, {
                  currency: assetAndChain.srcAssetSymbol ?? undefined,
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
