import FastUnstakeDialog from '@components/recipes/FastUnstakeDialog'
import { ValidatorStakeItem as ValidatorStakeItemComponent } from '@components/recipes/StakeItem'
import { type Account } from '@domains/accounts/recoils'
import { useNativeTokenDecimalState, useNativeTokenPriceState } from '@domains/chains'
import { useSubstrateApiState } from '@domains/common'
import { useExtrinsic, useTokenAmountFromPlanck } from '@domains/common/hooks'
import { useEraEtaFormatter } from '@domains/common/hooks/useEraEta'
import { useLocalizedLockDuration } from '@domains/nominationPools'
import { type DeriveStakingAccount } from '@polkadot/api-derive/types'
import { useDeriveState } from '@talismn/react-polkadot-api'
import { CircularProgressIndicator } from '@talismn/ui'
import BN from 'bn.js'
import { useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import AnimatedFiatNumber from '../AnimatedFiatNumber'
import RedactableBalance from '../RedactableBalance'
import ValidatorUnstakeDialog from './ValidatorUnstakeDialog'

const ValidatorStakeItem = (props: {
  account: Account
  stake: DeriveStakingAccount
  reward?: bigint
  slashingSpan: number
  eligibleForFastUnstake?: boolean
  inFastUnstakeHead?: boolean
  inFastUnstakeQueue?: boolean
  fastUnstakeDeposit?: BN
}) => {
  const withdrawExtrinsic = useExtrinsic('staking', 'withdrawUnbonded')
  const fastUnstake = useExtrinsic('fastUnstake', 'registerFastUnstake')

  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false)
  const [isFastUnstakeDialogOpen, setIsFastUnstakeDialogOpen] = useState(false)

  const lockDuration = useLocalizedLockDuration()

  const [api, balances, decimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([
      useSubstrateApiState(),
      useDeriveState('balances', 'all', [props.account.address]),
      useNativeTokenDecimalState(),
      useNativeTokenPriceState(),
    ])
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

  const hasEnoughDepositForFastUnstake = useMemo(
    () =>
      balances.availableBalance.gte(api.consts.balances.existentialDeposit.add(props.fastUnstakeDeposit ?? new BN(0))),
    [api.consts.balances.existentialDeposit, balances.availableBalance, props.fastUnstakeDeposit]
  )

  const eraEtaFormatter = useEraEtaFormatter()
  const unlocks = props.stake.unlocking?.map(x => ({
    amount: decimal.fromPlanck(x.value).toHuman(),
    eta: eraEtaFormatter(x.remainingEras) ?? <CircularProgressIndicator size="1em" />,
  }))

  const onRequestUnstake = () => {
    if (props.eligibleForFastUnstake || props.eligibleForFastUnstake === undefined) {
      setIsFastUnstakeDialogOpen(true)
    } else {
      setIsUnstakeDialogOpen(true)
    }
  }

  return (
    <>
      <ValidatorStakeItemComponent
        stakeStatus={
          props.reward === undefined ? undefined : props.reward === 0n ? 'not_earning_rewards' : 'earning_rewards'
        }
        readonly={props.account.readonly}
        account={props.account}
        stakingAmount={<RedactableBalance>{active.toHuman()}</RedactableBalance>}
        stakingFiatAmount={<AnimatedFiatNumber end={active.toNumber() * nativeTokenPrice} />}
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
              amount={<RedactableBalance>{decimal.fromPlanck(props.stake.redeemable).toHuman()}</RedactableBalance>}
              onClick={() => {
                void withdrawExtrinsic.signAndSend(props.stake.controllerId ?? '', props.slashingSpan)
              }}
              loading={withdrawExtrinsic.state === 'loading'}
            />
          )
        }
        status={
          totalUnlocking?.isZero() === false ? (
            props.inFastUnstakeHead || props.inFastUnstakeQueue ? (
              <ValidatorStakeItemComponent.FastUnstakingStatus
                amount={<RedactableBalance>{decimal.fromPlanck(totalUnlocking).toHuman()}</RedactableBalance>}
                status={props.inFastUnstakeHead ? 'in-head' : props.inFastUnstakeQueue ? 'in-queue' : undefined}
              />
            ) : (
              <ValidatorStakeItemComponent.UnstakingStatus
                amount={<RedactableBalance>{decimal.fromPlanck(totalUnlocking).toHuman()}</RedactableBalance>}
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
              return hasEnoughDepositForFastUnstake ? 'eligible' : 'insufficient-balance-for-deposit'
            case false:
              return 'ineligible'
          }
        }, [hasEnoughDepositForFastUnstake, props.eligibleForFastUnstake])}
        amount={amount.decimalAmount?.toHuman() ?? '...'}
        fiatAmount={amount.localizedFiatAmount ?? '...'}
        lockDuration={lockDuration}
        depositAmount={decimal.fromPlanck(props.fastUnstakeDeposit).toHuman()}
        onDismiss={() => {
          setIsFastUnstakeDialogOpen(false)
        }}
        onSkip={() => {
          setIsFastUnstakeDialogOpen(false)
          setIsUnstakeDialogOpen(true)
        }}
        onConfirm={() => {
          if (props.eligibleForFastUnstake && hasEnoughDepositForFastUnstake) {
            void fastUnstake.signAndSend(props.account.address)
            setIsFastUnstakeDialogOpen(false)
          } else {
            setIsFastUnstakeDialogOpen(false)
            setIsUnstakeDialogOpen(true)
          }
        }}
        learnMoreHref="https://wiki.polkadot.network/docs/learn-staking#fast-unstake"
      />
    </>
  )
}

export default ValidatorStakeItem
