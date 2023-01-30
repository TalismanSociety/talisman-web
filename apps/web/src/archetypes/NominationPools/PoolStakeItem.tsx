import ClaimStakeDialog from '@components/recipes/ClaimStakeDialog'
import PoolStake, { PoolStakeProps } from '@components/recipes/PoolStake/PoolStake'
import { PoolStatus } from '@components/recipes/PoolStatusIndicator'
import { useTokenAmountFromPlanck } from '@domains/common/hooks'
import { useLockDuration } from '@domains/nominationPools/hooks/useLockDuration'
import { UInt } from '@polkadot/types-codec'
import { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup'
import { formatDistance } from 'date-fns'
import { ReactNode, useCallback, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import useExtrinsic from '../../domains/common/hooks/useExtrinsic'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'

const PoolStakeItem = ({
  className,
  variant,
  item,
}: {
  className?: string
  variant?: PoolStakeProps['variant']
  item: {
    status?: PoolStatus
    account?: {
      address: string
      name?: string
    }
    poolName?: ReactNode
    poolMember: PalletNominationPoolsPoolMember
    pendingRewards?: UInt
  }
}) => {
  const [decimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([nativeTokenDecimalState, nativeTokenPriceState('usd')])
  )

  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isAddingStake, setIsAddingStake] = useState(false)

  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const lockDuration = useLockDuration()
  const claimPayoutExtrinsic = useExtrinsic('nominationPools', 'claimPayout')
  const restakeExtrinsic = useExtrinsic('nominationPools', 'bondExtra')

  const pendingRewards = useTokenAmountFromPlanck(item.pendingRewards)

  return (
    <>
      <PoolStake
        className={className}
        variant={variant}
        poolStatus={item.status}
        accountName={item.account?.name ?? ''}
        accountAddress={item.account?.address ?? ''}
        stakingAmount={decimal.fromPlanck(item.poolMember.points).toHuman()}
        stakingAmountInFiat={(decimal.fromPlanck(item.poolMember.points).toNumber() * nativeTokenPrice).toLocaleString(
          undefined,
          { style: 'currency', currency: 'usd', currencyDisplay: 'narrowSymbol' }
        )}
        rewardsAmount={'+' + decimal.fromPlanck(item.pendingRewards?.toString()).toHuman()}
        rewardsAmountInFiat={'+' + pendingRewards.localizedFiatAmount}
        poolName={item.poolName ?? ''}
        onRequestClaim={useCallback(() => setClaimDialogOpen(true), [])}
        claimState={
          item.pendingRewards?.isZero() ?? true
            ? 'unavailable'
            : claimPayoutExtrinsic.state === 'loading' || restakeExtrinsic.state === 'loading'
            ? 'pending'
            : undefined
        }
        onRequestUnstake={useCallback(() => setIsUnstaking(true), [])}
        onRequestAdd={useCallback(() => setIsAddingStake(true), [])}
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
        lockDuration={lockDuration === undefined ? '...' : formatDistance(0, lockDuration.toNumber())}
        onRequestDismiss={useCallback(() => setClaimDialogOpen(false), [])}
        onRequestClaim={useCallback(() => {
          claimPayoutExtrinsic.signAndSend(item.account?.address ?? '')
          setClaimDialogOpen(false)
        }, [claimPayoutExtrinsic, item.account?.address])}
        onRequestReStake={useCallback(() => {
          restakeExtrinsic.signAndSend(item.account?.address ?? '', { Rewards: item.pendingRewards })
          setClaimDialogOpen(false)
        }, [item.account?.address, item.pendingRewards, restakeExtrinsic])}
      />
    </>
  )
}

export default PoolStakeItem
