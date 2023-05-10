import BaseUnstakeDialog from '@components/recipes/UnstakeDialog'
import { usePoolUnstakeForm } from '@domains/nominationPools/hooks'
import { useLocalizedLockDuration } from '@domains/nominationPools/hooks/useLockDuration'
import { useCallback, useEffect } from 'react'

const UnstakeDialog = (props: { account?: string; onDismiss: () => unknown }) => {
  const lockDuration = useLocalizedLockDuration()

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

  useEffect(
    () => {
      if (unbondExtrinsic.state === 'loading' && unbondExtrinsic.contents?.status.isInBlock) {
        props.onDismiss()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unbondExtrinsic.contents?.status?.isInBlock]
  )

  return (
    <BaseUnstakeDialog
      isError={inputError !== undefined}
      open={props.account !== undefined}
      availableAmount={available.decimalAmount?.toHuman() ?? '...'}
      amount={amount}
      isLeaving={isLeaving}
      onChangeAmount={setAmount}
      fiatAmount={localizedFiatAmount ?? ''}
      newAmount={resulting.decimalAmount?.toHuman() ?? '...'}
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
        !isReady || inputError !== undefined || decimalAmount?.planck.isZero()
          ? 'disabled'
          : unbondExtrinsic.state === 'loading'
          ? 'pending'
          : undefined
      }
    />
  )
}

export default UnstakeDialog
