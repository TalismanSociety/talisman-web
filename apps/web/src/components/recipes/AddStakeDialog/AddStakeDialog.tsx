import { AlertDialog, Button, Text, TextInput } from '@talismn/ui'
import type { ReactNode } from 'react'

export type AddStakeFormProps = {
  accountSelector?: ReactNode
  confirmState?: 'pending' | 'disabled'
  availableToStake: string
  amount: string
  rate?: string
  fiatAmount: string
  newAmount: string
  newFiatAmount: ReactNode
  onRequestMaxAmount: () => unknown
  onChangeAmount: (amount: string) => unknown
  isError?: boolean
  inputSupportingText?: string
  onConfirm: () => unknown
}

export type AddStakeDialogProps = AddStakeFormProps & {
  message: ReactNode
  open: boolean
  onDismiss: () => unknown
}

const AddStakeForm = (props: AddStakeFormProps) => (
  <div>
    {props.accountSelector && <div css={{ marginBottom: '2.6rem' }}>{props.accountSelector}</div>}
    <TextInput
      type="number"
      inputMode="decimal"
      min={0}
      step="any"
      isError={props.isError}
      placeholder="0.00"
      leadingLabel="Available to stake"
      trailingLabel={props.availableToStake}
      leadingSupportingText={props.fiatAmount}
      trailingSupportingText={props.inputSupportingText}
      trailingIcon={<TextInput.LabelButton onClick={props.onRequestMaxAmount}>MAX</TextInput.LabelButton>}
      value={props.amount}
      onChange={event => props.onChangeAmount(event.target.value)}
      css={{ fontSize: '3rem' }}
    />
    <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.6rem' }}>
      <Text.Body alpha="high">New staked total</Text.Body>
      <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Text.Body as="div" alpha="high">
          {props.newAmount}
        </Text.Body>
        <Text.Body as="div">{props.newFiatAmount}</Text.Body>
      </div>
    </div>
    {props.rate && (
      <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.6rem' }}>
        <Text.Body alpha="high">Rate</Text.Body>
        <Text.Body as="div" alpha="high">
          {props.rate}
        </Text.Body>
      </div>
    )}
    <Button
      onClick={props.onConfirm}
      disabled={props.confirmState === 'disabled'}
      loading={props.confirmState === 'pending'}
      css={{ width: '100%', marginTop: '4.6rem' }}
    >
      Stake
    </Button>
  </div>
)

const AddStakeDialog = (props: AddStakeDialogProps) => (
  <AlertDialog
    open={props.open}
    title="Stake"
    width="44rem"
    content={
      <>
        <Text.Body as="p" css={{ marginBottom: '2.6rem' }}>
          {props.message}
        </Text.Body>
        <AddStakeForm {...props} />
      </>
    }
    onRequestDismiss={props.onDismiss}
  />
)

export type NominationPoolsAddStakeDialogProps = Omit<AddStakeDialogProps, 'message' | 'rate' | 'buttonText'>

export const NominationPoolsAddStakeDialog = (props: NominationPoolsAddStakeDialogProps) => (
  <AddStakeDialog
    {...props}
    message="Increase your stake below. Talisman will automatically stake this in the same nomination pool for you."
  />
)

export type SlpxAddStakeFormProps = Omit<AddStakeFormProps, 'buttonText'> & {
  rate: string
  approvalNeed?: boolean
}

export type SlpxAddStakeDialogProps = Omit<AddStakeDialogProps, 'message' | 'buttonText'> & {
  rate: string
  approvalNeed?: boolean
}

export const SlpxAddStakeForm = (props: SlpxAddStakeFormProps) => <AddStakeForm {...props} />

export const SlpxAddStakeDialog = (props: SlpxAddStakeDialogProps) => (
  <AddStakeDialog
    {...props}
    message="Increase your stake below. Talisman will automatically stake this using Bifrost liquid staking for you."
  />
)

export default AddStakeDialog
