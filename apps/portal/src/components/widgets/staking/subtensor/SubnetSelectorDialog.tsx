import { useState } from 'react'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

import type { Delegate } from '@/domains/staking/subtensor/atoms/delegates'
import { StakeTargetSelectorDialog } from '@/components/recipes/StakeTargetSelectorDialog'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
// import { DEFAULT_DELEGATE } from '@/domains/staking/subtensor/atoms/delegates'
import { useAllDelegateInfos } from '@/domains/staking/subtensor/hooks/useAllDelegateInfos'
import { useDelegates } from '@/domains/staking/subtensor/hooks/useDelegates'
import { useDelegatesStats } from '@/domains/staking/subtensor/hooks/useDelegatesStats'
import { useGetSubnetPools } from '@/domains/staking/subtensor/hooks/useGetSubnetPools'

const DEFAULT_SUBNET = 0

type SubnetSelectorDialogProps = {
  selected?: unknown
  onRequestDismiss: () => void
  onConfirm: (delegate: unknown) => void
}

export const SubnetSelectorDialog = (props: SubnetSelectorDialogProps) => {
  const { data, isLoading, error } = useGetSubnetPools()
  console.log({ isLoading, error, data })
  const subnets = { 0: { name: 'Root Subnet' } }
  // const delegates = useDelegates()
  const allDelegateInfos = useAllDelegateInfos()
  const delegatesStats = useDelegatesStats()

  const [highlighted, setHighlighted] = useState(subnets[DEFAULT_SUBNET] ?? Object.values(subnets)[0])
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  return (
    <StakeTargetSelectorDialog
      title="Select a delegate"
      currentSelectionLabel="Selected delegate"
      selectionLabel="New delegate"
      confirmButtonContent="Swap delegate"
      onRequestDismiss={props.onRequestDismiss}
      // onConfirm={() => {
      //   if (highlighted !== undefined) props.onConfirm(highlighted)
      // }}
      onConfirm={() => console.log('Confirmed sir')}
      sortMethods={{
        'Total staked': (a, b) =>
          (b.props.balancePlanck ?? 0n) === (a.props.balancePlanck ?? 0n)
            ? 0
            : (b.props.balancePlanck ?? 0n) - (a.props.balancePlanck ?? 0n) < 0
            ? -1
            : 1,
        'Number of stakers': (a, b) =>
          parseInt(b.props.count?.toString?.() ?? '0') - parseInt(a.props.count?.toString?.() ?? '0'),
        'Estimated APR': (a, b) =>
          parseFloat(b.props.estimatedApr?.replace('%', '') ?? '0') -
          parseFloat(a.props.estimatedApr?.replace('%', '') ?? '0'),
        // 'Estimated return': (a, b) =>
        //   BigInt(b.props.estimatedReturn ?? 0n) === BigInt(a.props.estimatedReturn ?? 0n)
        //     ? 0
        //     : BigInt(b.props.estimatedReturn ?? 0n) - BigInt(a.props.estimatedReturn ?? 0n) < 0
        //     ? -1
        //     : 1,
      }}
    >
      {Object.values(subnets).map((subnet, index) => {
        const formattedApr = '3.33'
        // const formattedApr = Number(
        //   delegatesStats.find(stat => stat.hotkey.ss58 === delegate.address)?.apr
        // ).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })

        return (
          <StakeTargetSelectorDialog.Item
            // key={subnet.address}
            key={index}
            balanceDescription="Total staked with this delegate"
            countDescription="Number of delegate stakers"
            estimatedAprDescription="Estimated APR"
            estimatedApr={formattedApr}
            talismanRecommendedDescription="Talisman top recommended delegate"
            rating={3}
            // selected={subnet.address === props.selected?.address}
            // highlighted={subnet.address === highlighted?.address}
            name={subnet.name}
            // talismanRecommended={subnet.address === DEFAULT_DELEGATE}
            talismanRecommended={true}
            // detailUrl={subnet.url}
            // count={allDelegateInfos[subnet.address]?.nominators?.length ?? 0}
            count={33}
            balance={'123'}
            // balance={
            //   nativeTokenAmount
            //     .fromPlanckOrUndefined(allDelegateInfos[subnet.address]?.totalDelegated)
            //     .decimalAmount?.toLocaleString() ?? ''
            // }
            // balancePlanck={
            //   nativeTokenAmount.fromPlanckOrUndefined(allDelegateInfos[subnet.address]?.totalDelegated).decimalAmount
            //     ?.planck
            // }
            balancePlanck={BigInt(123)}
            // estimatedReturn={allDelegateInfos[subnet.address]?.return_per_1000}
            onClick={() => setHighlighted(subnet)}
          />
        )
      })}
    </StakeTargetSelectorDialog>
  )
}
