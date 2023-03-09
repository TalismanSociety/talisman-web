import { ValidatorStakeItem as ValidatorStakeItemComponent } from '@components/recipes/StakeItem'
import { Account } from '@domains/accounts/recoils'
import { useExtrinsic } from '@domains/common/hooks'
import { useEraEtaFormatter } from '@domains/common/hooks/useEraEta'
import { DeriveStakingAccount } from '@polkadot/api-derive/types'
import { CircularProgressIndicator } from '@talismn/ui'
import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import ValidatorUnstakeDialog from './ValidatorUnstakeDialog'

const ValidatorStakeItem = (props: {
  account: Account
  stake: DeriveStakingAccount
  reward?: bigint
  slashingSpan: number
}) => {
  const withdrawExtrinsic = useExtrinsic('staking', 'withdrawUnbonded')

  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false)

  const [decimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([nativeTokenDecimalState, nativeTokenPriceState('usd')])
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
    eta: eraEtaFormatter.valueMaybe()?.(x.remainingEras) ?? <CircularProgressIndicator size="1em" />,
  }))

  return (
    <>
      <ValidatorStakeItemComponent
        accountName={props.account.name ?? ''}
        accountAddress={props.account.address}
        stakingAmount={active.toHuman()}
        stakingFiatAmount={(active.toNumber() * nativeTokenPrice).toLocaleString(undefined, {
          style: 'currency',
          currency: 'usd',
          currencyDisplay: 'narrowSymbol',
        })}
        unstakeChip={
          <ValidatorStakeItemComponent.UnstakeChip onClick={useCallback(() => setIsUnstakeDialogOpen(true), [])} />
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
          totalUnlocking?.isZero() === false && (
            <ValidatorStakeItemComponent.UnstakingStatus
              amount={decimal.fromPlanck(totalUnlocking).toHuman()}
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
