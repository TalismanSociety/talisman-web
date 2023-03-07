import {
  UnstakeChip,
  ValidatorStakeItem as ValidatorStakeItemComponent,
  WithdrawChip,
} from '@components/recipes/StakeItem'
import { Account } from '@domains/accounts/recoils'
import { useExtrinsic } from '@domains/common/hooks'
import { DeriveStakingAccount } from '@polkadot/api-derive/types'
import { useCallback, useState } from 'react'
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
  const rewards = decimal.fromPlanck(props.reward)

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
        unstakeChip={<UnstakeChip onClick={useCallback(() => setIsUnstakeDialogOpen(true), [])} />}
        withdrawChip={
          props.stake.redeemable?.isZero() === false && (
            <WithdrawChip
              amount={decimal.fromPlanck(props.stake.redeemable).toHuman()}
              onClick={() => withdrawExtrinsic.signAndSend(props.stake.controllerId ?? '', props.slashingSpan)}
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
