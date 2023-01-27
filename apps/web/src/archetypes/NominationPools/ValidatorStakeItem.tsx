import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import ValidatorStake from '@components/recipes/ValidatorStake'
import { DeriveStakerReward, DeriveStakingAccount } from '@polkadot/api-derive/types'
import BN from 'bn.js'
import { useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { nativeTokenDecimalState, nativeTokenPriceState } from '../../domains/chains/recoils'
import ValidatorUnstakeDialog from './ValidatorUnstakeDialog'

const ValidatorStakeItem = (props: {
  account: { address: string; name?: string }
  stake: DeriveStakingAccount
  rewards?: DeriveStakerReward[]
}) => {
  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false)

  const [decimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([nativeTokenDecimalState, nativeTokenPriceState('usd')])
  )

  const active = decimal.fromPlanck(props.stake.stakingLedger.active)
  const rewards = decimal.fromPlanck(
    props.rewards?.reduce(
      (prev, curr) => prev.add(Object.values(curr.validators).reduce((prev, curr) => prev.add(curr.value), new BN(0))),
      new BN(0)
    )
  )

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
        rewardsAmount={props.rewards === undefined ? <CircularProgressIndicator size="1em" /> : '+' + rewards.toHuman()}
        rewardsAmountInFiat={
          props.rewards === undefined
            ? ''
            : '+' +
              (rewards.toNumber() * nativeTokenPrice).toLocaleString(undefined, {
                style: 'currency',
                currency: 'usd',
                currencyDisplay: 'narrowSymbol',
              })
        }
        onRequestUnstake={() => setIsUnstakeDialogOpen(true)}
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
