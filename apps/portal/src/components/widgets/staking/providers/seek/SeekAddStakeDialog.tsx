import { AddStakeDialog } from '@/components/recipes/AddStakeDialog'
import { Account } from '@/domains/accounts/recoils'
import { DEEK_TICKER } from '@/domains/staking/seek/constants'

import useStakeSeek from '../hooks/seek/hooks/useStakeSeek'

type SeekAddStakeDialogProps = {
  account: Account
  onRequestDismiss: () => void
}

const SeekAddStakeDialog = ({ account, onRequestDismiss }: SeekAddStakeDialogProps) => {
  const {
    available,
    newStakedTotal,
    setAmountInput,
    approvalNeeded,
    approve,
    approveTransaction,
    stake,
    stakeTransaction,
    error,
    isReady,
    input: { amountInput },
  } = useStakeSeek({ account })

  // TODO: fetch DEEK fiat price
  const fiatAmountAvailable = ''

  return (
    <AddStakeDialog
      message="Increase your stake below. Talisman will automatically stake this in the same pool."
      confirmState={
        !isReady || Number(amountInput) === 0
          ? 'disabled'
          : stake?.isPending ||
            stake.isPending ||
            stakeTransaction.isLoading ||
            approve.isPending ||
            approveTransaction.isLoading
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
      availableToStake={available.toLocaleString()}
      onConfirm={async () => {
        if (approvalNeeded) {
          try {
            await approve.writeContractAsync()
          } catch (error) {
            console.error(`An error occurred while approving allowance for asset: ${DEEK_TICKER}`, error)
          }
        } else {
          try {
            await stake.writeContractAsync()
            onRequestDismiss()
          } catch (error) {
            console.error(`An error occurred while staking asset: ${DEEK_TICKER}`, error)
          }
        }
      }}
      onRequestMaxAmount={() => {
        if (available !== undefined) {
          setAmountInput(available.toString())
        }
      }}
      isError={!!error}
      inputSupportingText={error?.message}
      approvalNeeded={approvalNeeded}
    />
  )
}

export default SeekAddStakeDialog
