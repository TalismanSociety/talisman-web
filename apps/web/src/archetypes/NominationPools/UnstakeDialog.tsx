import BaseUnstakeDialog from '@components/recipes/UnstakeDialog'
import { usePoolUnstakeForm } from '@domains/nominationPools/hooks'
import { useLockDuration } from '@domains/nominationPools/hooks/useLockDuration'
import { formatDistance } from 'date-fns'
import { useCallback, useEffect } from 'react'

const UnstakeDialog = (props: { account?: string; onDismiss: () => unknown }) => {
  const lockDuration = useLockDuration()

  const {
    extrinsic: unbondExtrinsic,
    isReady,
    input: { amount, decimalAmount, localizedFiatAmount },
    available,
    resulting,
    setAmount,
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

  const isLeaving = available.decimalAmount !== undefined && decimalAmount?.atomics.eq(available.decimalAmount.atomics)

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
      lockDuration={lockDuration === undefined ? '...' : formatDistance(0, lockDuration.toNumber())}
      onDismiss={props.onDismiss}
      onConfirm={useCallback(() => {
        if (props.account !== undefined && decimalAmount !== undefined) {
          if (isLeaving) {
            unbondExtrinsic.unbondMax(props.account, props.account).finally(() => props.onDismiss())
          } else {
            unbondExtrinsic
              .signAndSend(props.account, props.account, decimalAmount?.atomics)
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
        !isReady || inputError !== undefined || decimalAmount?.atomics.isZero()
          ? 'disabled'
          : unbondExtrinsic.state === 'loading'
          ? 'pending'
          : undefined
      }
    />
  )
}

export default UnstakeDialog
