import { useState } from 'react'

import { StakeTargetSelectorDialog } from '@/components/recipes/StakeTargetSelectorDialog'
import { useGetSubnetPools } from '@/domains/staking/subtensor/hooks/useGetSubnetPools'

import { SubnetSelectorCard, SubnetSelectorCardProps } from './SubnetSelectorCard'

const DEFAULT_SUBNET = 0

type SubnetSelectorDialogProps = {
  selected?: unknown
  onRequestDismiss: () => void
  onConfirm: (delegate: unknown) => void
}

export const SubnetSelectorDialog = (props: SubnetSelectorDialogProps) => {
  const { data: { data: subnetPools = [] } = {}, isLoading, error } = useGetSubnetPools()
  console.log({ isLoading, error, subnetPools })
  const subnets = { 0: { name: 'Root Subnet' } }

  const [highlighted, setHighlighted] = useState(subnets[DEFAULT_SUBNET] ?? Object.values(subnets)[0])

  return (
    <StakeTargetSelectorDialog<SubnetSelectorCardProps>
      title="Select a subnet"
      currentSelectionLabel="Selected subnet"
      selectionLabel="New subnet"
      confirmButtonContent="Swap subnet"
      onRequestDismiss={props.onRequestDismiss}
      onConfirm={() => console.log('Confirmed sir')}
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
            onClick={() => console.log('Clicked!')}
            // selected={subnet.netuid === highlighted?.netuid}
            selected={subnet.netuid === 3}
          />
        )
      })}
    </StakeTargetSelectorDialog>
  )
}
