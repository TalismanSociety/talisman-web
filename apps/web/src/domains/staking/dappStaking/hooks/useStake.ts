import type { Account } from '@domains/accounts'
import { useSubstrateApiEndpoint, useSubstrateApiState } from '@domains/common'
import { useQueryState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { range } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import { stakedDappsState } from '../recoils'

export const useStake = (account: Account) => {
  // Can't put this in the same waitForAll below
  // else an infinite loop will happen
  // highly likely a recoil bug
  const api = useRecoilValue(useSubstrateApiState())

  const [activeProtocol, ledger, stakedDapps] = useRecoilValue(
    waitForAll([
      useQueryState('dappStaking', 'activeProtocolState', []),
      useQueryState('dappStaking', 'ledger', [account.address]),
      stakedDappsState({ endpoint: useSubstrateApiEndpoint(), address: account.address }),
    ])
  )

  const rewardRetentionInPeriods = api.consts.dappStaking.rewardRetentionInPeriods
  const currentPeriod = activeProtocol.periodInfo.number.unwrap()

  const firstStakedEra = ledger.stakedFuture.isNone
    ? ledger.staked.era.unwrap()
    : BN.min(ledger.staked.era.unwrap(), ledger.stakedFuture.unwrapOrDefault().era.unwrap())

  const lastStakedPeriod = BN.max(ledger.staked.period.unwrap(), ledger.stakedFuture.unwrapOrDefault().period.unwrap())
  const lastStakedPeriodEnd = useRecoilValue(useQueryState('dappStaking', 'periodEnd', [lastStakedPeriod]))
  const lastStakedEra = lastStakedPeriodEnd.unwrapOrDefault().finalEra.unwrap()

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

  const stakeRewards = useMemo(
    () =>
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
        .reduce((prev, curr) => prev + curr, 0n),
    [eraRewardsSpans, ledger.staked.buildAndEarn, ledger.staked.era, ledger.staked.voting, ledger.stakedFuture]
  )

  const eligibleBonusRewards = useMemo(
    () =>
      rewardsExpired
        ? []
        : stakedDapps
            .filter(x => x[1].loyalStaker)
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
        .filter((x): x is NonNullable<typeof x> => x !== undefined),
    [bonusRewardsPeriodEnds, eligibleBonusRewards]
  )

  const totalBonusRewards = useMemo(() => bonusRewards.reduce((prev, curr) => prev + curr.rewards, 0n), [bonusRewards])

  const totalStaked = BigInt(
    ledger.staked.voting
      .unwrap()
      .add(ledger.staked.buildAndEarn.unwrap())
      .add(ledger.stakedFuture.unwrapOrDefault().voting.unwrap())
      .add(ledger.stakedFuture.unwrapOrDefault().buildAndEarn.unwrap())
      .toString()
  )

  return {
    active: !ledger.contractStakeCount.unwrap().isZero() || ledger.unlocking.length > 0,
    earningRewards: totalStaked > 0,
    account,
    ledger,
    totalStaked,
    stakeRewards,
    bonusRewards,
    totalBonusRewards,
    totalRewards: stakeRewards + totalBonusRewards,
  }
}

export type Stake = ReturnType<typeof useStake>
