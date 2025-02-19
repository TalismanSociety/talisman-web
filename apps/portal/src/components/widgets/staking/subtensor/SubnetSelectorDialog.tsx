import { useState } from 'react'

import { StakeTargetSelectorDialog } from '@/components/recipes/StakeTargetSelectorDialog'
import { useCombineSubnetData } from '@/domains/staking/subtensor/hooks/useCombineSubnetData'
import { type SubnetData } from '@/domains/staking/subtensor/types'

import { ROOT_NETUID } from './constants'
import { SubnetSelectorCard, SubnetSelectorCardProps } from './SubnetSelectorCard'

type SubnetSelectorDialogProps = {
  selected: SubnetData | undefined
  onRequestDismiss: () => void
  onConfirm: (subnetPool: SubnetData) => void
}

export const SubnetSelectorDialog = ({ selected, onRequestDismiss, onConfirm }: SubnetSelectorDialogProps) => {
  const { subnetData } = useCombineSubnetData()

  const [highlighted, setHighlighted] = useState(selected)

  const filteredSubnets = Object.values(subnetData).filter(subnet => subnet.netuid !== ROOT_NETUID)

  return (
    <StakeTargetSelectorDialog<SubnetSelectorCardProps>
      title={selected ? 'Select a subnet' : ''}
      currentSelectionLabel="Selected subnet"
      selectionLabel="New subnet"
      confirmButtonContent={selected ? 'Swap subnet' : 'Select subnet'}
      onRequestDismiss={onRequestDismiss}
      onConfirm={() => highlighted && onConfirm(highlighted)}
      sortMethods={{
        Default: () => {
          return 0
        },
        'Subnet ID': (a, b) => {
          return (b.props.subnetPool.netuid ?? 0) === (a.props.subnetPool.netuid ?? 0)
            ? 0
            : (Number(b.props.subnetPool.netuid) || 0) - (Number(a.props.subnetPool.netuid) || 0) < 0
            ? 1
            : -1
        },
        'Total TAO': (a, b) => {
          return (b.props.subnetPool.total_tao ?? 0) === (a.props.subnetPool.total_tao ?? 0)
            ? 0
            : (Number(b.props.subnetPool.total_tao) || 0) - (Number(a.props.subnetPool.total_tao) || 0) < 0
            ? -1
            : 1
        },
        'Total Alpha': (a, b) => {
          return (b.props.subnetPool.total_alpha ?? 0) === (a.props.subnetPool.total_alpha ?? 0)
            ? 0
            : (Number(b.props.subnetPool.total_alpha) || 0) - (Number(a.props.subnetPool.total_alpha) || 0) < 0
            ? -1
            : 1
        },
      }}
    >
      {filteredSubnets.map(subnet => {
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
