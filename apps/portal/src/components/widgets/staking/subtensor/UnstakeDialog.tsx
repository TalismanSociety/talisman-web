import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Text } from '@talismn/ui/atoms/Text'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import { UnstakeDialog as UnstakeDialogComponent } from '@/components/recipes/UnstakeDialog'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useExtrinsicInBlockOrErrorEffect } from '@/domains/common/hooks/useExtrinsicEffect'
import { useUnstakeForm } from '@/domains/staking/subtensor/hooks/forms'
import { useCombineSubnetData } from '@/domains/staking/subtensor/hooks/useCombineSubnetData'
import { type StakeItem } from '@/domains/staking/subtensor/hooks/useStake'

import { ROOT_NETUID } from './constants'

type DelegateUnstakeDialogProps = {
  account: Account
  stake: StakeItem
  delegate: string
  onRequestDismiss: () => void
}

const DelegateUnstakeDialog = (props: DelegateUnstakeDialogProps) => {
  const {
    input,
    setInput,
    amount,
    available,
    resulting,
    extrinsic,
    ready,
    error,
    alphaToTaoSlippage,
    expectedTaoAmount,
    isLoading,
  } = useUnstakeForm(props.stake, props.delegate)
  const { t } = useTranslation()
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  useExtrinsicInBlockOrErrorEffect(() => props.onRequestDismiss(), extrinsic)
  const { subnetData } = useCombineSubnetData()

  const stakeData = subnetData[props.stake.netuid ?? 0]

  const alphaTokenSymbol = useMemo(() => {
    const { netuid, symbol, descriptionName } = stakeData || props.stake || {}
    return netuid ? `SN${netuid} ${descriptionName} ${symbol}` : 'DTao'
  }, [props.stake, stakeData])

  const resultingAlphaAmount = nativeTokenAmount.fromPlanckOrUndefined(
    resulting?.decimalAmount?.planck ?? 0n,
    alphaTokenSymbol
  )

  const resultingStake = props.stake.netuid === ROOT_NETUID ? resulting : resultingAlphaAmount

  const expectedAmount = (
    <div className="flex items-center justify-between">
      <Text.Body alpha="high">Est TAO to receive</Text.Body>
      <Text.Body>{expectedTaoAmount.decimalAmount?.toLocaleString()}</Text.Body>
    </div>
  )

  return (
    <UnstakeDialogComponent
      confirmState={isLoading ? 'pending' : !ready ? 'disabled' : undefined}
      isError={error !== undefined}
      availableAmount={available?.decimalAmount?.toLocaleString() || `0 ${alphaTokenSymbol}`}
      amount={input}
      onChangeAmount={setInput}
      onRequestMaxAmount={() => setInput(available?.decimalAmount?.toString() || '0')}
      fiatAmount={amount.localizedFiatAmount ?? ''}
      newAmount={resultingStake.decimalAmount?.toLocaleString() ?? <CircularProgressIndicator size="1em" />}
      newFiatAmount={resultingStake.localizedFiatAmount ?? <CircularProgressIndicator size="1em" />}
      onConfirm={() => {
        void extrinsic.signAndSend(props.account.address)
      }}
      inputSupportingText={error?.message}
      onDismiss={props.onRequestDismiss}
      lockDuration={<>{t('None')}</>}
      slippage={alphaToTaoSlippage}
      expectedTokenAmount={expectedAmount}
    />
  )
}

type UnstakeDialogProps = {
  account: Account
  stake: StakeItem
  onRequestDismiss: () => void
}

const UnstakeDialog = (props: UnstakeDialogProps) => {
  return (
    <DelegateUnstakeDialog
      account={props.account}
      stake={props.stake}
      delegate={props.stake.hotkey}
      onRequestDismiss={props.onRequestDismiss}
    />
  )
}

export default UnstakeDialog
