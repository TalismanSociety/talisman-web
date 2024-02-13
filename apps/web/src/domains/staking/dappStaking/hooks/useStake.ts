import type { Account } from '@domains/accounts'
import { useNativeTokenAmountState } from '@domains/chains'
import { expectedBlockTime, useSubstrateApiEndpoint, useSubstrateApiState } from '@domains/common'
import { useDeriveState, useQueryMultiState, useQueryState } from '@talismn/react-polkadot-api'
import { Maybe } from '@util/monads'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { addMilliseconds, formatDistanceToNow } from 'date-fns'
import { range } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue, waitForAll } from 'recoil'
import { stakedDappsState } from '../recoils'

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
    const value = Math.min(
      ledger.staked.era.unwrap().gtn(0) ? ledger.staked.era.toNumber() : Infinity,
      ledger.stakedFuture.unwrapOr(undefined)?.era.toNumber() ?? Infinity
    )
    return new BN(value === Infinity ? 0 : value)
  }, [ledger.staked.era, ledger.stakedFuture])

  const lastStakedPeriod = BN.max(ledger.staked.period.unwrap(), ledger.stakedFuture.unwrapOrDefault().period.unwrap())
  const lastStakedPeriodEnd = useRecoilValue(useQueryState('dappStaking', 'periodEnd', [lastStakedPeriod]))
  const lastStakedEra = lastStakedPeriod.eq(currentPeriod)
    ? // Final era from the current period
      activeProtocol.era.unwrap().subn(1)
    : // Final era from the past period
      lastStakedPeriodEnd.unwrapOrDefault().finalEra.unwrap()

  const rewardsExpired = lastStakedPeriod.lte(currentPeriod.sub(rewardRetentionInPeriods))

  const firstSpanIndex = firstStakedEra.sub(firstStakedEra.mod(api.consts.dappStaking.eraRewardSpanLength))
  const lastSpanIndex = lastStakedEra.sub(lastStakedEra.mod(api.consts.dappStaking.eraRewardSpanLength))

  const eraRewardsSpans = useRecoilValue(
    useQueryState(
      'dappStaking',
      'eraRewards.multi',
      rewardsExpired ? [] : range(firstSpanIndex.toNumber(), lastSpanIndex.toNumber() + 1)
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
                const stakedEligibleForRewards = ledger.staked.era.unwrap().gtn(era)
                  ? 0n
                  : ledger.staked.voting.unwrap().toBigInt() + ledger.staked.buildAndEarn.unwrap().toBigInt()

                const stakedFutureEligibleRewards = ledger.stakedFuture.isNone
                  ? 0n
                  : ledger.stakedFuture.unwrapOrDefault().era.unwrap().toBigInt() > era
                  ? 0n
                  : ledger.stakedFuture.unwrapOrDefault().voting.unwrap().toBigInt() +
                    ledger.stakedFuture.unwrapOrDefault().buildAndEarn.unwrap().toBigInt()

                const totalStakedEligibleForRewards = stakedEligibleForRewards + stakedFutureEligibleRewards
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
      rewardsExpired
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
      nativeTokenAmount.fromPlanck(
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
          amount: nativeTokenAmount.fromPlanck(x.amount.unwrap()),
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
    earningRewards: totalStaked.decimalAmount.planck.gtn(0),
    account,
    ledger,
    locked: useMemo(
      () => nativeTokenAmount.fromPlanck(ledger.locked.unwrap().sub(totalStaked.decimalAmount.planck)),
      [ledger.locked, nativeTokenAmount, totalStaked.decimalAmount.planck]
    ),
    totalStaked,
    stakerRewards,
    claimableSpanCount,
    bonusRewards,
    totalBonusRewards,
    totalRewards: useMemo(
      () =>
        nativeTokenAmount.fromPlanck(totalBonusRewards.decimalAmount.planck.add(stakerRewards.decimalAmount.planck)),
      [nativeTokenAmount, stakerRewards, totalBonusRewards.decimalAmount.planck]
    ),
    unlocking,
    totalUnlocking,
    withdrawable,
    dapps,
  }
}

export type Stake = ReturnType<typeof useStake>
