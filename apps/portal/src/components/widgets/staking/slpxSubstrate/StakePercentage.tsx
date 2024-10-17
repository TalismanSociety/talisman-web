import { selectedBalancesState } from '../../../../domains/balances'
import StakeProvider from '../../../recipes/StakeProvider'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

const StakePercentage = ({ slpxPair }: { slpxPair: SlpxSubstratePair }) => {
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

  return (
    <StakeProvider.StakePercentage
      percentage={useMemo(
        () =>
          liquidBalance.sum.planck.total === 0n
            ? 0
            : new BigNumber(liquidBalance.sum.planck.total.toString())
                .div((nativeBalance.sum.planck.total + liquidBalance.sum.planck.total).toString())
                .toNumber(),
        [liquidBalance.sum.planck.total, nativeBalance.sum.planck.total]
      )}
    />
  )
}

export default StakePercentage
