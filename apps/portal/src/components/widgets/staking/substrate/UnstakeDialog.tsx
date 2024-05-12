import { NominationPoolsUnstakeDialog } from '../../../recipes/UnstakeDialog'
import { useExtrinsicInBlockOrErrorEffect } from '../../../../domains/common'
import { usePoolUnstakeForm } from '../../../../domains/staking/substrate/nominationPools/hooks'
import { useLocalizedUnlockDuration } from '../../../../domains/staking/substrate/nominationPools/hooks/useUnlockDuration'
import { useCallback } from 'react'

const UnstakeDialog = (props: { account?: string; onDismiss: () => unknown }) => {
  const lockDuration = useLocalizedUnlockDuration()

  const {
    extrinsic: unbondExtrinsic,
    isReady,
    input: { amount, decimalAmount, localizedFiatAmount },
    available,
    resulting,
    setAmount,
    isLeaving,
    error: inputError,
  } = usePoolUnstakeForm(props.account)

  useExtrinsicInBlockOrErrorEffect(() => {
    props.onDismiss()
  }, unbondExtrinsic)

  return (
    <NominationPoolsUnstakeDialog
      isError={inputError !== undefined}
      open={props.account !== undefined}
      availableAmount={available.decimalAmount?.toLocaleString() ?? '...'}
      amount={amount}
      isLeaving={isLeaving}
      onChangeAmount={setAmount}
      fiatAmount={localizedFiatAmount ?? ''}
      newAmount={resulting.decimalAmount?.toLocaleString() ?? '...'}
      newFiatAmount={resulting.localizedFiatAmount ?? '...'}
      inputSupportingText={inputError?.message}
      lockDuration={lockDuration}
      onDismiss={props.onDismiss}
      onConfirm={useCallback(() => {
        if (props.account !== undefined && decimalAmount !== undefined) {
          if (isLeaving) {
            unbondExtrinsic.unbondMax(props.account, props.account).finally(() => props.onDismiss())
          } else {
            unbondExtrinsic
              .signAndSend(props.account, props.account, decimalAmount?.planck)
              .finally(() => props.onDismiss())
          }
        }
      }, [props, decimalAmount, isLeaving, unbondExtrinsic])}
      onRequestMaxAmount={() => {
        if (available.decimalAmount !== undefined) {
          setAmount(available.decimalAmount?.toString())
        }
      }}
      confirmState={
        !isReady || inputError !== undefined || decimalAmount === undefined || decimalAmount.planck === 0n
          ? 'disabled'
          : unbondExtrinsic.state === 'loading'
          ? 'pending'
          : undefined
      }
    />
  )
}

export default UnstakeDialog
