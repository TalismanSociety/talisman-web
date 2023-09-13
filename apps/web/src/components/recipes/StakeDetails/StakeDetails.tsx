import AccountIcon from '@components/molecules/AccountIcon'
import type { Account } from '@domains/accounts'
import { useTheme } from '@emotion/react'
import { Clock, Earn, ExternalLink, Percent, Zap, ZapOff } from '@talismn/icons'
import {
  Button,
  DescriptionList,
  ListItem,
  Surface,
  Text,
  TonalIcon,
  useSurfaceColorAtElevation,
  type ButtonProps,
} from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { eachDayOfInterval, isSameDay, subDays } from 'date-fns'
import { useMemo, type ReactNode } from 'react'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTooltip } from 'victory'
import { StakeStatusIndicator, type StakeStatus } from '../StakeStatusIndicator'

type PayoutEntry = { date: Date; amount: number; displayAmount: ReactNode }

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
  apr: ReactNode
  nextEraEta: ReactNode
  currentDate?: Date
  last15DaysPayouts: readonly PayoutEntry[]
  mostRecentPayouts: readonly PayoutEntry[]
  subscanPayoutsUrl?: string
  unbondings: Array<{ eta: string; amount: string }>
  readonly?: boolean
}

const StakeDetails = Object.assign(
  (props: StakeDetailsProps) => {
    const theme = useTheme()

    const now = useMemo(
      () => props.currentDate ?? new Date(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props.currentDate?.getTime()]
    )

    const groupedPayouts = useMemo(() => {
      const days = eachDayOfInterval({ start: subDays(now, 15), end: now })
        .sort((a, b) => a.getTime() - b.getTime())
        .slice(-15)

      return days.map(x => ({
        date: x.toISOString(),
        amount: props.last15DaysPayouts.filter(y => isSameDay(x, y.date)).reduce((prev, curr) => prev + curr.amount, 0),
      }))
    }, [now, props.last15DaysPayouts])

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
              leadingContent={<AccountIcon account={props.account} size="3.2rem" />}
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
              style={{ display: props.readonly ? 'none' : undefined }}
            >
              {props.claimButton}
              {props.withdrawButton}
              {props.addButton}
              {props.unbondButton}
            </div>
          </div>
          <div
            css={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(15rem, 100%), 1fr))',
              gap: '2.4rem 0.8rem',
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
                  <Earn />
                </TonalIcon>
              }
              overlineText="15 days rewards"
              headlineText={props.rewards}
            />
            <ListItem
              css={{ padding: 0 }}
              leadingContent={
                <TonalIcon>
                  <Percent />
                </TonalIcon>
              }
              overlineText="APR"
              headlineText={props.apr}
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
            <section
              css={{
                flex: '2 1 auto',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '0.8rem',
                border: `solid 2px ${useSurfaceColorAtElevation(x => x + 1)}`,
                padding: '1.6rem',
              }}
            >
              <header css={{ display: 'contents' }}>
                <Text.H4>Payouts over last 15 days</Text.H4>
              </header>
              <div css={{ flex: 1 }}>
                <VictoryChart domainPadding={25} height={225} padding={{ top: 5, right: 0, bottom: 40, left: 50 }}>
                  <VictoryAxis
                    tickFormat={x =>
                      new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' }).format(new Date(x))
                    }
                    tickLabelComponent={
                      <VictoryLabel
                        angle={-35}
                        textAnchor="end"
                        style={{
                          fontFamily: 'Surt',
                          fontSize: 10,
                          fill: `color-mix(in srgb, ${theme.color.onSurface}, transparent 50%)`,
                          padding: 1000,
                        }}
                      />
                    }
                    style={{
                      axis: { stroke: `color-mix(in srgb, ${theme.color.onSurface}, transparent 90%)` },
                      ticks: { stroke: 'transparent' },
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    tickValues={useMemo(
                      () => (groupedPayouts.every(x => x.amount === 0) ? [0.2, 0.4, 0.6, 0.8] : undefined),
                      [groupedPayouts]
                    )}
                    style={{
                      axis: { stroke: 'transparent' },
                      ticks: { stroke: 'transparent' },
                      tickLabels: { fill: theme.color.onSurface, fontFamily: 'Surt', fontSize: 12 },
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
                    labelComponent={
                      <VictoryTooltip
                        flyoutStyle={{ fill: useSurfaceColorAtElevation(x => x + 2) }}
                        labelComponent={
                          <VictoryLabel style={{ fill: theme.color.onSurface, fontFamily: 'Surt', fontSize: 10 }} />
                        }
                      />
                    }
                  />
                </VictoryChart>
              </div>
            </section>
            <div css={{ flex: '33rem' }}>
              <section>
                <Text.H4>Latest payouts</Text.H4>
                <DescriptionList>
                  {props.mostRecentPayouts.length <= 0 && <Text.Body>No payouts found</Text.Body>}
                  {useMemo(
                    () =>
                      [...props.mostRecentPayouts]
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
                    [props.mostRecentPayouts]
                  )}
                  <DescriptionList.Description>
                    <DescriptionList.Term></DescriptionList.Term>
                    <DescriptionList.Details>
                      <Text.Noop.A color={theme => theme.color.primary} href={props.subscanPayoutsUrl} target="_blank">
                        View all on Subscan <ExternalLink size="1em" />
                      </Text.Noop.A>
                    </DescriptionList.Details>
                  </DescriptionList.Description>
                </DescriptionList>
              </section>
              <section css={{ marginTop: '2.4rem' }}>
                <Text.H4>Unbondings</Text.H4>
                <DescriptionList>
                  {props.unbondings.length <= 0 && <Text.Body>No active unbonding</Text.Body>}
                  {props.unbondings.map((x, index) => (
                    <DescriptionList.Description key={index} className="payout">
                      <DescriptionList.Term>{x.amount}</DescriptionList.Term>
                      <DescriptionList.Details>{x.eta}</DescriptionList.Details>
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
      <Button {...props} leadingIcon={<Zap />} variant="surface">
        Stake
      </Button>
    ),
    UnbondButton: (props: ButtonProps) => (
      <Button {...props} leadingIcon={<ZapOff />} variant="surface">
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
