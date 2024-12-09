import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'

import AnimatedFiatNumber from '@/components/widgets/AnimatedFiatNumber'
import { selectedBalancesFiatSumState } from '@/domains/balances'

const TotalSuspense = () => {
  return <AnimatedFiatNumber end={useRecoilValue(selectedBalancesFiatSumState).total} />
}

const Total = () => {
  return (
    <Suspense fallback={<CircularProgressIndicator />}>
      <TotalSuspense />
    </Suspense>
  )
}

export default Total
