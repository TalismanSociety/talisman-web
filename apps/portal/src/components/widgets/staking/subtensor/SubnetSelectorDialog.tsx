import { useState } from 'react'

import { StakeTargetSelectorDialog } from '@/components/recipes/StakeTargetSelectorDialog'
import { useGetSubnetPools } from '@/domains/staking/subtensor/hooks/useGetSubnetPools'
import { SubnetPool } from '@/domains/staking/subtensor/types'

import { SubnetSelectorCard, SubnetSelectorCardProps } from './SubnetSelectorCard'

type SubnetSelectorDialogProps = {
  selected: SubnetPool | undefined
  onRequestDismiss: () => void
  onConfirm: (subnetPool: SubnetPool) => void
}

export const SubnetSelectorDialog = ({ selected, onRequestDismiss, onConfirm }: SubnetSelectorDialogProps) => {
  const { data: { data: subnetPools = [] } = {} } = useGetSubnetPools()

  const [highlighted, setHighlighted] = useState(selected)

  return (
    <StakeTargetSelectorDialog<SubnetSelectorCardProps>
      title="Select a subnet"
      currentSelectionLabel="Selected subnet"
      selectionLabel="New subnet"
      confirmButtonContent="Swap subnet"
      onRequestDismiss={onRequestDismiss}
      onConfirm={() => highlighted && onConfirm(highlighted)}
      sortMethods={{
        Default: () => {
          console.log('Default sort method')
          return 0
        },
        'Total TAO': (a, b) => {
          return (b.props.subnetPool.total_tao ?? 0) === (a.props.subnetPool.total_tao ?? 0)
            ? 0
            : (Number(b.props.subnetPool.total_tao) || 0) - (Number(a.props.subnetPool.total_tao) || 0) < 0
            ? -1
            : 1
        },
      }}
    >
      {subnetPools.map(subnet => {
        return (
          <SubnetSelectorCard
            key={subnet.netuid}
            subnetPool={subnet}
            onClick={setHighlighted}
            selected={subnet.netuid === selected?.netuid}
            highlighted={subnet.netuid === highlighted?.netuid}
          />
        )
      })}
    </StakeTargetSelectorDialog>
  )
}
