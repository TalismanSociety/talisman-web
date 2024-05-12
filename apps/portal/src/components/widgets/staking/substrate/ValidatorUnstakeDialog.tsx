import { useExtrinsicInBlockOrErrorEffect } from '../../../../domains/common'
import { useLocalizedUnlockDuration } from '../../../../domains/staking/substrate/nominationPools/hooks/useUnlockDuration'
import { useValidatorUnstakeForm } from '../../../../domains/staking/substrate/validator/hooks'
import BaseUnstakeDialog from '../../../recipes/UnstakeDialog'
import { useCallback } from 'react'

const ValidatorUnstakeDialog = (props: { accountAddress: string; open: boolean; onRequestDismiss: () => unknown }) => {
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
  } = useValidatorUnstakeForm(props.open ? props.accountAddress : undefined)

  useExtrinsicInBlockOrErrorEffect(() => {
    props.onRequestDismiss()
  }, unbondExtrinsic)

  return (
    <BaseUnstakeDialog
      isError={inputError !== undefined}
      open={props.open}
      availableAmount={available.decimalAmount?.toLocaleString() ?? '...'}
      amount={amount}
      onChangeAmount={setAmount}
      fiatAmount={localizedFiatAmount ?? ''}
      newAmount={resulting.decimalAmount?.toLocaleString() ?? '...'}
      newFiatAmount={resulting.localizedFiatAmount ?? '...'}
      inputSupportingText={inputError?.message}
      lockDuration={lockDuration}
      onDismiss={props.onRequestDismiss}
      onConfirm={useCallback(() => {
        if (decimalAmount !== undefined) {
          if (isLeaving) {
            unbondExtrinsic.unbondAll(props.accountAddress).finally(() => props.onRequestDismiss())
          } else {
            unbondExtrinsic
              .signAndSend(props.accountAddress, decimalAmount?.planck)
              .finally(() => props.onRequestDismiss())
          }
        }
      }, [props, decimalAmount, isLeaving, unbondExtrinsic])}
      onRequestMaxAmount={() => {
        if (available.decimalAmount !== undefined) {
          setAmount(available.decimalAmount?.toString())
        }
      }}
      confirmState={
        !isReady || inputError !== undefined || decimalAmount === undefined || decimalAmount?.planck === 0n
          ? 'disabled'
          : unbondExtrinsic.state === 'loading'
          ? 'pending'
          : undefined
      }
    />
  )
}

export default ValidatorUnstakeDialog
