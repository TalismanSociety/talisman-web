import BaseAddStakeDialog from '@components/recipes/AddStakeDialog'
import { useExtrinsic } from '@domains/common'
import { usePoolAddForm } from '@domains/nominationPools/hooks'
import { useEffect } from 'react'

const AddStakeDialog = (props: { account?: string; onDismiss: () => unknown }) => {
  const {
    isReady,
    input: { amount, decimalAmount, localizedFiatAmount },
    availableBalance,
    resulting,
    setAmount,
    error: inputError,
  } = usePoolAddForm('bondExtra', props.account)

  const bondExtraExtrinsic = useExtrinsic('nominationPools', 'bondExtra', [
    {
      FreeBalance: decimalAmount?.planck?.toString() ?? '0',
    },
  ])

  useEffect(
    () => {
      if (bondExtraExtrinsic.state === 'loading' && bondExtraExtrinsic.contents?.status.isInBlock) {
        props.onDismiss()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bondExtraExtrinsic.contents?.status?.isInBlock]
  )

  return (
    <BaseAddStakeDialog
      isError={inputError !== undefined}
      open={props.account !== undefined}
      availableToStake={availableBalance.decimalAmount?.toHuman() ?? '...'}
      amount={amount}
      onChangeAmount={setAmount}
      fiatAmount={localizedFiatAmount ?? ''}
      newAmount={resulting.decimalAmount?.toHuman() ?? '...'}
      newFiatAmount={resulting.localizedFiatAmount ?? '...'}
      inputSupportingText={inputError?.message}
      onDismiss={props.onDismiss}
      onConfirm={async () => await bondExtraExtrinsic.signAndSend(props.account ?? '').finally(() => props.onDismiss())}
      onRequestMaxAmount={() => {
        if (availableBalance.decimalAmount !== undefined) {
          setAmount(availableBalance.decimalAmount?.toString())
        }
      }}
      confirmState={
        !isReady || inputError !== undefined || decimalAmount?.planck.isZero()
          ? 'disabled'
          : bondExtraExtrinsic.state === 'loading'
          ? 'pending'
          : undefined
      }
    />
  )
}

export default AddStakeDialog
