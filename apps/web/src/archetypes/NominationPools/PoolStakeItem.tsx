import ClaimStakeDialog from '@components/recipes/ClaimStakeDialog'
import { PoolStatus } from '@components/recipes/PoolStatusIndicator'
import { PoolStakeItem as PoolStakeItemComponent, WithdrawChip } from '@components/recipes/StakeItem'
import { Account } from '@domains/accounts/recoils'
import { useTokenAmountFromPlanck } from '@domains/common/hooks'
import { useEraEtaFormatter } from '@domains/common/hooks/useEraEta'
import { UInt } from '@polkadot/types-codec'
import { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup'
import { CircularProgressIndicator } from '@talismn/ui'
import BN from 'bn.js'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import useExtrinsic from '../../domains/common/hooks/useExtrinsic'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'

const PoolStakeItem = ({
  item,
  hideIdenticon,
}: {
  hideIdenticon?: boolean
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

  const totalUnlocking = useMemo(
    () => item.unbondings?.reduce((previous, current) => previous + current.amount, 0n),
    [item.unbondings]
  )

  const eraEtaFormatter = useEraEtaFormatter()
  const unlocks = item.unbondings?.map(x => ({
    amount: decimal.fromPlanck(x.amount).toHuman(),
    eta: eraEtaFormatter.valueMaybe()?.(x.erasTilWithdrawable) ?? <CircularProgressIndicator size="1em" />,
  }))

  return (
    <>
      <PoolStakeItemComponent
        hideIdenticon={hideIdenticon}
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
            <PoolStakeItemComponent.ClaimChip
              amount={decimal.fromPlanck(item.pendingRewards).toHuman()}
              onClick={() => setClaimDialogOpen(true)}
              loading={claimPayoutExtrinsic.state === 'loading' || restakeExtrinsic.state === 'loading'}
            />
          )
        }
        unstakeChip={<PoolStakeItemComponent.UnstakeChip onClick={useCallback(() => setIsUnstaking(true), [])} />}
        increaseStakeChip={
          <PoolStakeItemComponent.IncreaseStakeChip onClick={useCallback(() => setIsAddingStake(true), [])} />
        }
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
              loading={withdrawExtrinsic.state === 'loading'}
            />
          )
        }
        status={
          totalUnlocking > 0n && (
            <PoolStakeItemComponent.UnstakingStatus
              amount={decimal.fromPlanck(totalUnlocking).toHuman()}
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
