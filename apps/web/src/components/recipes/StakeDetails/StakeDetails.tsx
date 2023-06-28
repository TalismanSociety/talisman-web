import type { Account } from '@domains/accounts'
import { useTheme } from '@emotion/react'
import { Clock, Percent, Zap } from '@talismn/icons'
import {
  Button,
  DescriptionList,
  Icon,
  Identicon,
  ListItem,
  StatusIndicator,
  Surface,
  Text,
  type ButtonProps,
} from '@talismn/ui'
import type { ReactNode } from 'react'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTooltip } from 'victory'

type BalanceEntry = { date: Date; value: number }

export type StakeDetailsProps = {
  className?: string
  account: Account
  claimButton?: ReactNode
  addButton?: ReactNode
  unbondButton?: ReactNode
  withdrawButton?: ReactNode
  balance: ReactNode
  rewards: ReactNode
  apy: ReactNode
  nextEraEta: ReactNode
  payouts: Array<{ date: Date; amount: number; displayAmount: string }>
  unbondings: Array<{ eta: string; amount: string }>
  readonly?: boolean
}

const StakeDetails = Object.assign(
  (props: StakeDetailsProps) => {
    const theme = useTheme()
    return (
      <div className={props.className} css={{ containerType: 'inline-size' }}>
        <Surface
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3.2rem',
            borderRadius: '0.8rem',
            padding: '2.4rem',
          }}
        >
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.6rem',
              flexWrap: 'wrap',
            }}
          >
            <ListItem
              css={{ padding: 0 }}
              leadingContent={<Identicon value="foo" size="3.2rem" />}
              headlineText="Account 1"
              supportingText={
                <>
                  <StatusIndicator css={{ display: 'inline-block' }} status="success" /> Talisman pool 1
                </>
              }
            />
            <div
              css={{
                'display': 'flex',
                'flexWrap': 'wrap',
                'gap': '0.8rem',
                '@container(min-width: 80rem)': { justifySelf: 'end' },
              }}
            >
              {props.claimButton}
              {props.withdrawButton}
              {props.addButton}
              {props.unbondButton}
            </div>
          </div>
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem 2.4rem',
            }}
          >
            <ListItem
              css={{ padding: 0 }}
              leadingContent={
                <Icon>
                  <Zap />
                </Icon>
              }
              overlineText="Total balance"
              headlineText={props.balance}
            />
            <ListItem
              css={{ padding: 0 }}
              leadingContent={
                <Icon>
                  <Zap />
                </Icon>
              }
              overlineText="Earned rewards"
              headlineText={props.rewards}
            />
            <ListItem
              css={{ padding: 0 }}
              leadingContent={
                <Icon>
                  <Percent />
                </Icon>
              }
              overlineText="APY"
              headlineText={props.apy}
            />
            <ListItem
              css={{ padding: 0 }}
              leadingContent={
                <Icon>
                  <Clock />
                </Icon>
              }
              overlineText="Current era ends"
              headlineText={props.nextEraEta}
            />
          </div>
          <div css={{ display: 'flex', flexWrap: 'wrap', gap: '2.4rem' }}>
            <Surface
              as="section"
              css={{
                flex: '2 1 auto',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '0.8rem',
                padding: '1.6rem',
              }}
            >
              <header css={{ display: 'contents' }}>
                <Text.H3>Payouts</Text.H3>
              </header>
              <div css={{ flex: 1 }}>
                <VictoryChart domainPadding={25}>
                  <VictoryAxis
                    tickLabelComponent={
                      <VictoryLabel
                        angle={-35}
                        textAnchor="end"
                        style={{ fill: `color-mix(in srgb, ${theme.color.onSurface}, transparent 50%)` }}
                      />
                    }
                    style={{
                      axis: { stroke: `color-mix(in srgb, ${theme.color.onSurface}, transparent 90%)` },
                      ticks: { stroke: 'transparent' },
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{
                      axis: { stroke: 'transparent' },
                      ticks: { stroke: 'transparent' },
                      tickLabels: { fill: theme.color.onSurface },
                      grid: {
                        stroke: `color-mix(in srgb, ${theme.color.onSurface}, transparent 90%)`,
                        strokeDasharray: 4,
                      },
                    }}
                  />
                  <VictoryBar
                    style={{ data: { fill: '#E6007A' } }}
                    data={props.payouts}
                    x={({ date }: BalanceEntry) =>
                      new Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(date)
                    }
                    y="amount"
                    labels={({ datum }) =>
                      `Payout: ${datum.displayAmount as string}\nDate: ${new Intl.DateTimeFormat().format(datum.date)}`
                    }
                    cornerRadius={2}
                    labelComponent={<VictoryTooltip />}
                  />
                </VictoryChart>
              </div>
            </Surface>
            <div css={{ flex: '33rem' }}>
              <section>
                <Text.H4>Unbondings</Text.H4>
                <DescriptionList>
                  {props.unbondings.map((x, index) => (
                    <DescriptionList.Description key={index}>
                      <DescriptionList.Term>{x.amount}</DescriptionList.Term>
                      <DescriptionList.Details>{x.eta}</DescriptionList.Details>
                    </DescriptionList.Description>
                  ))}
                </DescriptionList>
              </section>
              <section>
                <Text.H4>Latest payouts</Text.H4>
                <DescriptionList>
                  {[...props.payouts]
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((x, index) => (
                      <DescriptionList.Description key={index}>
                        <DescriptionList.Term>{x.displayAmount}</DescriptionList.Term>
                        <DescriptionList.Details>{new Intl.DateTimeFormat().format(x.date)}</DescriptionList.Details>
                      </DescriptionList.Description>
                    ))}
                </DescriptionList>
              </section>
            </div>
          </div>
        </Surface>
      </div>
    )
  },
  {
    ClaimButton: (props: ButtonProps & { amount: string }) => <Button {...props}>Claim {props.amount}</Button>,
    AddButton: (props: ButtonProps) => (
      <Button {...props} variant="surface">
        Add stake
      </Button>
    ),
    UnbondButton: (props: ButtonProps) => (
      <Button {...props} variant="surface">
        Unstake
      </Button>
    ),
    WithdrawButton: (props: ButtonProps & { amount: string }) => (
      <Button {...props} variant="surface">
        Withdraw {props.amount}
      </Button>
    ),
  }
)
export default StakeDetails
