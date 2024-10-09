import { type Account } from '../../../../domains/accounts'
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
  const { amount, setAmount, newAmount, rate, availableBalance, extrinsic, error } = useStakeRemoveForm({
    slpxPair: slpxSubstratePair,
  })

  const { amount: amountAvailable, fiatAmount: fiatAmountAvailable } = availableBalance

  return (
    <SlpxUnstakeDialog
      confirmState={!amount || !!error ? 'disabled' : extrinsic.state === 'loading' ? 'pending' : undefined}
      open
      onDismiss={onRequestDismiss}
      amount={amount}
      fiatAmount={fiatAmountAvailable}
      newAmount={newAmount?.toLocaleString() ?? '...'}
      newFiatAmount={null}
      onChangeAmount={setAmount}
      availableAmount={amountAvailable?.toLocaleString() ?? '...'}
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
      onConfirm={() => extrinsic.signAndSend(account?.address ?? '').then(() => onRequestDismiss())}
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

export default UnstakeDialog
