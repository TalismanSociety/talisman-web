import { ReactElement, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

import { StakeTargetSelectorDialog } from '@/components/recipes/StakeTargetSelectorDialog'
import { type StakeTargetSelectorItemProps } from '@/components/recipes/StakeTargetSelectorItem'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useCombinedBittensorValidatorsData } from '@/domains/staking/subtensor/hooks/useCombinedBittensorValidatorsData'
import { useGetInfiniteValidatorsYieldByNetuid } from '@/domains/staking/subtensor/hooks/useGetInfiniteValidatorsYield'
import { type BondOption } from '@/domains/staking/subtensor/types'

const TAOSTATS_INFO_URL = 'https://taostats.io/validators'

type DelegateSelectorDialogProps = {
  selected?: BondOption
  onRequestDismiss: () => unknown
  onConfirm: (delegate: BondOption) => unknown
  setHighlightedDelegate?: React.Dispatch<React.SetStateAction<BondOption | undefined>>
}

export const DelegateSelectorDialog = (props: DelegateSelectorDialogProps) => {
  const [searchParams] = useSearchParams()
  const { data: validatorsYieldData } = useGetInfiniteValidatorsYieldByNetuid({ netuid: 0 })

  const { combinedValidatorsData, isError } = useCombinedBittensorValidatorsData()

  console.log({ validatorsYieldData, combinedValidatorsData })

  const hasDTaoStaking = searchParams.get('hasDTaoStaking') === 'true'

  const [highlighted, setHighlighted] = useState<BondOption | undefined>()
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  let sortMethods: {
    [key: string]: (
      a: ReactElement<StakeTargetSelectorItemProps>,
      b: ReactElement<StakeTargetSelectorItemProps>
    ) => number
  } = {
    'Total staked': (a, b) =>
      (b.props.balancePlanck ?? 0n) === (a.props.balancePlanck ?? 0n)
        ? 0
        : (b.props.balancePlanck ?? 0n) - (a.props.balancePlanck ?? 0n) < 0
        ? -1
        : 1,
    'Validator name': (a, b) => a.props.name.localeCompare(b.props.name),
    'Number of stakers': (a, b) =>
      parseInt(b.props.count?.toString?.() ?? '0') - parseInt(a.props.count?.toString?.() ?? '0'),
  }

  if (!hasDTaoStaking) {
    sortMethods = {
      ...sortMethods,
      'Estimated APY': (a, b) =>
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
      isSortDisabled={isError}
    >
      {combinedValidatorsData.map(delegate => {
        let formattedApr = !hasDTaoStaking
          ? Number(delegate.validatorYield?.thirty_day_apy || '0').toLocaleString(undefined, {
              style: 'percent',
              maximumFractionDigits: 2,
            })
          : ''

        const balance = nativeTokenAmount.fromPlanckOrUndefined(delegate.totalStaked)

        let formattedBalance =
          delegate.totalStaked > 0n
            ? balance.decimalAmount?.toLocaleString()
            : `-- ${balance.decimalAmount?.options?.currency}`

        if (isError) {
          formattedBalance = ''
          formattedApr = '--'
        }

        return (
          <StakeTargetSelectorDialog.Item
            key={delegate.poolId}
            balanceDescription="Total staked with this delegate"
            countDescription="Number of delegate stakers"
            estimatedAprDescription="Estimated APY (30d)"
            estimatedApr={!hasDTaoStaking ? formattedApr : undefined}
            talismanRecommendedDescription="Talisman top recommended delegate"
            selected={delegate.poolId === props.selected?.poolId}
            highlighted={delegate.poolId === highlighted?.poolId}
            name={delegate.name}
            talismanRecommended={false}
            detailUrl={`${TAOSTATS_INFO_URL}/${delegate.poolId}`}
            count={!isError ? delegate.totalStakers : 0}
            balance={formattedBalance ?? ''}
            balancePlanck={balance.decimalAmount?.planck}
            onClick={() => {
              setHighlighted(delegate)
              props.setHighlightedDelegate?.(delegate)
            }}
            className="min-h-[9.6rem]"
          />
        )
      })}
    </StakeTargetSelectorDialog>
  )
}
