import { useRecommendedPoolsState } from '../recoils'
import type { AnyJson } from '@w3ux/types'
import { useRecoilValue } from 'recoil'

export type BondedPool = {
  commission?: {
    current?: AnyJson | null
    max?: AnyJson | null
    changeRate: {
      maxIncrease: AnyJson
      minDelay: AnyJson
    } | null
    throttleFrom?: AnyJson | null
  }
}

export const usePoolCommission = () => {
  const pools = useRecoilValue(useRecommendedPoolsState())

  const getCurrentCommission = (poolId: number) => {
    const pool: BondedPool | undefined = pools.find(pool => pool.poolId === poolId)?.bondedPool.toHuman()

    return Number(pool?.commission?.current?.[0]?.slice(0, -1) || 0)
  }

  return { getCurrentCommission }
}
