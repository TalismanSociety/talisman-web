import BaseAddStakeDialog from '@components/recipes/AddStakeDialog'
import { usePoolAddForm } from '@domains/nominationPools/hooks'
import { useCallback, useEffect } from 'react'

import useExtrinsic from '../../domains/common/hooks/useExtrinsic'

const AddStakeDialog = (props: { account?: string; onDismiss: () => unknown }) => {
  const bondExtraExtrinsic = useExtrinsic('nominationPools', 'bondExtra')

  const {
    isReady,
    input: { amount, decimalAmount, localizedFiatAmount },
    freeBalance,
    resulting,
    setAmount,
    error: inputError,
  } = usePoolAddForm(props.account)

  useEffect(() => {
    if (props.account === undefined) {
      setAmount('')
    }
  }, [props.account, setAmount])

  useEffect(() => {
    if (bondExtraExtrinsic.state === 'loading' && bondExtraExtrinsic.contents?.status.isInBlock) {
      props.onDismiss()
    }
  }, [bondExtraExtrinsic.contents?.status?.isInBlock, bondExtraExtrinsic.state, props])

  return (
    <BaseAddStakeDialog
      isError={inputError !== undefined}
      open={props.account !== undefined}
      availableToStake={freeBalance.decimalAmount?.toHuman() ?? '...'}
      amount={amount}
      onChangeAmount={setAmount}
      fiatAmount={localizedFiatAmount ?? ''}
      newAmount={resulting.decimalAmount?.toHuman() ?? '...'}
      newFiatAmount={resulting.localizedFiatAmount ?? '...'}
      inputSupportingText={inputError?.message}
      onDismiss={props.onDismiss}
      onConfirm={useCallback(
        () =>
          bondExtraExtrinsic
            .signAndSend(props.account ?? '', {
              FreeBalance: decimalAmount?.atomics?.toString() ?? '0',
            })
            .finally(() => props.onDismiss()),
        [bondExtraExtrinsic, decimalAmount?.atomics, props]
      )}
      onRequestMaxAmount={() => {
        if (freeBalance.decimalAmount !== undefined) {
          setAmount(freeBalance.decimalAmount?.toString())
        }
      }}
      confirmState={
        !isReady || inputError !== undefined
          ? 'disabled'
          : bondExtraExtrinsic.state === 'loading'
          ? 'pending'
          : undefined
      }
    />
  )
}

export default AddStakeDialog
