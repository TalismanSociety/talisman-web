import { ToAccount } from './ToAccount'
import {
  fromAddressAtom,
  fromAssetAtom,
  fromEvmAddressAtom,
  fromSubstrateAddressAtom,
  toAddressAtom,
  toAssetAtom,
  toEvmAddressAtom,
  toSubstrateAddressAtom,
} from './swap-modules/common.swap-module'
import { SeparatedAccountSelector } from '@/components/SeparatedAccountSelector'
import { selectedCurrencyState } from '@/domains/balances'
import { cn } from '@/lib/utils'
import { Decimal } from '@talismn/math'
import { Surface } from '@talismn/ui'
import { Wallet } from '@talismn/web-icons'
import { useAtom, useAtomValue } from 'jotai'
import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { isAddress } from 'viem'

type Props = {
  fastBalance?: {
    amount: Decimal
    chainId: number | string
  }
}
export const FromAccount: React.FC<Props> = ({ fastBalance }) => {
  const fromAsset = useAtomValue(fromAssetAtom)
  const [fromEvmAddress, setFromEvmAddress] = useAtom(fromEvmAddressAtom)
  const [fromSubstrateAddress, setFromSubstrateAddress] = useAtom(fromSubstrateAddressAtom)
  const fromAddress = useAtomValue(fromAddressAtom)
  const toAddress = useAtomValue(toAddressAtom)
  const toAsset = useAtomValue(toAssetAtom)
  const currency = useRecoilValue(selectedCurrencyState)
  const [toEvmAddress, setToEvmAddress] = useAtom(toEvmAddressAtom)
  const [toSubstrateAddress, setToSubstrateAddress] = useAtom(toSubstrateAddressAtom)

  const onChangeAddress = useCallback(
    (address: string | null) => {
      if (!address) return
      if (isAddress(address)) {
        if (fromEvmAddress === toEvmAddress) setToEvmAddress(address)
        setFromEvmAddress(address)
      } else {
        if (fromSubstrateAddress === toSubstrateAddress) setToSubstrateAddress(address)
        setFromSubstrateAddress(address)
      }
    },
    [
      fromEvmAddress,
      fromSubstrateAddress,
      setFromEvmAddress,
      setFromSubstrateAddress,
      setToEvmAddress,
      setToSubstrateAddress,
      toEvmAddress,
      toSubstrateAddress,
    ]
  )

  const isSwappingFromBtc = useMemo(() => {
    return fromAsset?.id === 'btc-native'
  }, [fromAsset])

  const shouldShowToAccount = useMemo(() => {
    if (!fromAsset || !toAsset || isSwappingFromBtc) return false
    if (fromAsset.networkType !== toAsset.networkType) return true
    return toAddress?.toLowerCase() !== fromAddress?.toLowerCase()
  }, [fromAddress, fromAsset, isSwappingFromBtc, toAddress, toAsset])

  return (
    <Surface className="bg-card p-[16px] rounded-[8px] w-full flex flex-col gap-[12px]">
      <div className="flex items-center justify-between">
        <h4 className={cn('text-[16px]', fromAsset ? 'font-semibold' : 'text-gray-500')}>Swapping From</h4>
        <div
          className={cn('flex items-center gap-[8px]', {
            'text-primary': shouldShowToAccount,
            'text-gray-500': !shouldShowToAccount,
            'cursor-pointer hover:opacity-70':
              toAddress?.toLowerCase() !== fromAddress?.toLowerCase() &&
              fromAsset?.networkType === toAsset?.networkType,
            'cursor-pointer hover:text-primary':
              fromAsset?.networkType === toAsset?.networkType &&
              toAsset &&
              fromAsset &&
              toAddress?.toLowerCase() === fromAddress?.toLowerCase(),
          })}
          onClick={() => {
            if (fromAsset?.networkType !== toAsset?.networkType) return

            if (shouldShowToAccount) {
              setToEvmAddress(fromEvmAddress)
              setToSubstrateAddress(fromSubstrateAddress)
            } else {
              setToEvmAddress(null)
              setToSubstrateAddress(null)
            }
          }}
        >
          <Wallet className="w-[16px] h-[16px]" />
          <p className="text-[14px] font-medium">Destination</p>
        </div>
      </div>
      {!!fromAsset && !isSwappingFromBtc && (
        <div>
          <p className="text-[14px] text-gray-500">Origin Account</p>
          <SeparatedAccountSelector
            accountsType={
              fromAsset.id === 'btc-native'
                ? 'btc'
                : !fromAsset
                ? 'all'
                : fromAsset.networkType === 'evm'
                ? 'ethereum'
                : 'substrate'
            }
            disableBtc
            substrateAccountPrefix={0}
            substrateAccountsFilter={a => !a.readonly}
            evmAccountsFilter={a => !!a.canSignEvm}
            value={fromAddress}
            onAccountChange={onChangeAddress}
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
                      <p className="text-[14px] text-gray-400 whitespace-nowrap">
                        {fastBalance.amount.toLocaleString()}
                      </p>
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
        </div>
      )}
      {shouldShowToAccount && <ToAccount />}
    </Surface>
  )
}
