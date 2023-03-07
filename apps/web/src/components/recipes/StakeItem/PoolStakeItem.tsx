import { ReactNode } from 'react'

import StakeItem, { StakeItemProps } from './StakeItem'

export type PoolStakeItemProps = Omit<StakeItemProps, 'actions'> & {
  increaseStakeChip?: ReactNode
  unstakeChip?: ReactNode
  claimChip?: ReactNode
  withdrawChip?: ReactNode
}

const PoolStakeItem = ({ increaseStakeChip, unstakeChip, claimChip, withdrawChip, ...props }: PoolStakeItemProps) => {
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
}

export default PoolStakeItem
