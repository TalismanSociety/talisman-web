import { selectedBalancesFiatSumState } from '../../../../domains/balances'
import AnimatedFiatNumber from '../../../widgets/AnimatedFiatNumber'
import { CircularProgressIndicator } from '@talismn/ui'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'

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
