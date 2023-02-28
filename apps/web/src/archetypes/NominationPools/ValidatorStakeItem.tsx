import ValidatorStake from '@components/recipes/ValidatorStake'
import { Account } from '@domains/accounts/recoils'
import { DeriveStakingAccount } from '@polkadot/api-derive/types'
import { CircularProgressIndicator } from '@talismn/ui'
import { useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import ValidatorUnstakeDialog from './ValidatorUnstakeDialog'

const ValidatorStakeItem = (props: { account: Account; stake: DeriveStakingAccount; reward?: bigint }) => {
  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false)

  const [decimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([nativeTokenDecimalState, nativeTokenPriceState('usd')])
  )

  const active = decimal.fromPlanck(props.stake.stakingLedger.active)
  const rewards = decimal.fromPlanck(props.reward)

  return (
    <>
      <ValidatorStake
        accountName={props.account.name ?? ''}
        accountAddress={props.account.address}
        stakingAmount={active.toHuman()}
        stakingAmountInFiat={(active.toNumber() * nativeTokenPrice).toLocaleString(undefined, {
          style: 'currency',
          currency: 'usd',
          currencyDisplay: 'narrowSymbol',
        })}
        rewardsAmount={props.reward === undefined ? <CircularProgressIndicator size="1em" /> : '+' + rewards.toHuman()}
        rewardsAmountInFiat={
          props.reward === undefined
            ? ''
            : '+' +
              (rewards.toNumber() * nativeTokenPrice).toLocaleString(undefined, {
                style: 'currency',
                currency: 'usd',
                currencyDisplay: 'narrowSymbol',
              })
        }
        onRequestUnstake={() => setIsUnstakeDialogOpen(true)}
        readonly={props.account.readonly}
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
