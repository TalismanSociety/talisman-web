import { useEffect } from 'react'

import type { Account } from '@/domains/accounts/recoils'
import { ClaimStakeDialog as ClaimStakeDialogComponent } from '@/components/recipes/ClaimStakeDialog'
import { SubmittableResultLoadable, useExtrinsic } from '@/domains/common/hooks/useExtrinsic'
import { useTokenAmountFromPlanck } from '@/domains/common/hooks/useTokenAmount'
import { usePoolStakes } from '@/domains/staking/substrate/nominationPools/hooks'

type ClaimStakeDialogProps = {
  open?: boolean
  account: Account
  onRequestDismiss: () => unknown
  onChangeClaimPayoutLoadable: (loadable: SubmittableResultLoadable) => unknown
  onChangeRestakeLoadable: (loadable: SubmittableResultLoadable) => unknown
}

const ClaimStakeDialog = (props: ClaimStakeDialogProps) => {
  const pool = usePoolStakes(props.account)
  const rewards = useTokenAmountFromPlanck(pool?.pendingRewards)

  const claimPayoutExtrinsic = useExtrinsic('nominationPools', 'claimPayout')
  const restakeExtrinsic = useExtrinsic('nominationPools', 'bondExtra', [{ Rewards: true }])

  useEffect(() => {
    props.onChangeClaimPayoutLoadable(claimPayoutExtrinsic)
  }, [claimPayoutExtrinsic, props])

  useEffect(() => {
    props.onChangeRestakeLoadable(restakeExtrinsic)
  }, [props, restakeExtrinsic])

  return (
    <ClaimStakeDialogComponent
      open={props.open}
      amount={rewards.decimalAmount?.toLocaleString() ?? '...'}
      fiatAmount={rewards.localizedFiatAmount ?? '...'}
      onRequestDismiss={props.onRequestDismiss}
      onRequestClaim={() => {
        void claimPayoutExtrinsic.signAndSend(props.account.address)
        props.onRequestDismiss()
      }}
      onRequestReStake={() => {
        void restakeExtrinsic.signAndSend(props.account.address)
        props.onRequestDismiss()
      }}
    />
  )
}

export default ClaimStakeDialog
