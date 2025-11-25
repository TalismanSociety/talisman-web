import { formatDistance } from 'date-fns'

import { UnstakeDialog } from '@/components/recipes/UnstakeDialog'
import { Account } from '@/domains/accounts/recoils'

import useGetSeekStakeUnlockDuration from '../hooks/seek/useGetSeekStakeUnlockDuration'
import useRequestWithdrawalSeek from '../hooks/seek/useRequestWithdrawalSeek'

type SeekUnstakeDialogProps = {
  account: Account
  onRequestDismiss: () => void
}

const SeekUnstakeDialog = ({ account, onRequestDismiss }: SeekUnstakeDialogProps) => {
  const {
    newStakedTotal,
    setAmountInput,
    requestWithdrawalTransaction,
    requestWithdrawal,
    error,
    isReady,
    input: { amountInput },
    stakedBalance: { availableBalance, fiatAmountFormatted },
  } = useRequestWithdrawalSeek({
    account,
    onTransactionSuccess: onRequestDismiss,
  })

  const unlockDuration = useGetSeekStakeUnlockDuration()

  return (
    <UnstakeDialog
      confirmState={
        !isReady || Number(amountInput) === 0
          ? 'disabled'
          : requestWithdrawal?.isPending ||
            requestWithdrawal.isPending ||
            requestWithdrawalTransaction.isLoading ||
            requestWithdrawalTransaction.isLoading
          ? 'pending'
          : undefined
      }
      open
      onDismiss={onRequestDismiss}
      amount={amountInput}
      fiatAmount={fiatAmountFormatted}
      newAmount={newStakedTotal?.toLocaleString() ?? '...'}
      newFiatAmount={null}
      onChangeAmount={setAmountInput}
      availableAmount={availableBalance?.toLocaleString() ?? '...'}
      lockDuration={<div>{formatDistance(0, unlockDuration)}</div>}
      onConfirm={async () => {
        try {
          await requestWithdrawal.writeContractAsync()
        } catch (error) {
          console.error('Transaction failed:', error)
        }
      }}
      onRequestMaxAmount={() => {
        if (availableBalance !== undefined) {
          setAmountInput(availableBalance.toString())
        }
      }}
      isError={!!error}
      inputSupportingText={error?.message}
    />
  )
}

export default SeekUnstakeDialog
