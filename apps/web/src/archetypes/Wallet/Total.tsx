import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import { useTotalCrowdloanTotalFiatAmount } from '@domains/crowdloans/hooks'
import { useTotalStaked } from '@domains/staking/hooks'
import { useActiveAccount, useBalances } from '@libs/talisman'
import { Suspense } from 'react'

const TotalSuspense = () => {
  const { balances, assetsOverallValue } = useBalances()
  const address = useActiveAccount().address

  const fiatTotal =
    address !== undefined ? balances?.find({ address: address }).sum.fiat('usd').total ?? 0 : assetsOverallValue
  const crowdloanTotal = useTotalCrowdloanTotalFiatAmount()
  const totalStaked = useTotalStaked()

  const totalPortfolioValue = fiatTotal + crowdloanTotal + (totalStaked.fiatAmount ?? 0)

  return (
    <>
      {totalPortfolioValue.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'narrowSymbol',
      })}
    </>
  )
}

const Total = () => {
  return (
    <Suspense fallback={<CircularProgressIndicator />}>
      <TotalSuspense />
    </Suspense>
  )
}

export default Total
