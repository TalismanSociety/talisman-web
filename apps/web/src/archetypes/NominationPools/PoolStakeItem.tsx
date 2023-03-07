import ClaimStakeDialog from '@components/recipes/ClaimStakeDialog'
import { PoolStatus } from '@components/recipes/PoolStatusIndicator'
import {
  ClaimChip,
  IncreaseStakeChip,
  PoolStakeItem as PoolStakeItemComponent,
  UnstakeChip,
  WithdrawChip,
} from '@components/recipes/StakeItem'
import { Account } from '@domains/accounts/recoils'
import { useTokenAmountFromPlanck } from '@domains/common/hooks'
import { UInt } from '@polkadot/types-codec'
import { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup'
import BN from 'bn.js'
import { ReactNode, useCallback, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import useExtrinsic from '../../domains/common/hooks/useExtrinsic'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'

const PoolStakeItem = ({
  item,
}: {
  className?: string
  item: {
    status?: PoolStatus
    account?: Account
    poolName?: ReactNode
    poolMember: PalletNominationPoolsPoolMember
    pendingRewards?: UInt
    withdrawable: bigint
    unbondings: {
      amount: bigint
      erasTilWithdrawable: BN
    }[]
    slashingSpan: number
  }
}) => {
  const [decimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([nativeTokenDecimalState, nativeTokenPriceState('usd')])
  )

  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isAddingStake, setIsAddingStake] = useState(false)

  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const claimPayoutExtrinsic = useExtrinsic('nominationPools', 'claimPayout')
  const restakeExtrinsic = useExtrinsic('nominationPools', 'bondExtra')
  const withdrawExtrinsic = useExtrinsic('nominationPools', 'withdrawUnbonded')

  const pendingRewards = useTokenAmountFromPlanck(item.pendingRewards)

  return (
    <>
      <PoolStakeItemComponent
        poolStatus={item.status}
        accountName={item.account?.name ?? ''}
        accountAddress={item.account?.address ?? ''}
        stakingAmount={decimal.fromPlanck(item.poolMember.points).toHuman()}
        stakingFiatAmount={(decimal.fromPlanck(item.poolMember.points).toNumber() * nativeTokenPrice).toLocaleString(
          undefined,
          { style: 'currency', currency: 'usd', currencyDisplay: 'narrowSymbol' }
        )}
        poolName={item.poolName ?? ''}
        claimChip={
          item.pendingRewards?.isZero() === false && (
            <ClaimChip
              amount={decimal.fromPlanck(item.pendingRewards).toHuman()}
              onClick={() => setClaimDialogOpen(true)}
            />
          )
        }
        unstakeChip={<UnstakeChip onClick={useCallback(() => setIsUnstaking(true), [])} />}
        increaseStakeChip={<IncreaseStakeChip onClick={useCallback(() => setIsAddingStake(true), [])} />}
        withdrawChip={
          item.withdrawable > 0n && (
            <WithdrawChip
              amount={decimal.fromPlanck(item.withdrawable).toHuman()}
              onClick={() =>
                withdrawExtrinsic.signAndSend(
                  item.account?.address ?? '',
                  item.account?.address ?? '',
                  item.slashingSpan
                )
              }
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
