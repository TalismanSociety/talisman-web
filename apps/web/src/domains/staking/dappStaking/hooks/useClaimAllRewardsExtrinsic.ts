import useExtrinsicBatch from '@domains/common/hooks/useExtrinsicBatch'
import type { Stake } from './useStake'

export const useClaimAllRewardsExtrinsic = (stake: Stake) => {
  const extrinsic = useExtrinsicBatch([
    'dappStaking.claimStakerRewards',
    ...stake.bonusRewards.map(() => 'dappStaking.claimBonusReward' as const),
  ])

  return {
    ...extrinsic,
    signAndSend: async () =>
      await extrinsic.signAndSend(
        stake.account.address,
        // @ts-expect-error
        [[] as const, ...stake.bonusRewards.map(x => [x.dapp] as const)]
      ),
  }
}
