import { useMemo, useState } from 'react'

import type { Account } from '@/domains/accounts/recoils'
import { DECIMALS, DEEK_TICKER } from '@/domains/staking/seek/constants'
import { Decimal } from '@/util/Decimal'

import useGetSeekAvailableBalance from './useGetSeekAvailableBalance'
import { useGetSeekStaked } from './useGetSeekStaked'

const useStakeSeekBase = ({ account, direction }: { account: Account | undefined; direction: 'stake' | 'unstake' }) => {
  const [amountInput, setAmountInput] = useState<string>('')

  // TODO: Add token rate once we have a price source for DEEK
  // const originTokenRate = useRecoilValueLoadable(tokenPriceState({ coingeckoId: originTokenConfig.coingeckoId }))

  const { seekBalances } = useGetSeekAvailableBalance()

  const {
    data: { balances },
  } = useGetSeekStaked()

  const stakedBalance = useMemo(() => {
    const balance = balances.find(b => b.address === account?.address)

    return Decimal.fromPlanck(balance?.amount || 0n, DECIMALS ?? 0, { currency: DEEK_TICKER })
  }, [account, balances])

  const available = useMemo(() => {
    const balance = seekBalances.each.find(b => b.address === account?.address)

    return Decimal.fromPlanck(balance?.total.planck || 0n, DECIMALS ?? 0, { currency: DEEK_TICKER })
  }, [account, seekBalances])

  const decimalAmountInput = useMemo(
    () =>
      amountInput.trim() === ''
        ? undefined
        : Decimal.fromUserInputOrUndefined(amountInput, DECIMALS, { currency: DEEK_TICKER }),
    [amountInput]
  )

  const newStakedTotal = useMemo(() => {
    if (direction === 'stake') {
      return Decimal.fromPlanck((stakedBalance?.planck || 0n) + (decimalAmountInput?.planck || 0n), DECIMALS ?? 0, {
        currency: DEEK_TICKER,
      })
    }
    return Decimal.fromPlanck(
      Math.max(0, Number((stakedBalance?.planck || 0n) - (decimalAmountInput?.planck || 0n))),
      DECIMALS ?? 0,
      {
        currency: DEEK_TICKER,
      }
    )
  }, [decimalAmountInput?.planck, direction, stakedBalance?.planck])

  return {
    input: { amountInput, decimalAmountInput },
    setAmountInput,
    newStakedTotal,
    available,
  }
}

export default useStakeSeekBase
