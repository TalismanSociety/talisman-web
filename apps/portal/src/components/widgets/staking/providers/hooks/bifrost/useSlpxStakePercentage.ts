import { useSuspenseQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { useConfig } from 'wagmi'
import { getTokenQueryOptions } from 'wagmi/query'

import { selectedBalancesState } from '@/domains/balances/recoils'
import { SlpxPair } from '@/domains/staking/slpx/types'

const useSlpxStakePercentage = (slpxPair: SlpxPair) => {
  const balances = useRecoilValue(selectedBalancesState)

  const config = useConfig()
  const liquidToken = useSuspenseQuery(
    getTokenQueryOptions(config, {
      chainId: slpxPair.chain.id,
      address: slpxPair.vToken.address,
    })
  )

  const nativeBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === slpxPair.nativeToken.symbol.toLowerCase()),
    [balances, slpxPair.nativeToken.symbol]
  )
  const liquidBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === liquidToken.data?.symbol?.toLowerCase()),
    [balances, liquidToken.data?.symbol]
  )

  const slpxStakePercentage = useMemo(
    () =>
      liquidBalance.sum.planck.total === 0n
        ? 0
        : new BigNumber(liquidBalance.sum.planck.total.toString())
            .div((nativeBalance.sum.planck.total + liquidBalance.sum.planck.total).toString())
            .toNumber(),
    [liquidBalance.sum.planck.total, nativeBalance.sum.planck.total]
  )

  return slpxStakePercentage
}

export default useSlpxStakePercentage
