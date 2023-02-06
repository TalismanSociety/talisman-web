import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import FastUnstakeDialog from '@components/recipes/FastUnstakeDialog'
import ValidatorStake from '@components/recipes/ValidatorStake'
import { Account } from '@domains/accounts/recoils'
import { useExtrinsic, useTokenAmountFromPlanck } from '@domains/common/hooks'
import { useLockDuration } from '@domains/nominationPools/hooks/useLockDuration'
import { DeriveStakingAccount } from '@polkadot/api-derive/types'
import { formatDistanceStrict } from 'date-fns'
import { useCallback, useMemo, useState } from 'react'

import ValidatorUnstakeDialog from './ValidatorUnstakeDialog'

const ValidatorStakeItem = (props: {
  account: Account
  stake: DeriveStakingAccount
  reward?: bigint
  eligibleForFastUnstake?: boolean
  potentiallyEligibleForFastUnstake: boolean
  inFastUnstakeHead?: boolean
  inFastUnstakeQueue?: boolean
}) => {
  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false)
  const [isFastUnstakeDialogOpen, setIsFastUnstakeDialogOpen] = useState(false)

  const lockDuration = useLockDuration()

  const amount = useTokenAmountFromPlanck(
    props.inFastUnstakeQueue || props.inFastUnstakeHead
      ? props.stake.unlocking?.[0]?.value
      : props.stake.stakingLedger.active.unwrap()
  )
  const reward = useTokenAmountFromPlanck(props.reward)

  const fastUnstake = useExtrinsic('fastUnstake', 'registerFastUnstake')

  return (
    <>
      <ValidatorStake
        accountName={props.account.name ?? ''}
        accountAddress={props.account.address}
        stakingAmount={amount.decimalAmount?.toHuman() ?? '...'}
        stakingAmountInFiat={amount.localizedFiatAmount ?? '...'}
        rewardsAmount={
          reward.decimalAmount === undefined ? (
            <CircularProgressIndicator size="1em" />
          ) : (
            '+' + reward.decimalAmount.toHuman()
          )
        }
        rewardsAmountInFiat={reward.localizedFiatAmount === undefined ? '' : '+' + reward.localizedFiatAmount}
        onRequestUnstake={useCallback(() => {
          if (props.potentiallyEligibleForFastUnstake && props.eligibleForFastUnstake !== false) {
            setIsFastUnstakeDialogOpen(true)
          } else {
            setIsUnstakeDialogOpen(true)
          }
        }, [props.eligibleForFastUnstake, props.potentiallyEligibleForFastUnstake])}
        unstakeState={
          props.inFastUnstakeHead
            ? 'head-of-fast-unstake-queue'
            : props.inFastUnstakeQueue
            ? 'in-fast-unstake-queue'
            : fastUnstake.state === 'loading'
            ? 'pending'
            : undefined
        }
        readonly={props.account.readonly}
      />
      <ValidatorUnstakeDialog
        accountAddress={props.stake.controllerId?.toString() ?? props.account.address}
        open={isUnstakeDialogOpen}
        onRequestDismiss={() => setIsUnstakeDialogOpen(false)}
      />
      <FastUnstakeDialog
        open={isFastUnstakeDialogOpen}
        fastUnstakeEligibility={useMemo(() => {
          switch (props.eligibleForFastUnstake) {
            case undefined:
              return 'pending'
            case true:
              return 'eligible'
            case false:
              return 'ineligible'
          }
        }, [props.eligibleForFastUnstake])}
        amount={amount.decimalAmount?.toHuman() ?? '...'}
        fiatAmount={amount.localizedFiatAmount ?? '...'}
        lockDuration={lockDuration === undefined ? '...' : formatDistanceStrict(0, lockDuration.toNumber())}
        onDismiss={useCallback(() => {
          setIsFastUnstakeDialogOpen(false)
        }, [])}
        onConfirm={useCallback(() => {
          if (props.eligibleForFastUnstake) {
            fastUnstake.signAndSend(props.account.address)
            setIsFastUnstakeDialogOpen(false)
          } else {
            setIsFastUnstakeDialogOpen(false)
            setIsUnstakeDialogOpen(true)
          }
        }, [fastUnstake, props.account.address, props.eligibleForFastUnstake])}
      />
    </>
  )
}

export default ValidatorStakeItem
