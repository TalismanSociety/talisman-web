import { type Account } from '../../../../domains/accounts'
// import { useRedeemForm, type  } from '../../../../domains/staking/slpx'
import { Maybe } from '../../../../util/monads'
import { SlpxUnstakeDialog } from '../../../recipes/UnstakeDialog'
import UnlockDuration from './UnlockDuration'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import useStakeRemoveForm from '@/domains/staking/slpxSubstrate/useStakeRemoveForm'
import { Suspense } from 'react'

type UnstakeDialogProps = {
  account?: Account
  slpxSubstratePair: SlpxSubstratePair
  onRequestDismiss: () => unknown
}

const UnstakeDialog = ({ account, slpxSubstratePair, onRequestDismiss }: UnstakeDialogProps) => {
  const { amount, setAmount, localizedFiatAmount, newAmount, rate } = useStakeRemoveForm({
    slpxPair: slpxSubstratePair,
  })

  // const {
  //   input: { amount, localizedFiatAmount },
  //   setAmount,
  //   newOriginTokenAmount: newAmount,
  //   available,
  //   approve,
  //   approveTransaction,
  //   approvalNeeded,
  //   redeem,
  //   rate,
  //   ready,
  //   error,
  // } = useRedeemForm(props.account, props.slpxPair)

  // useEffect(() => {
  //   if (redeem.status === 'success' || redeem.status === 'error') {
  //     props.onRequestDismiss()
  //   }
  // }, [props, redeem.status])

  return (
    <SlpxUnstakeDialog
      // confirmState={
      //   !ready
      //     ? 'disabled'
      //     : redeem.isPending || approve.isPending || approveTransaction.isLoading
      //     ? 'pending'
      //     : undefined
      // }
      open
      onDismiss={onRequestDismiss}
      amount={amount}
      fiatAmount={localizedFiatAmount ?? '...'}
      newAmount={newAmount?.toLocaleString() ?? '...'}
      newFiatAmount={null}
      onChangeAmount={setAmount}
      // availableAmount={available?.toLocaleString() ?? '...'}
      availableAmount="123456789"
      lockDuration={
        <Suspense fallback="...">
          <UnlockDuration slpxPair={slpxSubstratePair} />
        </Suspense>
      }
      rate={Maybe.of(rate).mapOr(
        '...',
        rate =>
          `1 ${slpxSubstratePair.vToken.symbol} = ${rate.toLocaleString()} ${slpxSubstratePair.nativeToken.symbol}`
      )}
      // approvalNeeded={approvalNeeded}
      // onConfirm={async () => {
      //   if (approvalNeeded) {
      //     await approve.writeContractAsync()
      //   } else {
      //     await redeem.writeContractAsync()
      //   }
      // }}
      onConfirm={() => console.log('Confirmed')}
      onRequestMaxAmount={() => console.log('Request maximum amount')}
      // onRequestMaxAmount={() => {
      //   if (available !== undefined) {
      //     setAmount(available.toString())
      //   }
      // }}
      // isError={error !== undefined}
      // inputSupportingText={error?.message}
    />
  )
}

export default UnstakeDialog
