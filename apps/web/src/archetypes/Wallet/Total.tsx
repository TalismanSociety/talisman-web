import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import { legacySelectedAccountState } from '@domains/accounts/recoils'
import { useLegacyBalances } from '@domains/balances/hooks'
import { useTotalCrowdloanTotalFiatAmount } from '@domains/crowdloans/hooks'
import { useTotalStaked } from '@domains/staking/hooks'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'

const TotalSuspense = () => {
  const { balances, assetsOverallValue } = useLegacyBalances()
  const address = useRecoilValue(legacySelectedAccountState)?.address

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
