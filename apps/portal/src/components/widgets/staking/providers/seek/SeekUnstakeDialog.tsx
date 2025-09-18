import { formatDistance } from 'date-fns'

import { UnstakeDialog } from '@/components/recipes/UnstakeDialog'
import { Account } from '@/domains/accounts/recoils'

import useGetSeekStakeUnlockDuration from '../hooks/seek/hooks/useGetSeekStakeUnlockDuration'
import useRequestWithdrawalSeek from '../hooks/seek/hooks/useRequestWithdrawalSeek'

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
    stakedBalance,
  } = useRequestWithdrawalSeek({ account })

  const unlockDuration = useGetSeekStakeUnlockDuration()

  // TODO: fetch DEEK fiat price
  const fiatAmountAvailable = ''

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
      fiatAmount={fiatAmountAvailable}
      newAmount={newStakedTotal?.toLocaleString() ?? '...'}
      newFiatAmount={null}
      onChangeAmount={setAmountInput}
      availableAmount={stakedBalance?.toLocaleString() ?? '...'}
      lockDuration={<div>{formatDistance(0, unlockDuration)}</div>}
      onConfirm={async () => {
        await requestWithdrawal.writeContractAsync()
        onRequestDismiss()
      }}
      onRequestMaxAmount={() => {
        if (stakedBalance !== undefined) {
          setAmountInput(stakedBalance.toString())
        }
      }}
      isError={!!error}
      inputSupportingText={error?.message}
    />
  )
}

export default SeekUnstakeDialog
