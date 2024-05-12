import { NominationPoolsAddStakeDialog } from '../../../recipes/AddStakeDialog'
import { useExtrinsic, useExtrinsicInBlockOrErrorEffect } from '../../../../domains/common'
import { usePoolAddForm } from '../../../../domains/staking/substrate/nominationPools/hooks'

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

  useExtrinsicInBlockOrErrorEffect(() => {
    props.onDismiss()
  }, bondExtraExtrinsic)

  return (
    <NominationPoolsAddStakeDialog
      isError={inputError !== undefined}
      open={props.account !== undefined}
      availableToStake={availableBalance.decimalAmount?.toLocaleString() ?? '...'}
      amount={amount}
      onChangeAmount={setAmount}
      fiatAmount={localizedFiatAmount ?? ''}
      newAmount={resulting.decimalAmount?.toLocaleString() ?? '...'}
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
        !isReady || inputError !== undefined || decimalAmount === undefined || decimalAmount.planck === 0n
          ? 'disabled'
          : bondExtraExtrinsic.state === 'loading'
          ? 'pending'
          : undefined
      }
    />
  )
}

export default AddStakeDialog
