import { chainState } from '@domains/chains/recoils'
import { useChainQueryMultiState, useChainQueryState } from '@domains/common/recoils'
import { BN } from '@polkadot/util'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

export const useInflation = () => {
  const [chain, activeEra] = useRecoilValue(waitForAll([chainState, useChainQueryState('staking', 'activeEra', [])]))

  const [totalIssuance, lastTotalStake, auctionCounter] = useRecoilValue(
    useChainQueryMultiState([
      'balances.totalIssuance',
      ['staking.erasTotalStake', activeEra.unwrapOrDefault().index.subn(1)],
      'auctions.auctionCounter',
    ])
  )

  return useMemo(() => {
    const { auctionAdjust, auctionMax, falloff, maxInflation, minInflation, stakeTarget } = chain.params

    const BN_MILLION = new BN(1_000_000)

    const stakedFraction =
      lastTotalStake.isZero() || totalIssuance.isZero()
        ? 0
        : lastTotalStake.mul(BN_MILLION).div(totalIssuance).toNumber() / BN_MILLION.toNumber()
    const idealStake = stakeTarget - Math.min(auctionMax, auctionCounter.toNumber()) * auctionAdjust
    const idealInterest = maxInflation / idealStake
    const inflation =
      minInflation +
      (stakedFraction <= idealStake
        ? stakedFraction * (idealInterest - minInflation / idealStake)
        : (idealInterest * idealStake - minInflation) * 2 ** ((idealStake - stakedFraction) / falloff))

    return {
      idealInterest,
      idealStake,
      inflation,
      stakedFraction,
      stakedReturn: stakedFraction ? inflation / stakedFraction : 0,
    }
  }, [auctionCounter, chain.params, lastTotalStake, totalIssuance])
}
