import { formatDistance } from 'date-fns'
import { Suspense } from 'react'

import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import useStakeRedeemForm from '@/domains/staking/slpxSubstrate/useStakeRedeemForm'

import { type Account } from '../../../../domains/accounts'
import { Maybe } from '../../../../util/monads'
import { SlpxUnstakeDialog } from '../../../recipes/UnstakeDialog'
import useSlpxSubstrateUnlockDuration from '../providers/hooks/bifrost/useSlpxSubstrateUnlockDuration'

type UnstakeDialogProps = {
  account?: Account
  slpxSubstratePair: SlpxSubstratePair
  onRequestDismiss: () => unknown
}

const UnstakeDialog = ({ account, slpxSubstratePair, onRequestDismiss }: UnstakeDialogProps) => {
  const { amount, setAmount, newAmount, rate, availableBalance, extrinsic, error } = useStakeRedeemForm({
    slpxPair: slpxSubstratePair,
  })

  const { amount: amountAvailable, fiatAmount: fiatAmountAvailable } = availableBalance

  return (
    <SlpxUnstakeDialog
      confirmState={
        !amount || !!error ? 'disabled' : extrinsic?.state === 'loading' || !extrinsic ? 'pending' : undefined
      }
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
          {formatDistance(0, useSlpxSubstrateUnlockDuration({ slpxPair: slpxSubstratePair }) || 0).toLocaleString()}
        </Suspense>
      }
      rate={Maybe.of(rate).mapOr(
        '...',
        rate =>
          `1 ${slpxSubstratePair.vToken.symbol} = ${rate.toLocaleString()} ${slpxSubstratePair.nativeToken.symbol}`
      )}
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

export default UnstakeDialog
