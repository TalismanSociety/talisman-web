import type { Account } from '@domains/accounts'
import { useTheme } from '@emotion/react'
import { Clock, Percent, Zap } from '@talismn/icons'
import { Button, DescriptionList, Identicon, ListItem, Surface, Text, TonalIcon, type ButtonProps } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { eachDayOfInterval, isSameDay, max as maxDate, min as minDate } from 'date-fns'
import { useMemo, type ReactNode } from 'react'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTooltip } from 'victory'
import { StakeStatusIndicator, type StakeStatus } from '../StakeStatusIndicator'

type PayoutEntry = { date: Date; amount: number; displayAmount: string }

export type StakeDetailsProps = {
  className?: string
  account: Account
  poolName: ReactNode
  poolStatus: StakeStatus
  claimButton?: ReactNode
  addButton?: ReactNode
  unbondButton?: ReactNode
  withdrawButton?: ReactNode
  balance: ReactNode
  rewards: ReactNode
  apy: ReactNode
  nextEraEta: ReactNode
  payouts: readonly PayoutEntry[]
  unbondings: Array<{ eta: string; amount: string }>
  readonly?: boolean
}

const StakeDetails = Object.assign(
  (props: StakeDetailsProps) => {
    const theme = useTheme()

    const groupedPayouts = useMemo(() => {
      const dateFormat = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'numeric', year: '2-digit' })

      const dates = props.payouts.map(x => x.date)
      const days = eachDayOfInterval({ start: minDate(dates), end: maxDate(dates) })
        .sort((a, b) => a.getTime() - b.getTime())
        .slice(-15)

      return days.map(x => ({
        date: dateFormat.format(x),
        amount: props.payouts.filter(y => isSameDay(x, y.date)).reduce((prev, curr) => prev + curr.amount, 0),
      }))
    }, [props.payouts])

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
              leadingContent={<Identicon value={props.account.address} size="3.2rem" />}
              headlineText={props.account.name ?? shortenAddress(props.account.address)}
              supportingText={
                <>
                  <StakeStatusIndicator css={{ display: 'inline-block' }} status={props.poolStatus} /> {props.poolName}
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
                <TonalIcon>
                  <Zap />
                </TonalIcon>
              }
              overlineText="Total balance"
              headlineText={props.balance}
            />
            <ListItem
              css={{ padding: 0 }}
              leadingContent={
                <TonalIcon>
                  <Zap />
                </TonalIcon>
              }
              overlineText="Earned rewards"
              headlineText={props.rewards}
            />
            <ListItem
              css={{ padding: 0 }}
              leadingContent={
                <TonalIcon>
                  <Percent />
                </TonalIcon>
              }
              overlineText="APY"
              headlineText={props.apy}
            />
            <ListItem
              css={{ padding: 0 }}
              leadingContent={
                <TonalIcon>
                  <Clock />
                </TonalIcon>
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
                <VictoryChart domainPadding={25} height={225} padding={{ top: 5, right: 50, bottom: 50, left: 50 }}>
                  <VictoryAxis
                    tickLabelComponent={
                      <VictoryLabel
                        angle={-35}
                        textAnchor="end"
                        style={{ fill: `color-mix(in srgb, ${theme.color.onSurface}, transparent 50%)`, padding: 1000 }}
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
                    data={groupedPayouts}
                    x="date"
                    y="amount"
                    labels={({ datum }) => datum.amount}
                    cornerRadius={2}
                    labelComponent={<VictoryTooltip />}
                  />
                </VictoryChart>
              </div>
            </Surface>
            <div css={{ flex: '33rem' }}>
              <section>
                <Text.H4>Latest payouts</Text.H4>
                <DescriptionList>
                  {useMemo(
                    () =>
                      [...props.payouts]
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .slice(0, 5)
                        .map((x, index) => (
                          <DescriptionList.Description key={index}>
                            <DescriptionList.Term>{x.displayAmount}</DescriptionList.Term>
                            <DescriptionList.Details>
                              {new Intl.DateTimeFormat(undefined, { timeStyle: 'short', dateStyle: 'short' }).format(
                                x.date
                              )}
                            </DescriptionList.Details>
                          </DescriptionList.Description>
                        )),
                    [props.payouts]
                  )}
                </DescriptionList>
              </section>
              {props.unbondings.length > 0 && (
                <section>
                  <Text.H4>Unbondings</Text.H4>
                  <DescriptionList>
                    {props.unbondings.map((x, index) => (
                      <DescriptionList.Description key={index} className="payout">
                        <DescriptionList.Term>{x.amount}</DescriptionList.Term>
                        <DescriptionList.Details>{x.eta}</DescriptionList.Details>
                      </DescriptionList.Description>
                    ))}
                  </DescriptionList>
                </section>
              )}
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
