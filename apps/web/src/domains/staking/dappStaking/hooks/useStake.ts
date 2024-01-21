import type { Account } from '@domains/accounts'
import { useSubstrateApiEndpoint, useSubstrateApiState } from '@domains/common'
import { useQueryState } from '@talismn/react-polkadot-api'
import BN from 'bn.js'
import { range } from 'lodash'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import { stakedDappsState } from '../recoils'

export const useStake = (account: Account) => {
  const [api, activeProtocol, ledger, stakedDapps] = useRecoilValue(
    waitForAll([
      useSubstrateApiState(),
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
                ? new BN(0)
                : ledger.staked.voting.unwrap().add(ledger.staked.buildAndEarn.unwrap())

              const stakedFutureEligibleRewards = ledger.stakedFuture.isNone
                ? new BN(0)
                : ledger.stakedFuture.unwrapOrDefault().era.unwrap().gtn(era)
                ? new BN(0)
                : ledger.stakedFuture
                    .unwrapOrDefault()
                    .voting.unwrap()
                    .add(ledger.stakedFuture.unwrapOrDefault().buildAndEarn.unwrap())

              const totalStakedEligibleForRewards = stakedEligibleForRewards.add(stakedFutureEligibleRewards)
              const eraSpan = span.span[era]

              return eraSpan === undefined
                ? new BN(0)
                : eraSpan.stakerRewardPool.unwrap().mul(totalStakedEligibleForRewards.div(eraSpan.staked.unwrap()))
            })
            .reduce((prev, curr) => prev.add(curr), new BN(0))
        )
        .reduce((prev, curr) => prev.add(curr), new BN(0)),
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
            rewards: periodEnd.bonusRewardPool
              .unwrap()
              .mul(x[1].staked.voting.unwrap().div(periodEnd.totalVpStake.unwrap())),
          }
        })
        .filter((x): x is NonNullable<typeof x> => x !== undefined),
    [bonusRewardsPeriodEnds, eligibleBonusRewards]
  )

  const totalBonusRewards = useMemo(
    () => bonusRewards.reduce((prev, curr) => prev.add(curr.rewards), new BN(0)),
    [bonusRewards]
  )

  const totalStaked = ledger.staked.voting
    .unwrap()
    .add(ledger.staked.buildAndEarn.unwrap())
    .add(ledger.stakedFuture.unwrapOrDefault().voting.unwrap())
    .add(ledger.stakedFuture.unwrapOrDefault().buildAndEarn.unwrap())

  return {
    active: !ledger.contractStakeCount.unwrap().isZero() || ledger.unlocking.length > 0,
    earningRewards: !totalStaked.isZero() && !totalStaked.isNeg(),
    account,
    ledger,
    totalStaked,
    stakeRewards,
    bonusRewards,
    totalBonusRewards,
    totalRewards: stakeRewards.add(totalBonusRewards),
  }
}

export type Stake = ReturnType<typeof useStake>
