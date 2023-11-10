import { SlpxUnstakeDialog } from '@components/recipes/UnstakeDialog'
import { type Account } from '@domains/accounts'
import { useRedeemForm } from '@domains/staking/slpx/core'
import type { SlpxPair } from '@domains/staking/slpx/types'
import { Maybe } from '@util/monads'
import { useEffect } from 'react'
import { useSwitchNetwork } from 'wagmi'

type UnstakeDialogProps = {
  account?: Account
  slpxPair: SlpxPair
  onRequestDismiss: () => unknown
}

const UnstakeDialog = (props: UnstakeDialogProps) => {
  const switchNetwork = useSwitchNetwork()

  const {
    input: { amount, localizedFiatAmount },
    setAmount,
    newOriginTokenAmount: newAmount,
    available,
    approve,
    approveTransaction,
    approvalNeeded,
    redeem,
    rate,
    ready,
    error,
  } = useRedeemForm(props.account, props.slpxPair)

  useEffect(() => {
    if (redeem.status === 'success' || redeem.status === 'error') {
      props.onRequestDismiss()
    }
  }, [props, redeem.status])

  return (
    <SlpxUnstakeDialog
      confirmState={
        !ready
          ? 'disabled'
          : redeem.isLoading || approve.isLoading || approveTransaction.isLoading
          ? 'pending'
          : undefined
      }
      open
      onDismiss={props.onRequestDismiss}
      amount={amount}
      fiatAmount={localizedFiatAmount ?? '...'}
      newAmount={newAmount?.toHuman() ?? '...'}
      newFiatAmount={null}
      onChangeAmount={setAmount}
      availableAmount={available?.toHuman() ?? '...'}
      rate={Maybe.of(rate).mapOr(
        '...',
        rate => `1 ${props.slpxPair.vToken.symbol} = ${rate.toLocaleString()} ${props.slpxPair.nativeToken.symbol}`
      )}
      approvalNeeded={approvalNeeded}
      onConfirm={() => {
        switchNetwork.switchNetwork?.(props.slpxPair.chainId)
        if (approvalNeeded) {
          approve.write()
        } else {
          redeem.write()
        }
      }}
      onRequestMaxAmount={() => {
        if (available !== undefined) {
          setAmount(available.toString())
        }
      }}
      isError={error !== undefined}
      inputSupportingText={error?.message}
    />
  )
}

export default UnstakeDialog
