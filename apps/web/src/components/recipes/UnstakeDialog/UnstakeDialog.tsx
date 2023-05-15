import { AlertDialog, Button, Text, TextInput } from '@talismn/ui'

export type UnstakeDialogProps = {
  open: boolean
  onDismiss: () => unknown
  onConfirm: () => unknown
  confirmState?: 'pending' | 'disabled'
  availableAmount: string
  amount: string
  isLeaving?: boolean
  fiatAmount: string
  newAmount: string
  newFiatAmount: string
  onRequestMaxAmount: () => unknown
  onChangeAmount: (amount: string) => unknown
  lockDuration: string
  isError?: boolean
  inputSupportingText?: string
}

const UnstakeDialog = (props: UnstakeDialogProps) => (
  <AlertDialog
    open={props.open}
    title="Unstake"
    width="44rem"
    content={
      <>
        <Text.Body as="p" css={{ marginBottom: '2.6rem' }}>
          How much would you like to unstake?
        </Text.Body>
        <TextInput
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          isError={props.isError}
          placeholder="0.00"
          leadingLabel="Available to unstake"
          trailingLabel={props.availableAmount}
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
        <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.6rem' }}>
          <Text.Body alpha="high">Unbonding period</Text.Body>
          <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Text.Body as="div" alpha="high">
              {props.lockDuration}
            </Text.Body>
          </div>
        </div>
      </>
    }
    confirmButton={
      <Button
        onClick={props.onConfirm}
        disabled={props.confirmState === 'disabled'}
        loading={props.confirmState === 'pending'}
      >
        {props.isLeaving ? 'Leave pool' : 'Unstake'}
      </Button>
    }
    onRequestDismiss={props.onDismiss}
  />
)

export default UnstakeDialog
