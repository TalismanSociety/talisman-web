import { ValidatorStakeItem as ValidatorStakeItemComponent } from '@components/recipes/StakeItem'
import { type Account } from '@domains/accounts/recoils'
import { useNativeTokenDecimalState, useNativeTokenPriceState } from '@domains/chains'
import { useExtrinsic } from '@domains/common/hooks'
import { useEraEtaFormatter } from '@domains/common/hooks/useEraEta'
import { type DeriveStakingAccount } from '@polkadot/api-derive/types'
import { CircularProgressIndicator } from '@talismn/ui'
import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import ValidatorUnstakeDialog from './ValidatorUnstakeDialog'
import AnimatedFiatNumber from '../AnimatedFiatNumber'
import RedactableBalance from '../RedactableBalance'

const ValidatorStakeItem = (props: {
  account: Account
  stake: DeriveStakingAccount
  reward?: bigint
  slashingSpan: number
}) => {
  const withdrawExtrinsic = useExtrinsic('staking', 'withdrawUnbonded')

  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false)

  const [decimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([useNativeTokenDecimalState(), useNativeTokenPriceState()])
  )

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

  return (
    <>
      <ValidatorStakeItemComponent
        stakeStatus={
          props.reward === undefined ? undefined : props.reward === 0n ? 'not_earning_rewards' : 'earning_rewards'
        }
        readonly={props.account.readonly}
        accountName={props.account.name ?? ''}
        accountAddress={props.account.address}
        stakingAmount={<RedactableBalance>{active.toHuman()}</RedactableBalance>}
        stakingFiatAmount={<AnimatedFiatNumber end={active.toNumber() * nativeTokenPrice} />}
        unstakeChip={
          <ValidatorStakeItemComponent.UnstakeChip onClick={useCallback(() => setIsUnstakeDialogOpen(true), [])} />
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
          totalUnlocking?.isZero() === false && (
            <ValidatorStakeItemComponent.UnstakingStatus
              amount={<RedactableBalance>{decimal.fromPlanck(totalUnlocking).toHuman()}</RedactableBalance>}
              unlocks={unlocks ?? []}
            />
          )
        }
      />
      <ValidatorUnstakeDialog
        accountAddress={props.stake.controllerId?.toString() ?? props.account.address}
        open={isUnstakeDialogOpen}
        onRequestDismiss={() => setIsUnstakeDialogOpen(false)}
      />
    </>
  )
}

export default ValidatorStakeItem
