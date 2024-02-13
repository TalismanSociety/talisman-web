import { AlertDialog, Button, CircularProgressIndicator, Text, TextInput } from '@talismn/ui'
import { Suspense, type ReactNode } from 'react'

export type UnstakeDialogProps = {
  open?: boolean
  onDismiss: () => unknown
  onConfirm: () => unknown
  confirmState?: 'pending' | 'disabled'
  availableAmount: string
  amount: string
  fiatAmount: string
  newAmount: string
  newFiatAmount: ReactNode
  rate?: string
  onRequestMaxAmount: () => unknown
  onChangeAmount: (amount: string) => unknown
  lockDuration?: ReactNode
  isError?: boolean
  inputSupportingText?: string
  buttonText?: ReactNode
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
          trailingIcon={<TextInput.LabelButton onClick={props.onRequestMaxAmount}>Max</TextInput.LabelButton>}
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
        {props.lockDuration && (
          <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.6rem' }}>
            <Text.Body alpha="high">Unbonding period</Text.Body>
            <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Text.Body as="div" alpha="high">
                <Suspense fallback={<CircularProgressIndicator size="1em" />}>{props.lockDuration}</Suspense>
              </Text.Body>
            </div>
          </div>
        )}
      </>
    }
    confirmButton={
      <Button
        onClick={props.onConfirm}
        disabled={props.confirmState === 'disabled'}
        loading={props.confirmState === 'pending'}
      >
        {props.buttonText ?? 'Unstake'}
      </Button>
    }
    onRequestDismiss={props.onDismiss}
  />
)

type NominationPoolsUnstakeDialogProps = Omit<UnstakeDialogProps, 'rate'> & {
  isLeaving?: boolean
  lockDuration: string
}

export const NominationPoolsUnstakeDialog = (props: NominationPoolsUnstakeDialogProps) => (
  <UnstakeDialog {...props} buttonText={props.isLeaving ? 'Leave pool' : undefined} />
)

type SlpxUnstakeDialogProps = UnstakeDialogProps & { approvalNeeded?: boolean }

export const SlpxUnstakeDialog = (props: SlpxUnstakeDialogProps) => (
  <UnstakeDialog {...props} buttonText={props.approvalNeeded ? 'Approve' : undefined} />
)

export default UnstakeDialog
