import { ArrowDown } from '@talismn/icons'
import {
  Button,
  Clickable,
  ContainedTextInput,
  useSurfaceColor,
  useSurfaceColorAtElevation,
  type ButtonProps,
} from '@talismn/ui'
import { type ReactNode } from 'react'

export type SwapFormProps = {
  accountSelector: ReactNode
  fromChainSelector: ReactNode
  fromTokenSelector: ReactNode
  fromAmount: string
  onChangeFromAmount: (amount: string) => unknown
  fromFiatAmount: ReactNode
  fromBalance: ReactNode
  toChainSelector: ReactNode
  toTokenSelector: ReactNode
  toAmount: string
  onChangeToAmount: (amount: string) => unknown
  toFiatAmount: ReactNode
  toBalance: ReactNode
}

const SwapForm = Object.assign(
  (props: SwapFormProps) => (
    <div>
      <div css={{ marginBottom: '2.4rem' }}>{props.accountSelector}</div>
      <ContainedTextInput
        width="100%"
        type="number"
        inputMode="decimal"
        value={props.fromAmount}
        onChange={event => props.onChangeFromAmount(event.target.value)}
        leadingIcon={
          <div css={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '50%' }}>
            {props.fromChainSelector}
            {props.fromTokenSelector}
          </div>
        }
        leadingSupportingText={<>Balance: {props.fromBalance}</>}
        trailingSupportingText={props.fromFiatAmount}
      />
      <div css={{ display: 'flex', margin: '-1.2rem 0' }}>
        <Clickable.WithFeedback
          css={{
            margin: 'auto',
            border: `0.4rem solid ${useSurfaceColorAtElevation(x => x - 1)}`,
            borderRadius: '0.8rem',
            background: useSurfaceColor(),
            padding: '0.18rem',
            aspectRatio: '1 / 1',
          }}
        >
          <ArrowDown size="2.4rem" />
        </Clickable.WithFeedback>
      </div>
      <ContainedTextInput
        width="100%"
        type="number"
        inputMode="decimal"
        value={props.toAmount}
        onChange={event => props.onChangeToAmount(event.target.value)}
        leadingIcon={
          <div css={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '50%' }}>
            {props.toChainSelector}
            {props.toTokenSelector}
          </div>
        }
        leadingSupportingText={<>Balance: {props.toBalance}</>}
        trailingSupportingText={props.toFiatAmount}
      />
    </div>
  ),
  {
    SubmitButton: (props: ButtonProps<'button'>) => (
      <Button {...props} css={{ width: '100%' }}>
        Swap
      </Button>
    ),
  }
)

export default SwapForm
