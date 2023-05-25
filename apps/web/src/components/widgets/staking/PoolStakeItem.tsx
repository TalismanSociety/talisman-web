import ClaimStakeDialog from '@components/recipes/ClaimStakeDialog'
import { PoolStakeItem as PoolStakeItemComponent, WithdrawChip } from '@components/recipes/StakeItem'
import { useEraEtaFormatter, useExtrinsic, useTokenAmountFromPlanck } from '@domains/common'
import { useCallback, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { type Account } from '@domains/accounts'
import { useNativeTokenDecimalState, useNativeTokenPriceState } from '@domains/chains'
import { type usePoolStakes } from '@domains/nominationPools'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'
import RedactableBalance from '../RedactableBalance'
import AnimatedFiatNumber from '../AnimatedFiatNumber'

const PoolStakeItem = ({
  item,
  hideIdenticon,
}: {
  hideIdenticon?: boolean
  item: ReturnType<typeof usePoolStakes<Account[]>>[number]
}) => {
  const [decimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([useNativeTokenDecimalState(), useNativeTokenPriceState()])
  )

  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isAddingStake, setIsAddingStake] = useState(false)

  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const claimPayoutExtrinsic = useExtrinsic('nominationPools', 'claimPayout')
  const restakeExtrinsic = useExtrinsic('nominationPools', 'bondExtra')
  const withdrawExtrinsic = useExtrinsic('nominationPools', 'withdrawUnbonded')

  const pendingRewards = useTokenAmountFromPlanck(item.pendingRewards)

  const eraEtaFormatter = useEraEtaFormatter()
  const unlocks = item.unlockings?.map(x => ({
    amount: <RedactableBalance>{decimal.fromPlanck(x.amount).toHuman()}</RedactableBalance>,
    eta: eraEtaFormatter(x.erasTilWithdrawable),
  }))

  return (
    <>
      <PoolStakeItemComponent
        readonly={item.account?.readonly}
        hideIdenticon={hideIdenticon}
        stakeStatus={item.status}
        accountName={item.account?.name ?? ''}
        accountAddress={item.account?.address ?? ''}
        stakingAmount={<RedactableBalance>{decimal.fromPlanck(item.poolMember.points).toHuman()}</RedactableBalance>}
        stakingFiatAmount={
          <AnimatedFiatNumber end={decimal.fromPlanck(item.poolMember.points).toNumber() * nativeTokenPrice} />
        }
        poolName={item.poolName ?? ''}
        claimChip={
          item.pendingRewards?.isZero() === false && (
            <PoolStakeItemComponent.ClaimChip
              amount={<RedactableBalance>{decimal.fromPlanck(item.pendingRewards).toHuman()}</RedactableBalance>}
              onClick={() => setClaimDialogOpen(true)}
              loading={claimPayoutExtrinsic.state === 'loading' || restakeExtrinsic.state === 'loading'}
            />
          )
        }
        unstakeChip={
          // Fully unbonding pool can't be interacted with
          !item.poolMember.points.isZero() && (
            <PoolStakeItemComponent.UnstakeChip onClick={() => setIsUnstaking(true)} />
          )
        }
        increaseStakeChip={
          // Fully unbonding pool can't be interacted with
          !item.poolMember.points.isZero() && (
            <PoolStakeItemComponent.IncreaseStakeChip onClick={() => setIsAddingStake(true)} />
          )
        }
        withdrawChip={
          item.withdrawable > 0n && (
            <WithdrawChip
              amount={<RedactableBalance>{decimal.fromPlanck(item.withdrawable).toHuman()}</RedactableBalance>}
              onClick={() => {
                void withdrawExtrinsic.signAndSend(
                  item.account?.address ?? '',
                  item.account?.address ?? '',
                  item.slashingSpan
                )
              }}
              loading={withdrawExtrinsic.state === 'loading'}
            />
          )
        }
        status={
          item.totalUnlocking > 0n && (
            <PoolStakeItemComponent.UnstakingStatus
              amount={<RedactableBalance>{decimal.fromPlanck(item.totalUnlocking).toHuman()}</RedactableBalance>}
              unlocks={unlocks ?? []}
            />
          )
        }
      />
      <AddStakeDialog
        account={isAddingStake ? item.account?.address : undefined}
        onDismiss={useCallback(() => setIsAddingStake(false), [])}
      />
      <UnstakeDialog
        account={isUnstaking ? item.account?.address : undefined}
        onDismiss={useCallback(() => setIsUnstaking(false), [])}
      />
      <ClaimStakeDialog
        open={claimDialogOpen}
        amount={pendingRewards.decimalAmount?.toHuman() ?? '...'}
        fiatAmount={pendingRewards.localizedFiatAmount ?? '...'}
        onRequestDismiss={useCallback(() => setClaimDialogOpen(false), [])}
        onRequestClaim={useCallback(() => {
          void claimPayoutExtrinsic.signAndSend(item.account?.address ?? '')
          setClaimDialogOpen(false)
        }, [claimPayoutExtrinsic, item.account?.address])}
        onRequestReStake={useCallback(() => {
          void restakeExtrinsic.signAndSend(item.account?.address ?? '', { Rewards: item.pendingRewards })
          setClaimDialogOpen(false)
        }, [item.account?.address, item.pendingRewards, restakeExtrinsic])}
      />
    </>
  )
}

export default PoolStakeItem
