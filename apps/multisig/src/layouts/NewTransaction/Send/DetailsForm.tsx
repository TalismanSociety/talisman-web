import { css } from '@emotion/css'
import AddressInput from '@components/AddressInput'
import { AmountFlexibleInput } from '@components/AmountFlexibleInput'
import { BaseToken } from '@domains/chains'
import { useSelectedMultisig } from '@domains/multisig'
import { useKnownAddresses } from '@hooks/useKnownAddresses'
import { Address } from '@util/addresses'
import { Button } from '@talismn/ui'
import { NewTransactionHeader } from '../NewTransactionHeader'

export const DetailsForm = (props: {
  destinationAddress?: Address
  amount: string
  selectedToken: BaseToken | undefined
  setSelectedToken: (t: BaseToken) => void
  tokens: BaseToken[]
  setDestinationAddress: (address?: Address) => void
  setAmount: (a: string) => void
  onBack: () => void
  onNext: () => void
}) => {
  const [multisig] = useSelectedMultisig()
  const { addresses } = useKnownAddresses(multisig.id)
  return (
    <>
      <NewTransactionHeader>Transaction details</NewTransactionHeader>
      <div css={({ color }) => ({ color: color.offWhite, marginTop: 32, width: '100%' })}>
        <AmountFlexibleInput
          tokens={props.tokens}
          selectedToken={props.selectedToken}
          setSelectedToken={props.setSelectedToken}
          amount={props.amount}
          setAmount={props.setAmount}
        />
      </div>
      <div css={({ color }) => ({ color: color.offWhite, marginTop: 24 })}>
        <AddressInput onChange={props.setDestinationAddress} addresses={addresses} leadingLabel="Recipient" />
      </div>
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 32px;
          width: 100%;
          button {
            height: 56px;
          }
        `}
      >
        <Button onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
        <Button
          disabled={
            !props.destinationAddress ||
            isNaN(parseFloat(props.amount)) ||
            props.amount.endsWith('.') ||
            !props.selectedToken
          }
          onClick={props.onNext}
          children={<h3>Next</h3>}
        />
      </div>
    </>
  )
}
