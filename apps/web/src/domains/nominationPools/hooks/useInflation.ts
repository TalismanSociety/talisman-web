import { chainState } from '@domains/chains/recoils'
import { useChainState, useQueryMulti } from '@domains/common/hooks'
import { BN } from '@polkadot/util'
import { useMemo } from 'react'
import { useRecoilValueLoadable } from 'recoil'

export const useInflation = () => {
  const chainLoadable = useRecoilValueLoadable(chainState)
  const activeEraLoadable = useChainState('query', 'staking', 'activeEra', [])
  const queries = useQueryMulti(
    [
      'balances.totalIssuance',
      ['staking.erasTotalStake', activeEraLoadable.valueMaybe()?.unwrapOrDefault().index.subn(1)],
      'auctions.auctionCounter' as any,
    ],
    { enabled: activeEraLoadable.state === 'hasValue' && chainLoadable.state === 'hasValue' }
  )

  return useMemo(
    () =>
      queries.map(([totalIssuance, lastTotalStake, auctionCounter]) => {
        const { auctionAdjust, auctionMax, falloff, maxInflation, minInflation, stakeTarget } =
          chainLoadable.valueOrThrow().params

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
      }),
    [chainLoadable, queries]
  )
}
