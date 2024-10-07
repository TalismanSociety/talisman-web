import { useNativeTokenAmountState } from '../../../../domains/chains'
import { DEFAULT_DELEGATE, type Delegate } from '../../../../domains/staking/subtensor/atoms/delegates'
import { useAllDelegateInfos } from '../../../../domains/staking/subtensor/hooks/useAllDelegateInfos'
import { useDelegates } from '../../../../domains/staking/subtensor/hooks/useDelegates'
import StakeTargetSelectorDialog from '../../../recipes/StakeTargetSelectorDialog'
import { useDelegatesStats } from '@/domains/staking/subtensor/hooks/useDelegatesStats'
import { useState } from 'react'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

type DelegateSelectorDialogProps = {
  selected?: Delegate
  onRequestDismiss: () => unknown
  onConfirm: (delegate: Delegate) => unknown
}

export const DelegateSelectorDialog = (props: DelegateSelectorDialogProps) => {
  const delegates = useDelegates()
  const allDelegateInfos = useAllDelegateInfos()
  const delegatesStats = useDelegatesStats()

  const [highlighted, setHighlighted] = useState(delegates[DEFAULT_DELEGATE] ?? Object.values(delegates)[0])
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  return (
    <StakeTargetSelectorDialog
      title="Select a delegate"
      currentSelectionLabel="Selected delegate"
      selectionLabel="New delegate"
      confirmButtonContent="Swap delegate"
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
      {Object.values(delegates).map(delegate => {
        const formattedApr = Number(
          delegatesStats.find(stat => stat.hot_key.ss58 === delegate.address)?.apr
        ).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })

        return (
          <StakeTargetSelectorDialog.Item
            key={delegate.address}
            balanceDescription="Total staked with this delegate"
            countDescription="Number of delegate stakers"
            estimatedAprDescription="Estimated APR"
            estimatedApr={formattedApr}
            talismanRecommendedDescription="Talisman top recommended delegate"
            rating={3}
            selected={delegate.address === props.selected?.address}
            highlighted={delegate.address === highlighted?.address}
            name={delegate.name}
            talismanRecommended={delegate.address === DEFAULT_DELEGATE}
            detailUrl={delegate.url}
            count={allDelegateInfos[delegate.address]?.nominators?.length ?? 0}
            balance={
              nativeTokenAmount
                .fromPlanckOrUndefined(allDelegateInfos[delegate.address]?.totalDelegated)
                .decimalAmount?.toLocaleString() ?? ''
            }
            balancePlanck={
              nativeTokenAmount.fromPlanckOrUndefined(allDelegateInfos[delegate.address]?.totalDelegated).decimalAmount
                ?.planck
            }
            // estimatedReturn={allDelegateInfos[delegate.address]?.return_per_1000}
            onClick={() => setHighlighted(delegate)}
          />
        )
      })}
    </StakeTargetSelectorDialog>
  )
}
