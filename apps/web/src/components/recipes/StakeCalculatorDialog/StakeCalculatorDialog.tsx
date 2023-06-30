import { ClassNames } from '@emotion/react'
import { AlertDialog, Hr, ListItem, TextInput, TonalIcon } from '@talismn/ui'
import type { ReactNode } from 'react'

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
  <section
    css={{
      'display': 'grid',
      '@container(min-width: 40rem)': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
      'gap': '3.2rem',
    }}
  >
    <ListItem
      leadingContent={<TonalIcon>1D</TonalIcon>}
      overlineText="1 day earnings"
      headlineText={props.dailyYield ?? '...'}
      css={{ padding: 0 }}
    />
    <ListItem
      leadingContent={<TonalIcon>1W</TonalIcon>}
      overlineText="1 week earnings"
      headlineText={props.weeklyYield ?? '...'}
      css={{ padding: 0 }}
    />
    <ListItem
      leadingContent={<TonalIcon>1M</TonalIcon>}
      overlineText="1 month earnings"
      headlineText={props.monthlyYield ?? '...'}
      css={{ padding: 0 }}
    />
    <ListItem
      leadingContent={<TonalIcon>1Y</TonalIcon>}
      overlineText="1 year earnings"
      headlineText={props.annualYield ?? '...'}
      css={{ padding: 0 }}
    />
  </section>
)

const StakeCalculatorDialog = Object.assign(
  (props: StakeCalculatorDialogProps) => (
    <AlertDialog
      {...props}
      width="48rem"
      title="Staking calculator"
      content={
        <div css={{ containerType: 'inline-size' }}>
          <section
            css={{
              'display': 'grid',
              'gap': '1.2rem',
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
        </div>
      }
    />
  ),
  { EstimatedYield: EstimatedYield }
)

export default StakeCalculatorDialog
