import { SlpxAddStakeDialog } from '@components/recipes/AddStakeDialog'
import { useAccountSelector } from '@components/widgets/AccountSelector'
import { writeableEvmAccountsState, type Account } from '@domains/accounts'
import { useMintForm } from '@domains/staking/slpx/core'
import type { SlpxPair } from '@domains/staking/slpx/types'
import { Maybe } from '@util/monads'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { useSwitchNetwork } from 'wagmi'

type AddStakeDialogProps = {
  account?: Account
  slpxPair: SlpxPair
  onRequestDismiss: () => unknown
}

const AddStakeDialog = (props: AddStakeDialogProps) => {
  const [account, accountSelector] = useAccountSelector(
    useRecoilValue(writeableEvmAccountsState),
    accounts => accounts?.find(account => account.address === props.account?.address) ?? accounts?.at(0)
  )

  const switchNetwork = useSwitchNetwork()

  const {
    input: { amount, localizedFiatAmount },
    setAmount,
    newAmount,
    available,
    mint,
    rate,
    ready,
    error,
  } = useMintForm(account, props.slpxPair)

  useEffect(() => {
    if (mint.status === 'success' || mint.status === 'error') {
      props.onRequestDismiss()
    }
  }, [mint.status, props])

  return (
    <SlpxAddStakeDialog
      confirmState={!ready ? 'disabled' : mint.isLoading ? 'pending' : undefined}
      open
      onDismiss={props.onRequestDismiss}
      accountSelector={props.account === undefined && accountSelector}
      amount={amount}
      fiatAmount={localizedFiatAmount ?? '...'}
      newAmount={newAmount?.toHuman() ?? '...'}
      newFiatAmount={null}
      onChangeAmount={setAmount}
      availableToStake={available?.toHuman() ?? '...'}
      rate={Maybe.of(rate).mapOr(
        '...',
        rate => `1 ${props.slpxPair.nativeToken.symbol} = ${rate.toLocaleString()} ${props.slpxPair.vToken.symbol}`
      )}
      onConfirm={() => {
        switchNetwork.switchNetwork?.(props.slpxPair.chainId)
        mint.write()
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

export default AddStakeDialog
