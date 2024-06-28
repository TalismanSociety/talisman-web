import { Maybe } from '../../../../util/monads'
import type { Account } from '../../../accounts'
import { useNativeTokenAmountState } from '../../../chains'
import { expectedBlockTime, useSubstrateApiEndpoint, useSubstrateApiState } from '../../../common'
import { stakedDappsState } from '../recoils'
import { useDeriveState, useQueryMultiState, useQueryState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { addMilliseconds, formatDistanceToNow } from 'date-fns'
import { range } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE as useRecoilValueLoadable, waitForAll } from 'recoil'

export const useStakeLoadable = (account: Account) => {
  // Can't put this in the same waitForAll below
  // else an infinite loop will happen
  // highly likely a recoil bug
  const apiLoadable = useRecoilValueLoadable(useSubstrateApiState())

  const api = apiLoadable.valueMaybe()

  const { state, contents } = useRecoilValueLoadable(
    waitForAll([
      useDeriveState('chain', 'bestNumber', []),
      stakedDappsState({ endpoint: useSubstrateApiEndpoint(), address: account.address }),
      useNativeTokenAmountState(),
    ])
  )
  const [bestNumber, stakedDapps, nativeTokenAmount] = state === 'hasValue' ? contents : []

  const { state: multiQueryState, contents: multiQueryContent } = useRecoilValueLoadable(
    useQueryMultiState(['dappStaking.activeProtocolState', ['dappStaking.ledger', account.address]])
  )

  const [activeProtocol, ledger] = multiQueryState === 'hasValue' ? multiQueryContent : []

  const rewardRetentionInPeriods = api?.consts.dappStaking.rewardRetentionInPeriods
  const currentPeriod = useMemo(() => activeProtocol?.periodInfo.number.unwrap(), [activeProtocol])

  const firstStakedEra = useMemo(() => {
    const stakedEra = ledger?.staked.era.unwrap().isZero() ? undefined : ledger?.staked.era.unwrap()
    const stakedFutureEra = ledger?.stakedFuture.unwrapOr(undefined)?.era.unwrap()

    if (stakedEra === undefined && stakedFutureEra === undefined) {
      return undefined
    }

    if (stakedEra === undefined) {
      return stakedFutureEra
    }

    if (stakedFutureEra === undefined) {
      return stakedEra
    }

    return BN.min(stakedEra, stakedFutureEra)
  }, [ledger?.staked.era, ledger?.stakedFuture])

  const lastStakedPeriod = BN.max(
    ledger?.staked.period.unwrap() ?? new BN(0),
    ledger?.stakedFuture.unwrapOrDefault().period.unwrap() ?? new BN(0)
  )
  // const lastStakedPeriodEnd = useRecoilValue(useQueryState('dappStaking', 'periodEnd', [lastStakedPeriod]))
  const lastStakedPeriodEndLoadable = useRecoilValueLoadable(
    useQueryState('dappStaking', 'periodEnd', [lastStakedPeriod])
  )
  const lastStakedPeriodEnd = lastStakedPeriodEndLoadable.valueMaybe()
  const lastStakedEra = lastStakedPeriod.eq(currentPeriod ?? new BN(0))
    ? // Final era from the current period
      activeProtocol?.era.unwrap().subn(1)
    : // Final era from the past period
      lastStakedPeriodEnd?.unwrapOrDefault().finalEra.unwrap()

  const rewardsExpired = useMemo(() => {
    return lastStakedPeriod.lte(currentPeriod?.sub(rewardRetentionInPeriods ?? new BN(0)) ?? new BN(0))
  }, [currentPeriod, lastStakedPeriod, rewardRetentionInPeriods])

  const firstSpanIndex =
    firstStakedEra === undefined || !api
      ? undefined
      : firstStakedEra.sub(firstStakedEra.mod(api.consts.dappStaking.eraRewardSpanLength))
  const lastSpanIndex = useMemo(() => {
    if (!api) return new BN(0)
    return lastStakedEra?.sub(lastStakedEra.mod(api.consts.dappStaking.eraRewardSpanLength))
  }, [api, lastStakedEra])

  const queryParams = useMemo(() => {
    if (rewardsExpired || firstSpanIndex === undefined || lastSpanIndex === undefined) return []
    return range(firstSpanIndex.toNumber(), lastSpanIndex.toNumber() + 1)
  }, [firstSpanIndex, lastSpanIndex, rewardsExpired])

  const eraRewardsSpansLoadable = useRecoilValueLoadable(useQueryState('dappStaking', 'eraRewards.multi', queryParams))
  const eraRewardsSpans = eraRewardsSpansLoadable.valueMaybe()

  const stakerRewards = useMemo(() => {
    if (!ledger || !eraRewardsSpans || !nativeTokenAmount) return null
    return nativeTokenAmount.fromPlanck(
      eraRewardsSpans
        .filter(span => span.isSome)
        .map(span => span.unwrapOrDefault())
        .map(span =>
          range(span.firstEra.toNumber(), span.lastEra.toNumber() + 1)
            .map(era => {
              let totalStakedEligibleForRewards = 0n

              const stakedEra = ledger.staked.era.unwrap().toNumber()
              const stakedFutureEra = ledger.stakedFuture.unwrapOrDefault().era.unwrap().toNumber()

              const stakedTotal =
                ledger.staked.voting.unwrap().toBigInt() + ledger.staked.buildAndEarn.unwrap().toBigInt()

              const stakedFutureTotal =
                ledger.stakedFuture.unwrapOrDefault().voting.unwrap().toBigInt() +
                ledger.stakedFuture.unwrapOrDefault().buildAndEarn.unwrap().toBigInt()

              // Slight code smell to keep in parity with Astar codebase
              if (stakedEra <= era && ledger.stakedFuture.isNone) {
                totalStakedEligibleForRewards += stakedTotal
              } else if (ledger.stakedFuture.isSome) {
                if (stakedFutureEra <= era) {
                  totalStakedEligibleForRewards += stakedFutureTotal
                } else if (stakedEra <= era) {
                  totalStakedEligibleForRewards += stakedTotal
                }
              }

              const eraSpan = span.span[era - span.firstEra.toNumber()]

              return eraSpan === undefined || eraSpan.staked.unwrap().isZero()
                ? 0n
                : BigInt(
                    new BigNumber(eraSpan.stakerRewardPool.unwrap().toString())
                      .times(totalStakedEligibleForRewards.toString())
                      .div(eraSpan.staked.unwrap().toString())
                      .integerValue()
                      .toString()
                  )
            })
            .reduce((prev, curr) => prev + curr, 0n)
        )
        .reduce((prev, curr) => prev + curr, 0n)
    )
  }, [eraRewardsSpans, ledger, nativeTokenAmount])

  const claimableSpanCount = useMemo(
    () =>
      rewardsExpired || firstSpanIndex === undefined || !api || !lastSpanIndex
        ? 0
        : (lastSpanIndex.toNumber() - firstSpanIndex.toNumber()) /
            api.consts.dappStaking.eraRewardSpanLength.toNumber() +
          1,
    [api, firstSpanIndex, lastSpanIndex, rewardsExpired]
  )

  const eligibleBonusRewards = useMemo(() => {
    if (!activeProtocol?.periodInfo.number || !api?.consts.dappStaking.rewardRetentionInPeriods || !stakedDapps)
      return []
    return rewardsExpired
      ? []
      : stakedDapps
          .filter(x => x[1].loyalStaker.isTrue)
          .filter(
            x =>
              x[1].staked.period.unwrap().lt(activeProtocol.periodInfo.number.unwrap()) &&
              x[1].staked.period
                .unwrap()
                .gte(activeProtocol.periodInfo.number.unwrap().sub(api.consts.dappStaking.rewardRetentionInPeriods))
          )
  }, [activeProtocol?.periodInfo.number, api?.consts.dappStaking.rewardRetentionInPeriods, rewardsExpired, stakedDapps])

  const bonusRewardsPeriodEndsLoadable = useRecoilValueLoadable(
    useQueryState(
      'dappStaking',
      'periodEnd.multi',
      eligibleBonusRewards.map(x => x[1].staked.period.unwrap())
    )
  )
  const bonusRewardsPeriodEnds = bonusRewardsPeriodEndsLoadable.valueMaybe()

  const bonusRewards = useMemo(
    () =>
      eligibleBonusRewards
        .map((x, index) => {
          const wrappedPeriodEnd = bonusRewardsPeriodEnds?.[index]

          if (wrappedPeriodEnd === undefined || wrappedPeriodEnd.isNone) {
            return undefined
          }

          const periodEnd = wrappedPeriodEnd.unwrapOrDefault()

          return {
            dapp: x[0].args[1],
            rewards: BigInt(
              new BigNumber(periodEnd.bonusRewardPool.toString())
                .times(x[1].staked.voting.unwrap().toString())
                .div(periodEnd.totalVpStake.unwrap().toString())
                .integerValue()
                .toString()
            ),
          }
        })
        .filter((x): x is NonNullable<typeof x> => x !== undefined && x.rewards > 0),
    [bonusRewardsPeriodEnds, eligibleBonusRewards]
  )

  const totalBonusRewards = useMemo(() => {
    if (!nativeTokenAmount || !bonusRewards) return null
    return nativeTokenAmount.fromPlanck(bonusRewards.reduce((prev, curr) => prev + curr.rewards, 0n))
  }, [bonusRewards, nativeTokenAmount])

  const totalStaked = useMemo(() => {
    if (!ledger || !activeProtocol || !nativeTokenAmount) return null
    return nativeTokenAmount.fromPlanckOrUndefined(
      Maybe.of(
        [ledger.stakedFuture.unwrapOrDefault(), ledger.staked].find(x =>
          x.period.unwrap().eq(activeProtocol.periodInfo.number.unwrap())
        )
      ).mapOrUndefined(x => x.voting.toBigInt() + x.buildAndEarn.toBigInt())
    )
  }, [activeProtocol, ledger, nativeTokenAmount])

  const unlocking = useMemo(() => {
    if (!api || !ledger || !bestNumber || !nativeTokenAmount) return []
    return ledger.unlocking
      .filter(x => x.unlockBlock.toBigInt() > bestNumber.toBigInt())
      .map(x => ({
        amount: nativeTokenAmount.fromPlanck(x.amount.unwrap().toBigInt()),
        eta: formatDistanceToNow(
          addMilliseconds(
            new Date(),
            Number(x.unlockBlock.unwrap().toBigInt() - bestNumber.toBigInt()) * expectedBlockTime(api).toNumber()
          )
        ),
      }))
  }, [api, bestNumber, ledger, nativeTokenAmount])

  const totalUnlocking = useMemo(() => {
    if (!ledger || !nativeTokenAmount || !bestNumber) return null
    return nativeTokenAmount.fromPlanck(
      ledger.unlocking
        .filter(x => x.unlockBlock.toBigInt() > bestNumber.toBigInt())
        .reduce((prev, curr) => prev + curr.amount.toBigInt(), 0n)
    )
  }, [bestNumber, ledger, nativeTokenAmount])

  const withdrawable = useMemo(() => {
    if (!ledger || !nativeTokenAmount || !bestNumber) return null
    return nativeTokenAmount.fromPlanck(
      ledger.unlocking
        .filter(x => x.unlockBlock.toBigInt() <= bestNumber.toBigInt())
        .reduce((prev, curr) => prev + curr.amount.toBigInt(), 0n)
    )
  }, [bestNumber, ledger, nativeTokenAmount])

  const dapps = useMemo(() => {
    if (!activeProtocol?.periodInfo.number || !stakedDapps) return []
    return stakedDapps
      .map(x => [x[0].args[1], x[1]] as const)
      .filter(x => x[1].staked.period.unwrap().eq(activeProtocol.periodInfo.number.unwrap()))
  }, [activeProtocol?.periodInfo.number, stakedDapps])

  const locked = useMemo(
    () =>
      nativeTokenAmount?.fromPlanck(
        (ledger?.locked.unwrap().toBigInt() ?? 0n) - (totalStaked?.decimalAmount?.planck ?? 0n)
      ),
    [ledger?.locked, nativeTokenAmount, totalStaked?.decimalAmount?.planck]
  )

  const isActive = useMemo(() => {
    return dapps.length > 0 || (ledger?.unlocking.length ?? 0) > 0 || (locked?.decimalAmount.planck ?? 0) > 0
  }, [dapps.length, ledger?.unlocking.length, locked?.decimalAmount.planck])

  const data = {
    active: isActive,
    earningRewards: useMemo(
      () => totalStaked?.decimalAmount !== undefined && totalStaked.decimalAmount.planck > 0,
      [totalStaked?.decimalAmount]
    ),
    account,
    ledger,
    locked,
    totalStaked,
    stakerRewards,
    claimableSpanCount,
    bonusRewards,
    totalBonusRewards,
    totalRewards: useMemo(
      () =>
        nativeTokenAmount?.fromPlanck(
          (totalBonusRewards?.decimalAmount?.planck ?? 0n) + (stakerRewards?.decimalAmount?.planck ?? 0n)
        ),
      [nativeTokenAmount, stakerRewards, totalBonusRewards?.decimalAmount.planck]
    ),
    unlocking,
    totalUnlocking,
    withdrawable,
    dapps,
  }

  return {
    data,
    isLoading: state === 'loading' || multiQueryState === 'loading' || eraRewardsSpansLoadable.state === 'loading',
  }
}

export type StakeLoadable = ReturnType<typeof useStakeLoadable>
