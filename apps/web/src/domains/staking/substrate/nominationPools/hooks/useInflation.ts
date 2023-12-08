import { ChainContext } from '@domains/chains'
import { chainQueryState, useSubstrateApiEndpoint, useSubstrateApiState } from '@domains/common'
import { BN } from '@polkadot/util'
import { useQueryMultiState, useQueryState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { useContext, useMemo } from 'react'
import { constSelector, useRecoilValue } from 'recoil'

export const useInflation = () => {
  const chain = useContext(ChainContext)
  const endpoint = useSubstrateApiEndpoint()
  const api = useRecoilValue(useSubstrateApiState())

  const activeEra = useRecoilValue(useQueryState('staking', 'activeEra', []))
  const auctionCounter = useRecoilValue(
    api.query.auctions !== undefined
      ? chainQueryState(endpoint, 'auctions', 'auctionCounter', [])
      : constSelector(undefined)
  )

  const [totalIssuance, lastTotalStake] = useRecoilValue(
    useQueryMultiState([
      'balances.totalIssuance',
      ['staking.erasTotalStake', activeEra.unwrapOrDefault().index.subn(1)],
    ])
  )

  return useMemo(() => {
    const { auctionAdjust, auctionMax, falloff, maxInflation, minInflation, stakeTarget, yearlyInflationInTokens } =
      chain.parameters
    const BN_MILLION = new BN(1_000_000)

    const stakedFraction =
      lastTotalStake.isZero() || totalIssuance.isZero()
        ? 0
        : lastTotalStake.mul(BN_MILLION).div(totalIssuance).toNumber() / BN_MILLION.toNumber()
    const idealStake = stakeTarget - Math.min(auctionMax, auctionCounter?.toNumber() ?? 0) * auctionAdjust
    const idealInterest = maxInflation / idealStake

    const inflation =
      yearlyInflationInTokens !== undefined
        ? totalIssuance.isZero()
          ? 0
          : new BigNumber(yearlyInflationInTokens.toString())
              .div(totalIssuance.toString())
              .shiftedBy(api.registry.chainDecimals.at(0) ?? 0)
              .toNumber()
        : minInflation +
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
  }, [api.registry.chainDecimals, auctionCounter, chain.parameters, lastTotalStake, totalIssuance])
}
