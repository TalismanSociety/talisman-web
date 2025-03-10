import type { ReactNode } from 'react'
import { ClassNames } from '@emotion/react'
import { Hr } from '@talismn/ui/atoms/Hr'
import { TonalIcon } from '@talismn/ui/atoms/Icon'
import { Text } from '@talismn/ui/atoms/Text'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { ListItem } from '@talismn/ui/molecules/ListItem'
import { TextInput } from '@talismn/ui/molecules/TextInput'
import { Calculate, Earn } from '@talismn/web-icons'

export type StakeCalculatorDialogProps = {
  open?: boolean
  onRequestDismiss: () => unknown
  assetSelector: ReactNode
  amount: string
  onChangeAmount: (amount: string) => unknown
  yield: ReactNode
}

type EstimatedYieldProps = {
  dailyYield?: ReactNode
  weeklyYield?: ReactNode
  monthlyYield?: ReactNode
  annualYield?: ReactNode
}

const EstimatedYield = (props: EstimatedYieldProps) => (
  <section>
    <Text.Body as="header" css={{ marginBottom: '2.4rem' }}>
      <Earn size="1em" css={{ verticalAlign: 'middle' }} /> Projected earnings
    </Text.Body>
    <div
      css={{
        display: 'grid',
        '@container(min-width: 40rem)': {
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        },
        gap: '3.2rem',
      }}
    >
      <ListItem
        leadingContent={<TonalIcon>1D</TonalIcon>}
        overlineContent="1 day earnings"
        headlineContent={props.dailyYield ?? '...'}
        css={{ padding: 0 }}
      />
      <ListItem
        leadingContent={<TonalIcon>1W</TonalIcon>}
        overlineContent="1 week earnings"
        headlineContent={props.weeklyYield ?? '...'}
        css={{ padding: 0 }}
      />
      <ListItem
        leadingContent={<TonalIcon>1M</TonalIcon>}
        overlineContent="1 month earnings"
        headlineContent={props.monthlyYield ?? '...'}
        css={{ padding: 0 }}
      />
      <ListItem
        leadingContent={<TonalIcon>1Y</TonalIcon>}
        overlineContent="1 year earnings"
        headlineContent={props.annualYield ?? '...'}
        css={{ padding: 0 }}
      />
    </div>
  </section>
)

export const StakeCalculatorDialog = Object.assign(
  (props: StakeCalculatorDialogProps) => (
    <AlertDialog
      {...props}
      targetWidth="48rem"
      title={
        <span>
          <Calculate size="1em" css={{ verticalAlign: 'middle' }} /> Staking calculator
        </span>
      }
      content={
        <div css={{ containerType: 'inline-size' }}>
          <section
            css={{
              display: 'grid',
              gap: '1.2rem',
              '@container(min-width: 40rem)': {
                '> label': {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              },
            }}
          >
            <label>
              <div css={{ flex: 1 }}>Asset</div>
              <div css={{ flex: 1 }}>{props.assetSelector}</div>
            </label>
            <label>
              <div css={{ flex: 1 }}>Amount to stake</div>
              <ClassNames>
                {({ css }) => (
                  <TextInput
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={props.amount}
                    onChange={event => props.onChangeAmount(event.target.value)}
                    containerClassName={css({ flex: 1 })}
                    css={{ width: 0 }}
                  />
                )}
              </ClassNames>
            </label>
          </section>
          <Hr css={{ marginTop: '2.4rem', marginBottom: '2.4rem' }} />
          {props.yield}
          <Text.BodySmall as="footer" alpha="disabled" css={{ marginTop: '2.4rem' }}>
            The values displayed by our staking calculator are projections and should not be considered as guarantees.
            Actual results may differ.
          </Text.BodySmall>
        </div>
      }
    />
  ),
  { EstimatedYield }
)
