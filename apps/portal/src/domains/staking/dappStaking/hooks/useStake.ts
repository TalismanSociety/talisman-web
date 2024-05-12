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
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue, waitForAll } from 'recoil'

export const useStake = (account: Account) => {
  // Can't put this in the same waitForAll below
  // else an infinite loop will happen
  // highly likely a recoil bug
  const api = useRecoilValue(useSubstrateApiState())

  const [[activeProtocol, ledger], bestNumber, stakedDapps, nativeTokenAmount] = useRecoilValue(
    waitForAll([
      useQueryMultiState(['dappStaking.activeProtocolState', ['dappStaking.ledger', account.address]]),
      useDeriveState('chain', 'bestNumber', []),
      stakedDappsState({ endpoint: useSubstrateApiEndpoint(), address: account.address }),
      useNativeTokenAmountState(),
    ])
  )

  const rewardRetentionInPeriods = api.consts.dappStaking.rewardRetentionInPeriods
  const currentPeriod = activeProtocol.periodInfo.number.unwrap()

  const firstStakedEra = useMemo(() => {
    const stakedEra = ledger.staked.era.unwrap().isZero() ? undefined : ledger.staked.era.unwrap()
    const stakedFutureEra = ledger.stakedFuture.unwrapOr(undefined)?.era.unwrap()

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
  }, [ledger.staked.era, ledger.stakedFuture])

  const lastStakedPeriod = BN.max(ledger.staked.period.unwrap(), ledger.stakedFuture.unwrapOrDefault().period.unwrap())
  const lastStakedPeriodEnd = useRecoilValue(useQueryState('dappStaking', 'periodEnd', [lastStakedPeriod]))
  const lastStakedEra = lastStakedPeriod.eq(currentPeriod)
    ? // Final era from the current period
      activeProtocol.era.unwrap().subn(1)
    : // Final era from the past period
      lastStakedPeriodEnd.unwrapOrDefault().finalEra.unwrap()

  const rewardsExpired = lastStakedPeriod.lte(currentPeriod.sub(rewardRetentionInPeriods))

  const firstSpanIndex =
    firstStakedEra === undefined
      ? undefined
      : firstStakedEra.sub(firstStakedEra.mod(api.consts.dappStaking.eraRewardSpanLength))
  const lastSpanIndex = lastStakedEra.sub(lastStakedEra.mod(api.consts.dappStaking.eraRewardSpanLength))

  const eraRewardsSpans = useRecoilValue(
    useQueryState(
      'dappStaking',
      'eraRewards.multi',
      rewardsExpired || firstSpanIndex === undefined
        ? []
        : range(firstSpanIndex.toNumber(), lastSpanIndex.toNumber() + 1)
    )
  )

  const stakerRewards = useMemo(
    () =>
      nativeTokenAmount.fromPlanck(
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
      ),
    [
      eraRewardsSpans,
      ledger.staked.buildAndEarn,
      ledger.staked.era,
      ledger.staked.voting,
      ledger.stakedFuture,
      nativeTokenAmount,
    ]
  )

  const claimableSpanCount = useMemo(
    () =>
      rewardsExpired || firstSpanIndex === undefined
        ? 0
        : (lastSpanIndex.toNumber() - firstSpanIndex.toNumber()) /
            api.consts.dappStaking.eraRewardSpanLength.toNumber() +
          1,
    [api.consts.dappStaking.eraRewardSpanLength, firstSpanIndex, lastSpanIndex, rewardsExpired]
  )

  const eligibleBonusRewards = useMemo(
    () =>
      rewardsExpired
        ? []
        : stakedDapps
            .filter(x => x[1].loyalStaker.isTrue)
            .filter(
              x =>
                x[1].staked.period.unwrap().lt(activeProtocol.periodInfo.number.unwrap()) &&
                x[1].staked.period
                  .unwrap()
                  .gte(activeProtocol.periodInfo.number.unwrap().sub(api.consts.dappStaking.rewardRetentionInPeriods))
            ),
    [activeProtocol.periodInfo.number, api.consts.dappStaking.rewardRetentionInPeriods, rewardsExpired, stakedDapps]
  )

  const bonusRewardsPeriodEnds = useRecoilValue(
    useQueryState(
      'dappStaking',
      'periodEnd.multi',
      eligibleBonusRewards.map(x => x[1].staked.period.unwrap())
    )
  )

  const bonusRewards = useMemo(
    () =>
      eligibleBonusRewards
        .map((x, index) => {
          const wrappedPeriodEnd = bonusRewardsPeriodEnds[index]

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

  const totalBonusRewards = useMemo(
    () => nativeTokenAmount.fromPlanck(bonusRewards.reduce((prev, curr) => prev + curr.rewards, 0n)),
    [bonusRewards, nativeTokenAmount]
  )

  const totalStaked = useMemo(
    () =>
      nativeTokenAmount.fromPlanckOrUndefined(
        Maybe.of(
          [ledger.stakedFuture.unwrapOrDefault(), ledger.staked].find(x =>
            x.period.unwrap().eq(activeProtocol.periodInfo.number.unwrap())
          )
        ).mapOrUndefined(x => x.voting.toBigInt() + x.buildAndEarn.toBigInt())
      ),
    [activeProtocol.periodInfo.number, ledger.staked, ledger.stakedFuture, nativeTokenAmount]
  )

  const unlocking = useMemo(
    () =>
      ledger.unlocking
        .filter(x => x.unlockBlock.toBigInt() > bestNumber.toBigInt())
        .map(x => ({
          amount: nativeTokenAmount.fromPlanck(x.amount.unwrap().toBigInt()),
          eta: formatDistanceToNow(
            addMilliseconds(
              new Date(),
              Number(x.unlockBlock.unwrap().toBigInt() - bestNumber.toBigInt()) * expectedBlockTime(api).toNumber()
            )
          ),
        })),
    [api, bestNumber, ledger.unlocking, nativeTokenAmount]
  )

  const totalUnlocking = useMemo(
    () =>
      nativeTokenAmount.fromPlanck(
        ledger.unlocking
          .filter(x => x.unlockBlock.toBigInt() > bestNumber.toBigInt())
          .reduce((prev, curr) => prev + curr.amount.toBigInt(), 0n)
      ),
    [bestNumber, ledger.unlocking, nativeTokenAmount]
  )

  const withdrawable = useMemo(
    () =>
      nativeTokenAmount.fromPlanck(
        ledger.unlocking
          .filter(x => x.unlockBlock.toBigInt() <= bestNumber.toBigInt())
          .reduce((prev, curr) => prev + curr.amount.toBigInt(), 0n)
      ),
    [bestNumber, ledger.unlocking, nativeTokenAmount]
  )

  const dapps = useMemo(
    () =>
      stakedDapps
        .map(x => [x[0].args[1], x[1]] as const)
        .filter(x => x[1].staked.period.unwrap().eq(activeProtocol.periodInfo.number.unwrap())),
    [activeProtocol.periodInfo.number, stakedDapps]
  )

  return {
    active: dapps.length > 0 || ledger.unlocking.length > 0,
    earningRewards: totalStaked.decimalAmount !== undefined && totalStaked.decimalAmount.planck > 0,
    account,
    ledger,
    locked: useMemo(
      () => nativeTokenAmount.fromPlanck(ledger.locked.unwrap().toBigInt() - (totalStaked.decimalAmount?.planck ?? 0n)),
      [ledger.locked, nativeTokenAmount, totalStaked.decimalAmount?.planck]
    ),
    totalStaked,
    stakerRewards,
    claimableSpanCount,
    bonusRewards,
    totalBonusRewards,
    totalRewards: useMemo(
      () => nativeTokenAmount.fromPlanck(totalBonusRewards.decimalAmount.planck + stakerRewards.decimalAmount.planck),
      [nativeTokenAmount, stakerRewards, totalBonusRewards.decimalAmount.planck]
    ),
    unlocking,
    totalUnlocking,
    withdrawable,
    dapps,
  }
}

export type Stake = ReturnType<typeof useStake>
