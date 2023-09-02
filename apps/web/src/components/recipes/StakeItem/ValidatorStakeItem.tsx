import { ReactNode } from 'react'

import StakeItem, {
  FastUnstakeChip,
  FastUnstakingStatus,
  StakeItemProps,
  UnstakeChip,
  UnstakingStatus,
  WithdrawChip,
} from './StakeItem'

export type ValidatorStakeItemProps = Omit<StakeItemProps, 'poolName' | 'actions'> & {
  unstakeChip?: ReactNode
  withdrawChip?: ReactNode
}

const ValidatorStakeItem = Object.assign(
  ({ unstakeChip, withdrawChip, ...props }: ValidatorStakeItemProps) => {
    return (
      <StakeItem
        {...props}
        poolName="Validator staking"
        actions={
          <>
            {withdrawChip}
            {unstakeChip}
          </>
        }
      />
    )
  },
  { UnstakeChip, FastUnstakeChip, WithdrawChip, UnstakingStatus, FastUnstakingStatus }
)

export default ValidatorStakeItem
