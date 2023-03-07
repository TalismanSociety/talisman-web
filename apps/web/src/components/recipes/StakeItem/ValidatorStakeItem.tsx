import { ReactNode } from 'react'

import StakeItem, { StakeItemProps } from './StakeItem'

export type ValidatorStakeItemProps = Omit<StakeItemProps, 'poolName' | 'actions'> & {
  unstakeChip?: ReactNode
  withdrawChip?: ReactNode
}

const ValidatorStakeItem = ({ unstakeChip, withdrawChip, ...props }: ValidatorStakeItemProps) => {
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
}

export default ValidatorStakeItem
