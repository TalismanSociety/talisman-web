import { PoolStakeItem as PoolStakeItemComponent, WithdrawChip } from '@components/recipes/StakeItem'
import { useEraEtaFormatter, useExtrinsic, useSubmittableResultLoadableState } from '@domains/common'
import { useCallback, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { type Account } from '@domains/accounts'
import { useNativeTokenDecimalState, useNativeTokenPriceState } from '@domains/chains'
import { type usePoolStakes } from '@domains/nominationPools'
import AnimatedFiatNumber from '../AnimatedFiatNumber'
import RedactableBalance from '../RedactableBalance'
import AddStakeDialog from './AddStakeDialog'
import ClaimStakeDialog from './ClaimStakeDialog'
import UnstakeDialog from './UnstakeDialog'

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
  const [claimPayoutLoadable, setClaimPayoutLoadable] = useSubmittableResultLoadableState()
  const [restakeLoadable, setRestakeLoadable] = useSubmittableResultLoadableState()

  const withdrawExtrinsic = useExtrinsic('nominationPools', 'withdrawUnbonded')

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
        account={item.account}
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
              loading={claimPayoutLoadable.state === 'loading' || restakeLoadable.state === 'loading'}
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
        onRequestDismiss={() => setClaimDialogOpen(false)}
        account={item.account}
        onChangeClaimPayoutLoadable={setClaimPayoutLoadable}
        onChangeRestakeLoadable={setRestakeLoadable}
      />
    </>
  )
}

export default PoolStakeItem
