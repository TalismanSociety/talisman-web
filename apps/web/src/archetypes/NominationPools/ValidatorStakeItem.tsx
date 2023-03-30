import FastUnstakeDialog from '@components/recipes/FastUnstakeDialog'
import { ValidatorStakeItem as ValidatorStakeItemComponent } from '@components/recipes/StakeItem'
import { Account } from '@domains/accounts/recoils'
import { useExtrinsic, useTokenAmountFromPlanck } from '@domains/common/hooks'
import { useEraEtaFormatter } from '@domains/common/hooks/useEraEta'
import { useLockDuration } from '@domains/nominationPools/hooks/useLockDuration'
import { DeriveStakingAccount } from '@polkadot/api-derive/types'
import { CircularProgressIndicator } from '@talismn/ui'
import BN from 'bn.js'
import { formatDistanceStrict } from 'date-fns'
import { useCallback, useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { nativeTokenPriceState, useNativeTokenDecimalState } from '../../domains/chains/recoils'
import ValidatorUnstakeDialog from './ValidatorUnstakeDialog'

const ValidatorStakeItem = (props: {
  account: Account
  stake: DeriveStakingAccount
  reward?: bigint
  slashingSpan: number
  eligibleForFastUnstake?: boolean
  potentiallyEligibleForFastUnstake: boolean
  inFastUnstakeHead?: boolean
  inFastUnstakeQueue?: boolean
}) => {
  const withdrawExtrinsic = useExtrinsic('staking', 'withdrawUnbonded')
  const fastUnstake = useExtrinsic('fastUnstake', 'registerFastUnstake')

  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false)
  const [isFastUnstakeDialogOpen, setIsFastUnstakeDialogOpen] = useState(false)

  const lockDuration = useLockDuration()

  const [decimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([useNativeTokenDecimalState(), nativeTokenPriceState('usd')])
  )

  const amount = useTokenAmountFromPlanck(
    props.inFastUnstakeQueue || props.inFastUnstakeHead
      ? props.stake.unlocking?.[0]?.value
      : props.stake.stakingLedger.active.unwrap()
  )
  // const reward = useTokenAmountFromPlanck(props.reward)

  const active = decimal.fromPlanck(props.stake.stakingLedger.active)
  // const rewards = decimal.fromPlanck(props.reward)

  const totalUnlocking = useMemo(
    () => props.stake.unlocking?.reduce((previous, current) => previous.add(current.value), new BN(0)),
    [props.stake.unlocking]
  )

  const eraEtaFormatter = useEraEtaFormatter()
  const unlocks = props.stake.unlocking?.map(x => ({
    amount: decimal.fromPlanck(x.value).toHuman(),
    eta: eraEtaFormatter(x.remainingEras) ?? <CircularProgressIndicator size="1em" />,
  }))

  const onRequestUnstake = useCallback(() => {
    if (
      props.eligibleForFastUnstake ||
      (props.potentiallyEligibleForFastUnstake && props.eligibleForFastUnstake !== false)
    ) {
      setIsFastUnstakeDialogOpen(true)
    } else {
      setIsUnstakeDialogOpen(true)
    }
  }, [props.eligibleForFastUnstake, props.potentiallyEligibleForFastUnstake])

  return (
    <>
      <ValidatorStakeItemComponent
        stakeStatus={
          props.reward === undefined ? undefined : props.reward === 0n ? 'not_earning_rewards' : 'earning_rewards'
        }
        readonly={props.account.readonly}
        accountName={props.account.name ?? ''}
        accountAddress={props.account.address}
        stakingAmount={active.toHuman()}
        stakingFiatAmount={(active.toNumber() * nativeTokenPrice).toLocaleString(undefined, {
          style: 'currency',
          currency: 'usd',
          currencyDisplay: 'narrowSymbol',
        })}
        unstakeChip={
          props.stake.stakingLedger.active.unwrap().isZero() ? undefined : props.eligibleForFastUnstake ? (
            !props.inFastUnstakeHead &&
            !props.inFastUnstakeQueue && <ValidatorStakeItemComponent.FastUnstakeChip onClick={onRequestUnstake} />
          ) : (
            <ValidatorStakeItemComponent.UnstakeChip onClick={onRequestUnstake} />
          )
        }
        withdrawChip={
          props.stake.redeemable?.isZero() === false && (
            <ValidatorStakeItemComponent.WithdrawChip
              amount={decimal.fromPlanck(props.stake.redeemable).toHuman()}
              onClick={() => withdrawExtrinsic.signAndSend(props.stake.controllerId ?? '', props.slashingSpan)}
              loading={withdrawExtrinsic.state === 'loading'}
            />
          )
        }
        status={
          totalUnlocking?.isZero() === false ? (
            props.inFastUnstakeHead || props.inFastUnstakeQueue ? (
              <ValidatorStakeItemComponent.FastUnstakingStatus
                amount={decimal.fromPlanck(totalUnlocking).toHuman()}
                status={props.inFastUnstakeHead ? 'in-head' : props.inFastUnstakeQueue ? 'in-queue' : undefined}
              />
            ) : (
              <ValidatorStakeItemComponent.UnstakingStatus
                amount={decimal.fromPlanck(totalUnlocking).toHuman()}
                unlocks={unlocks ?? []}
              />
            )
          ) : undefined
        }
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
