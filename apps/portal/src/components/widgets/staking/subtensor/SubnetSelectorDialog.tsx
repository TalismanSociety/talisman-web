import { useEffect, useMemo, useState } from 'react'

import { StakeTargetSelectorDialog } from '@/components/recipes/StakeTargetSelectorDialog'
import { useCombineSubnetData } from '@/domains/staking/subtensor/hooks/useCombineSubnetData'
import { type BondOption, type SubnetData } from '@/domains/staking/subtensor/types'

import { DEFAULT_VALIDATOR, ROOT_NETUID } from './constants'
import { SubnetSelectorCard, SubnetSelectorCardProps } from './SubnetSelectorCard'

type SubnetSelectorDialogProps = {
  selected: SubnetData | undefined
  onRequestDismiss: () => void
  onHandleSubnetSelectConfirm: (subnet: SubnetData | undefined) => void
  onSetDelegate: React.Dispatch<React.SetStateAction<BondOption | undefined>>
}

export const SubnetSelectorDialog = ({
  selected,
  onRequestDismiss,
  onHandleSubnetSelectConfirm,
  onSetDelegate,
}: SubnetSelectorDialogProps) => {
  const [highlighted, setHighlighted] = useState<SubnetData | undefined>(selected)
  const [search, setSearch] = useState<string>('')
  const { subnetData, isError } = useCombineSubnetData()
  const filteredSubnets = useMemo(
    () => Object.values(subnetData).filter(subnet => subnet.netuid !== ROOT_NETUID),
    [subnetData]
  )
  const [filteredData, setFilteredData] = useState<SubnetData[]>(filteredSubnets)

  useEffect(() => {
    setFilteredData(filteredSubnets)
  }, [filteredSubnets])

  const handleSearch = (search: string) => {
    if (!search) {
      setFilteredData(filteredSubnets)
      setSearch('')
      return
    }
    const filtered = filteredSubnets.filter(subnet => {
      const { netuid, subnet_name, symbol } = subnet
      const subnetName = `${netuid} ${subnet_name} ${symbol}`.toLowerCase()
      return subnetName.includes(search.toLowerCase())
    })
    setFilteredData(selected ? [...filtered, selected] : filtered)
    setSearch(search)
  }

  const handleSubnetSelectConfirm = (subnet: SubnetData) => {
    onHandleSubnetSelectConfirm(subnet)
    onSetDelegate(DEFAULT_VALIDATOR)
  }

  return (
    <StakeTargetSelectorDialog<SubnetSelectorCardProps>
      title={selected ? 'Select a subnet' : ''}
      currentSelectionLabel="Selected subnet"
      selectionLabel="New subnet"
      confirmButtonContent={selected ? 'Swap subnet' : 'Select subnet'}
      onRequestDismiss={onRequestDismiss}
      onConfirm={() => highlighted && handleSubnetSelectConfirm(highlighted)}
      isSortDisabled={isError}
      onHandleSearch={handleSearch}
      searchLabel={'Search name or number'}
      search={search}
      sortMethods={{
        'Total Alpha': (a, b) => {
          return (b.props.subnetPool.total_alpha ?? 0) === (a.props.subnetPool.total_alpha ?? 0)
            ? 0
            : (Number(b.props.subnetPool.total_alpha) || 0) - (Number(a.props.subnetPool.total_alpha) || 0) < 0
            ? -1
            : 1
        },
        'Total TAO': (a, b) => {
          return (b.props.subnetPool.total_tao ?? 0) === (a.props.subnetPool.total_tao ?? 0)
            ? 0
            : (Number(b.props.subnetPool.total_tao) || 0) - (Number(a.props.subnetPool.total_tao) || 0) < 0
            ? -1
            : 1
        },
        'Subnet UID': (a, b) => {
          return (b.props.subnetPool.netuid ?? 0) === (a.props.subnetPool.netuid ?? 0)
            ? 0
            : (Number(b.props.subnetPool.netuid) || 0) - (Number(a.props.subnetPool.netuid) || 0) < 0
            ? 1
            : -1
        },
      }}
    >
      {filteredData.map(subnet => {
        return (
          <SubnetSelectorCard
            key={subnet.netuid}
            subnetPool={subnet}
            onClick={setHighlighted}
            selected={subnet.netuid === selected?.netuid}
            highlighted={subnet.netuid === highlighted?.netuid}
            isError={isError}
          />
        )
      })}
    </StakeTargetSelectorDialog>
  )
}
