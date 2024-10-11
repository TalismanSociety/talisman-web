import { Account } from '../../../../domains/accounts'
import { SlpxAddStakeDialog } from '../../../recipes/AddStakeDialog'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import useStakeAddForm from '@/domains/staking/slpxSubstrate/useStakeAddForm'

type AddStakeDialogProps = {
  account: Account
  slpxSubstratePair: SlpxSubstratePair
  onRequestDismiss: () => unknown
}

const AddStakeDialog = ({ account, slpxSubstratePair, onRequestDismiss }: AddStakeDialogProps) => {
  const { amount, setAmount, availableBalance, rate, newStakedTotal, extrinsic, error } = useStakeAddForm({
    slpxPair: slpxSubstratePair,
  })

  const { amount: amountAvailable, fiatAmount: fiatAmountAvailable } = availableBalance

  return (
    <SlpxAddStakeDialog
      confirmState={!amount ? 'disabled' : extrinsic?.state === 'loading' || !extrinsic ? 'pending' : undefined}
      open
      onDismiss={onRequestDismiss}
      amount={amount}
      fiatAmount={fiatAmountAvailable ?? '...'}
      newAmount={newStakedTotal?.toLocaleString() ?? '...'}
      newFiatAmount={null}
      onChangeAmount={setAmount}
      availableToStake={amountAvailable.toLocaleString()}
      rate={`1 ${slpxSubstratePair.nativeToken.symbol} = ${rate.toLocaleString()} ${slpxSubstratePair.vToken.symbol}`}
      onConfirm={() => extrinsic?.signAndSend(account?.address ?? '').then(() => onRequestDismiss())}
      onRequestMaxAmount={() => {
        if (amountAvailable !== undefined) {
          setAmount(amountAvailable.toString())
        }
      }}
      isError={!!error}
      inputSupportingText={error?.message}
    />
  )
}

export default AddStakeDialog
