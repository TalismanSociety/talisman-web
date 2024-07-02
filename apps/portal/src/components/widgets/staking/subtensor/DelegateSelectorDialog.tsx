import { useNativeTokenAmountState } from '../../../../domains/chains'
import { DEFAULT_DELEGATE, type Delegate } from '../../../../domains/staking/subtensor/atoms/delegates'
import { useAllDelegateInfos } from '../../../../domains/staking/subtensor/hooks/useAllDelegateInfos'
import { useDelegates } from '../../../../domains/staking/subtensor/hooks/useDelegates'
import StakeTargetSelectorDialog from '../../../recipes/StakeTargetSelectorDialog'
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
    >
      {Object.values(delegates).map(delegate => (
        <StakeTargetSelectorDialog.Item
          key={delegate.address}
          balanceDescription="Total staked with this delegate"
          countDescription="Number of delegate stakers"
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
          onClick={() => setHighlighted(delegate)}
        />
      ))}
    </StakeTargetSelectorDialog>
  )
}
