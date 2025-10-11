import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import { selectedCurrencyState } from '@/domains/balances/currency'
import { DECIMALS, SEEK_TICKER } from '@/domains/staking/seek/constants'
import { Decimal } from '@/util/Decimal'

import useGetSeekAvailableBalance from './useGetSeekAvailableBalance'
import useGetSeekStaked from './useGetSeekStaked'

const useStakeSeekBase = ({ account, direction }: { account: Account | undefined; direction: 'stake' | 'unstake' }) => {
  const [amountInput, setAmountInput] = useState<string>('')
  const currency = useRecoilValue(selectedCurrencyState)

  const { seekBalances, refetch: refetchSeekBalances } = useGetSeekAvailableBalance()

  const {
    data: { balances },
  } = useGetSeekStaked()

  const stakedBalance = useMemo(() => {
    const balance = balances.find(b => b.address === account?.address)

    return Decimal.fromPlanck(balance?.amount || 0n, DECIMALS ?? 0, { currency: SEEK_TICKER })
  }, [account, balances])

  const balanceByWalletAddress = useMemo(() => {
    const defaultFiatAmount = 0
    const balance = seekBalances.each.find(b => b.address === account?.address) || {
      availableBalance: Decimal.fromPlanck(0n, 0, { currency: SEEK_TICKER }),
      fiatAmount: 0,
      fiatAmountFormatted: defaultFiatAmount.toLocaleString(undefined, { style: 'currency', currency }),
    }
    return balance
  }, [account?.address, currency, seekBalances.each])

  const decimalAmountInput = useMemo(
    () =>
      amountInput.trim() === ''
        ? undefined
        : Decimal.fromUserInputOrUndefined(amountInput, DECIMALS, { currency: SEEK_TICKER }),
    [amountInput]
  )

  const newStakedTotal = useMemo(() => {
    if (direction === 'stake') {
      return Decimal.fromPlanck((stakedBalance?.planck || 0n) + (decimalAmountInput?.planck || 0n), DECIMALS ?? 0, {
        currency: SEEK_TICKER,
      })
    }
    return Decimal.fromPlanck(
      Math.max(0, Number((stakedBalance?.planck || 0n) - (decimalAmountInput?.planck || 0n))),
      DECIMALS ?? 0,
      {
        currency: SEEK_TICKER,
      }
    )
  }, [decimalAmountInput?.planck, direction, stakedBalance?.planck])

  return {
    input: { amountInput, decimalAmountInput },
    setAmountInput,
    newStakedTotal,
    balanceByWalletAddress,
    refetchSeekBalances,
  }
}

export default useStakeSeekBase
