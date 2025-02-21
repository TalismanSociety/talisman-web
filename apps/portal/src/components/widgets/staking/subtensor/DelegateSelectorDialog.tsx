import { ReactElement, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

import { StakeTargetSelectorDialog } from '@/components/recipes/StakeTargetSelectorDialog'
import { type StakeTargetSelectorItemProps } from '@/components/recipes/StakeTargetSelectorItem'
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

  let sortMethods: {
    [key: string]: (
      a: ReactElement<StakeTargetSelectorItemProps>,
      b: ReactElement<StakeTargetSelectorItemProps>
    ) => number
  } = {
    'Validator name': (a, b) => a.props.name.localeCompare(b.props.name),
    'Total staked': (a, b) =>
      (b.props.balancePlanck ?? 0n) === (a.props.balancePlanck ?? 0n)
        ? 0
        : (b.props.balancePlanck ?? 0n) - (a.props.balancePlanck ?? 0n) < 0
        ? -1
        : 1,
    'Number of stakers': (a, b) =>
      parseInt(b.props.count?.toString?.() ?? '0') - parseInt(a.props.count?.toString?.() ?? '0'),
  }

  if (!hasDTaoStaking) {
    sortMethods = {
      ...sortMethods,
      'Estimated APR': (a, b) =>
        parseFloat(b.props.estimatedApr?.replace('%', '') ?? '0') -
        parseFloat(a.props.estimatedApr?.replace('%', '') ?? '0'),
    }
  }

  return (
    <StakeTargetSelectorDialog
      title="Select a validator"
      currentSelectionLabel={props.selected ? 'Selected validator' : ''}
      selectionLabel="New delegate"
      confirmButtonContent={props.selected ? 'Swap validator' : 'Select validator'}
      onRequestDismiss={props.onRequestDismiss}
      onConfirm={() => {
        if (highlighted !== undefined) props.onConfirm(highlighted)
      }}
      sortMethods={sortMethods}
    >
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
            count={delegate.totalStakers || '--'}
            balance={formattedBalance ?? ''}
            balancePlanck={balance.decimalAmount?.planck}
            onClick={() => setHighlighted(delegate)}
          />
        )
      })}
    </StakeTargetSelectorDialog>
  )
}
