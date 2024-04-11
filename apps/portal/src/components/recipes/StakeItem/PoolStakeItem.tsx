import { type ReactNode } from 'react'

import StakeItem, {
  ClaimChip,
  IncreaseStakeChip,
  type StakeItemProps,
  UnstakeChip,
  UnstakingStatus,
  WithdrawChip,
} from './StakeItem'

export type PoolStakeItemProps = Omit<StakeItemProps, 'actions'> & {
  increaseStakeChip?: ReactNode
  unstakeChip?: ReactNode
  claimChip?: ReactNode
  withdrawChip?: ReactNode
}

const PoolStakeItem = Object.assign(
  ({ increaseStakeChip, unstakeChip, claimChip, withdrawChip, ...props }: PoolStakeItemProps) => {
    return (
      <StakeItem
        {...props}
        actions={
          <>
            {withdrawChip}
            {claimChip}
            {unstakeChip}
            {increaseStakeChip}
          </>
        }
      />
    )
  },
  { IncreaseStakeChip, UnstakeChip, ClaimChip, WithdrawChip, UnstakingStatus }
)

export default PoolStakeItem
