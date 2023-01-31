import { useTotalCrowdloanTotalFiatAmount } from '@domains/crowdloans/hooks'
import { useTotalStaked } from '@domains/staking/hooks'
import styled from '@emotion/styled'
import { useActiveAccount, useBalances } from '@libs/talisman'
import { PropsWithChildren } from 'react'

const Total = styled(({ className }: PropsWithChildren<{ className?: string }>) => {
  const { balances, assetsOverallValue } = useBalances()
  const address = useActiveAccount().address

  const fiatTotal =
    address !== undefined ? balances?.find({ address: address }).sum.fiat('usd').total ?? 0 : assetsOverallValue
  const crowdloanTotal = useTotalCrowdloanTotalFiatAmount()
  const totalStaked = useTotalStaked()

  const totalPortfolioValue = fiatTotal + crowdloanTotal + (totalStaked.fiatAmount ?? 0)

  return (
    <span>
      {totalPortfolioValue.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'narrowSymbol',
      })}
    </span>
  )
})

export default Total
