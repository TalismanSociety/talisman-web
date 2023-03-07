import { ReactNode } from 'react'

import StakeItem, { StakeItemProps } from './StakeItem'

export type PoolStakeItemProps = Omit<StakeItemProps, 'actions'> & {
  increaseStakeChip?: ReactNode
  unstakeChip?: ReactNode
  claimChip?: ReactNode
}

const PoolStakeItem = ({ increaseStakeChip, unstakeChip, claimChip, ...props }: PoolStakeItemProps) => {
  return (
    <StakeItem
      {...props}
      actions={
        <>
          {claimChip}
          {unstakeChip}
          {increaseStakeChip}
        </>
      }
    />
  )
}

export default PoolStakeItem
