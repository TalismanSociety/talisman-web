import type React from 'react'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Wallet } from '@talismn/web-icons'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { isAddress as isEvmAddress } from 'viem'

import { SeparatedAccountSelector } from '@/components/widgets/SeparatedAccountSelector'
import { useSetToAddress } from '@/components/widgets/swap/swaps.api'
import { selectedCurrencyState } from '@/domains/balances/currency'
import { cn } from '@/util/cn'
import { Decimal } from '@/util/Decimal'

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
import { ToAccount } from './ToAccount'

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
  const setToEvmAddress = useSetAtom(toEvmAddressAtom)
  const setToSubstrateAddress = useSetAtom(toSubstrateAddressAtom)

  const setToAddress = useSetToAddress()

  const onChangeAddress = useCallback(
    (address: string | null) => {
      if (!address) return

      if (isEvmAddress(address)) {
        setFromEvmAddress(address)
        setToAddress({ fromAddress: address })
      }

      setFromSubstrateAddress(address)
      setToAddress({ fromAddress: address })
    },
    [setFromEvmAddress, setFromSubstrateAddress, setToAddress]
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
    <Surface className="bg-card flex w-full flex-col gap-[12px] rounded-[8px] p-[16px]">
      <div className="flex items-center justify-between">
        <h4 className={cn('text-[16px]', fromAsset ? 'font-semibold' : 'text-gray-500')}>Swapping From</h4>
        <div
          className={cn('flex items-center gap-[8px]', {
            'text-primary': shouldShowToAccount,
            'text-gray-500': !shouldShowToAccount,
            'cursor-pointer hover:opacity-70':
              toAddress?.toLowerCase() !== fromAddress?.toLowerCase() &&
              fromAsset?.networkType === toAsset?.networkType,
            'hover:text-primary cursor-pointer':
              fromAsset?.networkType === toAsset?.networkType &&
              toAsset &&
              fromAsset &&
              toAddress?.toLowerCase() === fromAddress?.toLowerCase(),
          })}
          onClick={() => {
            if (!fromAsset?.networkType) return
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
          <Wallet className="h-[16px] w-[16px]" />
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
                    <p className="whitespace-nowrap text-[14px] text-gray-400">
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
                      <p className="whitespace-nowrap text-[14px] text-gray-400">
                        {fastBalance.amount.toLocaleString()}
                      </p>
                    )
                  }
                }

                const loading = b.each.find(b => b.status !== 'live') !== undefined || b.count === 0

                return (
                  <p className={cn('whitespace-nowrap text-[14px] text-gray-400', { 'animate-pulse': loading })}>
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
