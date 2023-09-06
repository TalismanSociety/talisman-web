import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import { totalSelectedAccountsFiatBalance } from '@domains/balances'
import { CircularProgressIndicator } from '@talismn/ui'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'

const TotalSuspense = () => {
  const fiatTotal = useRecoilValue(totalSelectedAccountsFiatBalance)

  // TODO: move these value into balances lib
  // const crowdloanTotal = useTotalCrowdloanTotalFiatAmount()
  // const totalStaked = useTotalStaked()

  const totalPortfolioValue = fiatTotal

  return <AnimatedFiatNumber end={totalPortfolioValue} />
}

const Total = () => {
  return (
    <Suspense fallback={<CircularProgressIndicator />}>
      <TotalSuspense />
    </Suspense>
  )
}

export default Total
