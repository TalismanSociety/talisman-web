import BaseUnstakeDialog from '@components/recipes/UnstakeDialog'
import { usePoolUnstakeForm } from '@domains/nominationPools/hooks'
import { useLockDuration } from '@domains/nominationPools/hooks/useLockDuration'
import { formatDistance } from 'date-fns'
import { useCallback, useEffect } from 'react'

import useExtrinsic from '../../domains/common/hooks/useExtrinsic'

const UnstakeDialog = (props: { account?: string; onDismiss: () => unknown }) => {
  const unbondExtrinsic = useExtrinsic('nominationPools', 'unbond')
  const lockDuration = useLockDuration()

  const {
    isReady,
    input: { amount, decimalAmount, localizedFiatAmount },
    available,
    resulting,
    setAmount,
    error: inputError,
  } = usePoolUnstakeForm(props.account)

  useEffect(() => {
    if (unbondExtrinsic.state === 'loading' && unbondExtrinsic.contents?.status.isInBlock) {
      props.onDismiss()
    }
  }, [unbondExtrinsic.contents?.status?.isInBlock, unbondExtrinsic.state, props])

  return (
    <BaseUnstakeDialog
      isError={inputError !== undefined}
      open={props.account !== undefined}
      availableAmount={available.decimalAmount?.toHuman() ?? '...'}
      amount={amount}
      isLeaving={available.decimalAmount !== undefined && decimalAmount?.atomics.eq(available.decimalAmount.atomics)}
      onChangeAmount={setAmount}
      fiatAmount={localizedFiatAmount ?? ''}
      newAmount={resulting.decimalAmount?.toHuman() ?? '...'}
      newFiatAmount={resulting.localizedFiatAmount ?? '...'}
      inputSupportingText={inputError?.message}
      lockDuration={lockDuration === undefined ? '...' : formatDistance(0, lockDuration.toNumber())}
      onDismiss={props.onDismiss}
      onConfirm={useCallback(() => {
        if (props.account !== undefined && decimalAmount !== undefined) {
          unbondExtrinsic
            .signAndSend(props.account, props.account, decimalAmount?.atomics)
            .finally(() => props.onDismiss())
        }
      }, [props, decimalAmount, unbondExtrinsic])}
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
