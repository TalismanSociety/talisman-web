import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { selectedBalancesState } from '@/domains/balances/core'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'

const useSlpxSubstrateStakePercentage = (slpxPair: SlpxSubstratePair) => {
  const balances = useRecoilValue(selectedBalancesState)

  const nativeBalance = useMemo(
    () =>
      balances.find(
        x =>
          x.token?.symbol.toLowerCase() === slpxPair.nativeToken.symbol.toLowerCase() && x.chainId === slpxPair.chainId
      ),
    [balances, slpxPair.chainId, slpxPair.nativeToken.symbol]
  )

  const liquidBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === slpxPair.vToken.symbol.toLowerCase()),
    [balances, slpxPair.vToken.symbol]
  )

  const slpxSubstrateStakePercentage = useMemo(
    () =>
      liquidBalance.sum.planck.total === 0n
        ? 0
        : new BigNumber(liquidBalance.sum.planck.total.toString())
            .div((nativeBalance.sum.planck.total + liquidBalance.sum.planck.total).toString())
            .toNumber(),
    [liquidBalance.sum.planck.total, nativeBalance.sum.planck.total]
  )

  return slpxSubstrateStakePercentage
}

export default useSlpxSubstrateStakePercentage
