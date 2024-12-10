import { useSuspenseQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { useConfig } from 'wagmi'
import { getTokenQueryOptions } from 'wagmi/query'

import { selectedBalancesState } from '@/domains/balances/core'

type StakePercentageProps = {
  chainId: string | number
  nativeTokenAddress: `0x${string}`
  symbol: string
}

const useStakePercentage = ({ chainId, nativeTokenAddress, symbol }: StakePercentageProps) => {
  const balances = useRecoilValue(selectedBalancesState)

  const config = useConfig()
  const liquidToken = useSuspenseQuery(
    getTokenQueryOptions(config, {
      chainId: Number(chainId),
      address: nativeTokenAddress,
    })
  )
  const nativeBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === symbol.toLowerCase()),
    [balances, symbol]
  )
  const liquidBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === liquidToken.data?.symbol?.toLowerCase()),
    [balances, liquidToken.data?.symbol]
  )

  const stakePercentage = useMemo(
    () =>
      liquidBalance.sum.planck.total === 0n
        ? 0
        : new BigNumber(liquidBalance.sum.planck.total.toString())
            .div((nativeBalance.sum.planck.total + liquidBalance.sum.planck.total).toString())
            .toNumber(),
    [liquidBalance.sum.planck.total, nativeBalance.sum.planck.total]
  )

  return stakePercentage
}

export default useStakePercentage
