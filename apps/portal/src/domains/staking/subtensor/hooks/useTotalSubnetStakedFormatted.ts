import BN from 'bn.js'
import { useRecoilValue } from 'recoil'

import { useNativeTokenAmountState } from '@/domains/chains/recoils'

import { useCombineSubnetData } from './useCombineSubnetData'

export const useTotalSubnetStakedFormatted = (poolId: number | undefined) => {
  // const { combinedValidatorsData } = useCombinedBittensorValidatorsData()
  const { subnetData } = useCombineSubnetData()
  const tokenAmount = useRecoilValue(useNativeTokenAmountState())

  // const delegate = combinedValidatorsData.find(validator => validator?.poolId === hotkey)
  const pool = poolId ? subnetData[poolId] : undefined

  console.log({ pool })

  const { fiatAmount, localizedFiatAmount, decimalAmount } = tokenAmount.fromPlanck(
    new BN(pool?.total_tao ?? '').toString()
  )

  // fiatAmount may be 0, in that case we should return the token amount
  return fiatAmount ? localizedFiatAmount : decimalAmount.toLocaleString()
}
