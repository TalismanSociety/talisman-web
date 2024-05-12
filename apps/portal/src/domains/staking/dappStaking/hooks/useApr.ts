import { useEraLengthState } from '..'
import type { Perquintill } from '@polkadot/types/interfaces/runtime'
import { useQueryMultiState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

export const useApr = () => {
  const [
    { standardEraLength, standardErasPerBuildAndEarnPeriod, standardErasPerVotingPeriod, periodsPerCycle },
    [activeProtocolState, currentEraInfo, totalIssuance, inflationParams, activeInflationConfig],
  ] = useRecoilValue(
    waitForAll([
      useEraLengthState(),
      useQueryMultiState([
        'dappStaking.activeProtocolState',
        'dappStaking.currentEraInfo',
        'balances.totalIssuance',
        'inflation.inflationParams',
        'inflation.activeInflationConfig',
      ]),
    ])
  )

  const cyclesPerYear = useMemo(() => {
    const secBlockProductionRate = 12
    const secsOneYear = 365 * 24 * 60 * 60
    const periodLength = standardErasPerBuildAndEarnPeriod + standardErasPerVotingPeriod

    const eraPerCycle = periodLength * periodsPerCycle
    const blocksStandardEraLength = standardEraLength
    const blockPerCycle = blocksStandardEraLength * eraPerCycle
    const cyclePerYear = secsOneYear / secBlockProductionRate / blockPerCycle
    return cyclePerYear
  }, [periodsPerCycle, standardEraLength, standardErasPerBuildAndEarnPeriod, standardErasPerVotingPeriod])

  const stakerApr = useMemo(() => {
    const perquintillToNumber = (value: Perquintill) =>
      new BigNumber(value.toString()).times(0.0000000000000001).times(0.01).toNumber()

    const yearlyInflation = perquintillToNumber(inflationParams.maxInflationRate.unwrap())
    const baseStakersPart = perquintillToNumber(inflationParams.baseStakersPart.unwrap())
    const adjustableStakersPart = perquintillToNumber(inflationParams.adjustableStakersPart.unwrap())
    const idealStakingRate = perquintillToNumber(inflationParams.idealStakingRate.unwrap())

    const currentStakeAmount =
      activeProtocolState.periodInfo.subperiod.type === 'Voting'
        ? currentEraInfo.nextStakeAmount.voting.toBigInt()
        : currentEraInfo.currentStakeAmount.voting.toBigInt() +
          currentEraInfo.currentStakeAmount.buildAndEarn.toBigInt()

    const stakedPercent = new BigNumber(currentStakeAmount.toString()).div(totalIssuance.toString()).toNumber()
    const stakerRewardPercent = baseStakersPart + adjustableStakersPart * Math.min(1, stakedPercent / idealStakingRate)

    const stakerApr = ((yearlyInflation * stakerRewardPercent) / stakedPercent) * cyclesPerYear

    return Number.isFinite(stakerApr) ? stakerApr : 0
  }, [
    activeProtocolState.periodInfo.subperiod.type,
    currentEraInfo.currentStakeAmount.buildAndEarn,
    currentEraInfo.currentStakeAmount.voting,
    currentEraInfo.nextStakeAmount.voting,
    cyclesPerYear,
    inflationParams.adjustableStakersPart,
    inflationParams.baseStakersPart,
    inflationParams.idealStakingRate,
    inflationParams.maxInflationRate,
    totalIssuance,
  ])

  const bonusApr = useMemo(() => {
    // Memo: Any amount can be simulated
    const simulatedVoteAmount = 1000

    // Memo: equivalent to 'totalVpStake' in the runtime query
    const voteAmount =
      activeProtocolState.periodInfo.subperiod.type === 'Voting'
        ? currentEraInfo.nextStakeAmount.voting
        : currentEraInfo.currentStakeAmount.voting

    const bonusPercentPerPeriod = new BigNumber(activeInflationConfig.bonusRewardPoolPerPeriod.unwrap().toString())
      .div(voteAmount.unwrap().toString())
      .toNumber()

    const simulatedBonusPerPeriod = simulatedVoteAmount * bonusPercentPerPeriod
    const periodsPerYear = periodsPerCycle * cyclesPerYear
    const simulatedBonusAmountPerYear = simulatedBonusPerPeriod * periodsPerYear
    const bonusApr = simulatedBonusAmountPerYear / simulatedVoteAmount

    return Number.isFinite(bonusApr) ? bonusApr : 0
  }, [
    activeInflationConfig.bonusRewardPoolPerPeriod,
    activeProtocolState.periodInfo.subperiod.type,
    currentEraInfo.currentStakeAmount.voting,
    currentEraInfo.nextStakeAmount.voting,
    cyclesPerYear,
    periodsPerCycle,
  ])

  return { stakerApr, bonusApr, totalApr: stakerApr + bonusApr }
}
