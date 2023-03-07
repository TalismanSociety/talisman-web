import { ReactNode } from 'react'

import StakeItem, { StakeItemProps } from './StakeItem'

export type ValidatorStakeItemProps = Omit<StakeItemProps, 'actions'> & {
  unstakeChip?: ReactNode
}

const ValidatorStakeItem = ({ unstakeChip, ...props }: ValidatorStakeItemProps) => {
  return <StakeItem {...props} actions={<>{unstakeChip}</>} />
}

export default ValidatorStakeItem
