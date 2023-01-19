import PoolStake, { PoolStakeProps } from '@components/recipes/PoolStake/PoolStake'
import { PoolStatus } from '@components/recipes/PoolStatusIndicator'
import { UInt } from '@polkadot/types-codec'
import { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup'
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
  const [decimalFromAtomics, nativeTokenPrice] = useRecoilValue(
    waitForAll([nativeTokenDecimalState, nativeTokenPriceState('usd')])
  )

  const claimPayoutExtrinsic = useExtrinsic('nominationPools', 'claimPayout')

  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isAddingStake, setIsAddingStake] = useState(false)

  return (
    <>
      <PoolStake
        className={className}
        variant={variant}
        poolStatus={item.status}
        accountName={item.account?.name ?? ''}
        accountAddress={item.account?.address ?? ''}
        stakingAmount={decimalFromAtomics.fromAtomics(item.poolMember.points).toHuman()}
        stakingAmountInFiat={(
          decimalFromAtomics.fromAtomics(item.poolMember.points).toNumber() * nativeTokenPrice
        ).toLocaleString(undefined, { style: 'currency', currency: 'usd', currencyDisplay: 'narrowSymbol' })}
        rewardsAmount={'+' + decimalFromAtomics.fromAtomics(item.pendingRewards?.toString()).toHuman()}
        rewardsAmountInFiat={
          '+' +
          (decimalFromAtomics.fromAtomics(item.pendingRewards).toNumber() * nativeTokenPrice).toLocaleString(
            undefined,
            { style: 'currency', currency: 'usd', currencyDisplay: 'narrowSymbol' }
          )
        }
        poolName={item.poolName ?? ''}
        onRequestClaim={() => claimPayoutExtrinsic.signAndSend(item.account?.address ?? '')}
        claimState={
          item.pendingRewards?.isZero() ?? true
            ? 'unavailable'
            : claimPayoutExtrinsic.state === 'loading'
            ? 'pending'
            : undefined
        }
        onRequestUnstake={() => setIsUnstaking(true)}
        onRequestAdd={() => setIsAddingStake(true)}
      />
      <AddStakeDialog
        account={isAddingStake ? item.account?.address : undefined}
        onDismiss={useCallback(() => setIsAddingStake(false), [])}
      />
      <UnstakeDialog
        account={isUnstaking ? item.account?.address : undefined}
        onDismiss={useCallback(() => setIsUnstaking(false), [])}
      />
    </>
  )
}

export default PoolStakeItem
