import type { ReactNode } from 'react'
import { Button } from '@talismn/ui/atoms/Button'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Text } from '@talismn/ui/atoms/Text'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { TextInput } from '@talismn/ui/molecules/TextInput'
import { Suspense } from 'react'

import { type TokenAmountFromPlank } from '@/domains/common/hooks/useTokenAmount'

import { SlippageDropdown } from '../widgets/staking/subtensor/SlippageDropdown'

export type UnstakeDialogProps = {
  open?: boolean
  onDismiss: () => unknown
  onConfirm: () => unknown
  confirmState?: 'pending' | 'disabled'
  availableAmount: string
  amount: string
  fiatAmount: string
  newAmount: ReactNode
  newFiatAmount: ReactNode
  rate?: string
  onRequestMaxAmount: () => unknown
  onChangeAmount: (amount: string) => unknown
  lockDuration?: ReactNode
  isError?: boolean
  inputSupportingText?: string
  buttonText?: ReactNode
  slippage?: number
  expectedTokenAmount?: ReactNode
  talismanFeeTokenAmount?: TokenAmountFromPlank
}

export const UnstakeDialog = (props: UnstakeDialogProps) => (
  <AlertDialog
    open={props.open}
    title="Unstake"
    targetWidth="44rem"
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
        {props.expectedTokenAmount && props.expectedTokenAmount}
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
        {props.talismanFeeTokenAmount && (
          <div className="mt-[0.5rem] flex items-center justify-between">
            <Text.Body as="p" alpha="high">
              0.5% Talisman Fee
            </Text.Body>
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              <Text.Body alpha="high">
                {props.talismanFeeTokenAmount.decimalAmount?.toLocaleStringPrecision()}
              </Text.Body>
            </Suspense>
          </div>
        )}
        {props.slippage !== undefined && (
          <div className="mt-[1rem]">
            <SlippageDropdown />
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
  <UnstakeDialog {...props} buttonText={props.approvalNeeded ? 'Approve Spend' : undefined} />
)
