import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

import { StakeTargetSelectorDialog } from '@/components/recipes/StakeTargetSelectorDialog'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useCombinedBittensorValidatorsData } from '@/domains/staking/subtensor/hooks/useCombinedBittensorValidatorsData'
import { type BondOption } from '@/domains/staking/subtensor/types'

const TAOSTATS_INFO_URL = 'https://taostats.io/validators'

type DelegateSelectorDialogProps = {
  selected?: BondOption
  onRequestDismiss: () => unknown
  onConfirm: (delegate: BondOption) => unknown
}

export const DelegateSelectorDialog = (props: DelegateSelectorDialogProps) => {
  const [searchParams] = useSearchParams()

  const { combinedValidatorsData } = useCombinedBittensorValidatorsData()

  const hasDTaoStaking = searchParams.get('hasDTaoStaking') === 'true'

  const [highlighted, setHighlighted] = useState<BondOption | undefined>()
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  return (
    <StakeTargetSelectorDialog
      title="Select a delegate"
      currentSelectionLabel={props.selected ? 'Selected delegate' : ''}
      selectionLabel="New delegate"
      confirmButtonContent={props.selected ? 'Swap delegate' : 'Select delegate'}
      onRequestDismiss={props.onRequestDismiss}
      onConfirm={() => {
        if (highlighted !== undefined) props.onConfirm(highlighted)
      }}
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
      {/* {Object.values(delegates).map(delegate => { */}
      {combinedValidatorsData.map(delegate => {
        const formattedApr = delegate.apr.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })

        const balance = nativeTokenAmount.fromPlanckOrUndefined(delegate.totalStaked)

        const formattedBalance =
          delegate.totalStaked > 0n
            ? balance.decimalAmount?.toLocaleString()
            : `-- ${balance.decimalAmount?.options?.currency}`

        return (
          <StakeTargetSelectorDialog.Item
            key={delegate.poolId}
            balanceDescription="Total staked with this delegate"
            countDescription="Number of delegate stakers"
            estimatedAprDescription="Estimated APR"
            estimatedApr={!hasDTaoStaking ? formattedApr : undefined}
            talismanRecommendedDescription="Talisman top recommended delegate"
            rating={3}
            selected={delegate.poolId === props.selected?.poolId}
            highlighted={delegate.poolId === highlighted?.poolId}
            name={delegate.name}
            talismanRecommended={false}
            detailUrl={`${TAOSTATS_INFO_URL}/${delegate.poolId}`}
            count={delegate.totalStakers ?? 0}
            balance={formattedBalance ?? ''}
            balancePlanck={!hasDTaoStaking ? balance.decimalAmount?.planck : 0n}
            // estimatedReturn={allDelegateInfos[delegate.address]?.return_per_1000}
            onClick={() => setHighlighted(delegate)}
          />
        )
      })}
    </StakeTargetSelectorDialog>
  )
}
