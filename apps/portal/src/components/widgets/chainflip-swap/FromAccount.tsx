import { fromAssetAtom } from './swap-modules/common.swap-module'
import { fromAddressState } from './swap.api'
import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import { selectedCurrencyState } from '@/domains/balances'
import { cn } from '@/lib/utils'
import { useTokens } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { Surface } from '@talismn/ui'
import { useAtomValue } from 'jotai'
import type React from 'react'
import { useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

export const FromAccount: React.FC = () => {
  const fromAsset = useAtomValue(fromAssetAtom)
  const [fromAddress, setFromAddress] = useRecoilState(fromAddressState)
  const currency = useRecoilValue(selectedCurrencyState)

  const tokens = useTokens()
  const token = useMemo(() => {
    if (!fromAsset) return null
    return tokens[fromAsset.id]
  }, [fromAsset, tokens])

  return (
    <Surface className="bg-card p-[16px] rounded-[8px] w-full">
      <h4 className={cn('text-[16px]', fromAsset ? 'font-semibold' : 'text-gray-500')}>From Account</h4>
      {!!fromAsset && (
        <SeparatedAccountSelector
          accountsType={
            !token
              ? 'all'
              : token.type === 'evm-erc20' || token.type === 'evm-native' || token.type === 'evm-uniswapv2'
              ? 'ethereum'
              : 'substrate'
          }
          substrateAccountPrefix={0}
          substrateAccountsFilter={a => !a.readonly}
          evmAccountsFilter={a => !!a.canSignEvm}
          value={fromAddress}
          onAccountChange={setFromAddress}
          showBalances={{
            // if from asset is not seleted, we return the sum of all balances for that account
            filter: fromAsset
              ? // find the balance for the selected from asset
                balance => balance.tokenId === fromAsset.id
              : undefined,
            output: b => {
              if (!fromAsset) {
                return (
                  <p className="text-[14px] text-gray-400 whitespace-nowrap">
                    {b.sum.fiat(currency).transferable.toLocaleString(undefined, {
                      currency,
                      style: 'currency',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                )
              }
              const loading = b.each.find(b => b.status !== 'live') !== undefined

              return (
                <p className={cn('text-[14px] text-gray-400 whitespace-nowrap', { 'animate-pulse': loading })}>
                  {Decimal.fromPlanck(b.sum.planck.transferable, fromAsset.decimals, {
                    currency: fromAsset.symbol ?? undefined,
                  }).toLocaleString()}
                </p>
              )
            },
          }}
        />
      )}
    </Surface>
  )
}
