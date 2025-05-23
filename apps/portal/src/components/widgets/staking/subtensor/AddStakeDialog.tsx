import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import { AddStakeDialog as _AddStakeDialog } from '@/components/recipes/AddStakeDialog'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useExtrinsicInBlockOrErrorEffect } from '@/domains/common/hooks/useExtrinsicEffect'
import { useAddStakeForm } from '@/domains/staking/subtensor/hooks/forms'
import { useCombinedBittensorValidatorsData } from '@/domains/staking/subtensor/hooks/useCombinedBittensorValidatorsData'
import { useCombineSubnetData } from '@/domains/staking/subtensor/hooks/useCombineSubnetData'
import { type StakeItem } from '@/domains/staking/subtensor/hooks/useStake'

import { ROOT_NETUID } from './constants'

type SubtensorAddStakeDialogProps = {
  account: Account
  stake: StakeItem
  delegate: string
  onRequestDismiss: () => void
}

const SubtensorAddStakeDialog = ({ account, stake, delegate, onRequestDismiss }: SubtensorAddStakeDialogProps) => {
  const {
    input,
    setInput,
    amount,
    transferable,
    resulting,
    extrinsic,
    ready,
    error,
    slippage,
    resultingTao,
    resultingAlphaInTaoAmount,
  } = useAddStakeForm(account, stake, delegate, stake.netuid)

  const { subnetData } = useCombineSubnetData()
  const { combinedValidatorsData } = useCombinedBittensorValidatorsData()
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())
  const queryClient = useQueryClient()

  const handleStakeInfoRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['stakeInfoForColdKey', account.address] })
  }

  const stakeData = subnetData[stake.netuid ?? 0]

  const alphaTokenSymbol = useMemo(() => {
    const { netuid, symbol, descriptionName } = stakeData || stake || {}
    return netuid ? `SN${netuid} ${descriptionName} ${symbol}` : 'DTao'
  }, [stake, stakeData])

  const resultingAlphaAmount = nativeTokenAmount.fromPlanckOrUndefined(
    resulting?.decimalAmount?.planck ?? 0n,
    alphaTokenSymbol
  )

  const resultingStake = stake.netuid === ROOT_NETUID ? resultingTao : resultingAlphaAmount

  const newFiatAmount = stake.netuid === ROOT_NETUID ? resultingTao : resultingAlphaInTaoAmount

  useExtrinsicInBlockOrErrorEffect(() => onRequestDismiss(), extrinsic)

  const selectedDelegate = combinedValidatorsData.find(validator => validator.poolId === delegate)
  const { name } = selectedDelegate || { name: '' }

  return (
    <_AddStakeDialog
      message={
        name
          ? `Increase your stake below. Talisman will automatically stake this towards the ${name} delegate.`
          : `Increase your stake below. Talisman will automatically stake this towards your chosen delegate.`
      }
      confirmState={extrinsic.state === 'loading' ? 'pending' : !ready ? 'disabled' : undefined}
      isError={error !== undefined}
      availableToStake={transferable.decimalAmount.toLocaleString()}
      amount={input}
      onChangeAmount={setInput}
      onRequestMaxAmount={() => setInput(transferable.decimalAmount.toString())}
      fiatAmount={amount.localizedFiatAmount ?? ''}
      newAmount={resultingStake.decimalAmount?.toLocaleString() ?? <CircularProgressIndicator size="1em" />}
      newFiatAmount={newFiatAmount.localizedFiatAmount ?? <CircularProgressIndicator size="1em" />}
      onConfirm={() => {
        extrinsic.signAndSend(account.address).then(() => {
          handleStakeInfoRefetch()
          onRequestDismiss()
        })
      }}
      inputSupportingText={error?.message}
      onDismiss={onRequestDismiss}
      slippage={stake.netuid === ROOT_NETUID ? undefined : slippage}
    />
  )
}

type AddStakeDialogProps = {
  account: Account
  stake: StakeItem
  onRequestDismiss: () => void
}

const AddStakeDialog = (props: AddStakeDialogProps) => {
  return (
    <SubtensorAddStakeDialog
      account={props.account}
      stake={props.stake}
      delegate={props.stake.hotkey}
      onRequestDismiss={props.onRequestDismiss}
    />
  )
}

export default AddStakeDialog
