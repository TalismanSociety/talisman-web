import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Text } from '@talismn/ui/atoms/Text'
import { useQueryClient } from '@tanstack/react-query'
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
    available,
    resulting,
    extrinsic,
    ready,
    error,
    alphaToTaoSlippage,
    expectedTaoAmount,
    isLoading,
    resultingAlphaInTaoAmount,
  } = useUnstakeForm(props.account, props.stake, props.delegate)
  const { t } = useTranslation()
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  useExtrinsicInBlockOrErrorEffect(() => props.onRequestDismiss(), extrinsic)
  const { subnetData } = useCombineSubnetData()

  const queryClient = useQueryClient()

  const handleStakeInfoRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['stakeInfoForColdKey', props.account.address] })
  }

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

  const fiatAmount = props.stake.netuid === ROOT_NETUID ? resultingStake : expectedTaoAmount
  const newFiatAmount = props.stake.netuid === ROOT_NETUID ? resultingStake : resultingAlphaInTaoAmount

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
      fiatAmount={fiatAmount.localizedFiatAmount ?? ''}
      newAmount={resultingStake.decimalAmount?.toLocaleString() ?? <CircularProgressIndicator size="1em" />}
      newFiatAmount={newFiatAmount.localizedFiatAmount ?? <CircularProgressIndicator size="1em" />}
      onConfirm={() => {
        void extrinsic.signAndSend(props.account.address).then(() => handleStakeInfoRefetch())
      }}
      inputSupportingText={error?.message}
      onDismiss={props.onRequestDismiss}
      lockDuration={<>{t('None')}</>}
      slippage={props.stake.netuid === ROOT_NETUID ? undefined : alphaToTaoSlippage}
      expectedTokenAmount={stakeData?.netuid !== ROOT_NETUID && expectedAmount}
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
