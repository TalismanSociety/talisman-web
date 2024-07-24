import { fromAddressAtom, fromAssetAtom, toAddressAtom } from './swap-modules/common.swap-module'
import { selectCustomAddressAtom } from './swaps.api'
import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import { selectedCurrencyState } from '@/domains/balances'
import { cn } from '@/lib/utils'
import { useTokens } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { Surface } from '@talismn/ui'
import { useAtom, useAtomValue } from 'jotai'
import type React from 'react'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

type Props = {
  fastBalance?: {
    amount: Decimal
    chainId: number | string
  }
}
export const FromAccount: React.FC<Props> = ({ fastBalance }) => {
  const fromAsset = useAtomValue(fromAssetAtom)
  const [fromAddress, setFromAddress] = useAtom(fromAddressAtom)
  const [toAddress, setToAddress] = useAtom(toAddressAtom)
  const currency = useRecoilValue(selectedCurrencyState)
  const [selectCustomAddress, setSelectCustomAddress] = useAtom(selectCustomAddressAtom)

  const tokens = useTokens()
  const token = useMemo(() => {
    if (!fromAsset) return null
    return tokens[fromAsset.id]
  }, [fromAsset, tokens])

  return (
    <Surface className="bg-card p-[16px] rounded-[8px] w-full">
      <div className="flex items-center justify-between">
        <h4 className={cn('text-[16px]', fromAsset ? 'font-semibold' : 'text-gray-500')}>Swapping From</h4>
        {!selectCustomAddress && !!fromAddress && fromAddress.toLowerCase() === toAddress?.toLowerCase() && (
          <p
            className="text-primary text-[14px] font-medium cursor-pointer hover:text-primary/70"
            onClick={() => {
              setSelectCustomAddress(true)
              setToAddress(null)
            }}
          >
            Send to another address
          </p>
        )}
      </div>
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
            output: (account, b) => {
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

              if (fastBalance && fromAddress) {
                if (
                  fromAsset.symbol.toLowerCase() === fastBalance.amount.options?.currency?.toLowerCase() &&
                  `${fromAsset.chainId}`.toLowerCase() === `${fastBalance.chainId}`.toLowerCase() &&
                  account.toLowerCase() === fromAddress.toLowerCase()
                ) {
                  return (
                    <p className="text-[14px] text-gray-400 whitespace-nowrap">{fastBalance.amount.toLocaleString()}</p>
                  )
                }
              }

              const loading = b.each.find(b => b.status !== 'live') !== undefined || b.count === 0

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
