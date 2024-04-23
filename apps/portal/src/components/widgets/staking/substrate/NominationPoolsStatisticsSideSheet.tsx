import AccountIcon from '@components/molecules/AccountIcon'
import type { StakeStatus } from '@components/recipes/StakeStatusIndicator'
import RedactableBalance from '@components/widgets/RedactableBalance'
import type { Account } from '@domains/accounts'
import { useChainState, useNativeTokenDecimalState } from '@domains/chains'
import { useEraEtaFormatter, useSubstrateApiState, useTokenAmountFromPlanck } from '@domains/common'
import {
  mostRecentPoolPayoutsState,
  poolPayoutsState,
  totalPoolPayoutsState,
  useApr,
  usePoolStakes,
  type DerivedPool,
} from '@domains/staking/substrate/nominationPools'
import { useTheme } from '@emotion/react'
import { encodeAddress } from '@polkadot/util-crypto'
import { BarChart, Clock, Earn, ExternalLink, Percent, Zap } from '@talismn/web-icons'
import {
  DescriptionList,
  ListItem,
  SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR,
  SideSheet,
  Text,
  TonalIcon,
  useSurfaceColorAtElevation,
} from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { eachDayOfInterval, isSameDay, subDays } from 'date-fns'
import { useMemo, type ReactNode } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTooltip } from 'victory'

export type NominationPoolsStatisticsSideSheetProps = {
  account: Account
  onRequestDismiss: () => unknown
}

type PayoutEntry = { date: Date; amount: number; displayAmount: ReactNode }

// TODO: Extract to reuseable recipe component
const Stats = (props: {
  account: Account
  poolName: ReactNode
  poolStatus: StakeStatus
  balance: ReactNode
  rewards: ReactNode
  apr: ReactNode
  nextEraEta: ReactNode
  currentDate?: Date
  last15DaysPayouts: readonly PayoutEntry[]
  mostRecentPayouts: readonly PayoutEntry[]
  unbondings: Array<{ eta: string; amount: string }>
  subscanPayoutsUrl?: string
  onRequestDismiss: () => unknown
}) => {
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
    <SideSheet
      title={
        <div css={{ display: 'flex', alignItems: 'center', gap: '0.25em' }}>
          <BarChart /> Statistics
        </div>
      }
      onRequestDismiss={props.onRequestDismiss}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2.4rem',
          [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '40rem' },
        }}
      >
        <ListItem
          headlineContent={props.account.name ?? shortenAddress(props.account.address)}
          supportingContent={shortenAddress(props.account.address)}
          leadingContent={<AccountIcon account={props.account} size="4rem" />}
          css={{ paddingRight: 0, paddingLeft: 0 }}
        />
        <Text.Body css={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem' }}>
          <Text.Body>Pool</Text.Body>
          <Text.Body>{props.poolName}</Text.Body>
        </Text.Body>
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
            overlineContent="Total balance"
            headlineContent={props.balance}
          />
          <ListItem
            css={{ padding: 0 }}
            leadingContent={
              <TonalIcon>
                <Earn />
              </TonalIcon>
            }
            overlineContent="15 days rewards"
            headlineContent={props.rewards}
          />
          <ListItem
            css={{ padding: 0 }}
            leadingContent={
              <TonalIcon>
                <Percent />
              </TonalIcon>
            }
            overlineContent="APR"
            headlineContent={props.apr}
          />
          <ListItem
            css={{ padding: 0 }}
            leadingContent={
              <TonalIcon>
                <Clock />
              </TonalIcon>
            }
            overlineContent="Current era ends"
            headlineContent={props.nextEraEta}
          />
        </div>
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
            <DescriptionList css={{ marginTop: '1.6rem', marginBottom: '1.6rem' }}>
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
                  <Text.Noop.A href={props.subscanPayoutsUrl} target="_blank" css={{ color: theme.color.primary }}>
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
    </SideSheet>
  )
}

// TODO: Extract to reuseable recipe component
const ExistingPool = (props: NominationPoolsStatisticsSideSheetProps & { pool: DerivedPool }) => {
  const chain = useRecoilValue(useChainState())

  const today = useMemo(() => new Date(), [])

  const payoutsStateParams = {
    account: props.account.address,
    poolId: props.pool.poolMember.poolId.toNumber(),
    chain,
    fromDate: subDays(today, 15),
    toDate: today,
  }

  const eraEtaFormatter = useEraEtaFormatter()

  const stakedReturn = useApr()

  const [api, decimal, last15DaysPayouts, last15DaysTotalPayouts, mostRecentPayouts] = useRecoilValue(
    waitForAll([
      useSubstrateApiState(),
      useNativeTokenDecimalState(),
      poolPayoutsState(payoutsStateParams),
      totalPoolPayoutsState(payoutsStateParams),
      mostRecentPoolPayoutsState(payoutsStateParams),
    ])
  )

  const balance = useTokenAmountFromPlanck(props.pool.poolMember.points)

  return (
    <Stats
      account={props.account}
      poolName={props.pool.poolName}
      poolStatus={props.pool.status}
      balance={<RedactableBalance>{balance.decimalAmount.toLocaleString()}</RedactableBalance>}
      rewards={<RedactableBalance>{last15DaysTotalPayouts.toLocaleString()}</RedactableBalance>}
      apr={stakedReturn.toLocaleString(undefined, { style: 'percent' })}
      nextEraEta={useEraEtaFormatter()(1)}
      unbondings={useMemo(
        () =>
          props.pool.unlockings.map(x => ({
            eta: eraEtaFormatter(x.erasTilWithdrawable),
            amount: decimal.fromPlanck(x.amount).toLocaleString(),
          })),
        [decimal, eraEtaFormatter, props.pool.unlockings]
      )}
      last15DaysPayouts={useMemo(
        () =>
          last15DaysPayouts.map(x => ({
            date: x.date,
            amount: x.amount.toNumber(),
            displayAmount: <RedactableBalance>{x.amount.toLocaleString()}</RedactableBalance>,
          })),
        [last15DaysPayouts]
      )}
      mostRecentPayouts={useMemo(
        () =>
          mostRecentPayouts.map(x => ({
            date: x.date,
            amount: x.amount.toNumber(),
            displayAmount: <RedactableBalance>{x.amount.toLocaleString()}</RedactableBalance>,
          })),
        [mostRecentPayouts]
      )}
      subscanPayoutsUrl={useMemo(
        () =>
          new URL(
            `account/${encodeAddress(props.account.address, api.registry.chainSS58)}?tab=paidout`,
            chain.subscanUrl
          ).toString(),
        [api.registry.chainSS58, chain.subscanUrl, props.account.address]
      )}
      onRequestDismiss={props.onRequestDismiss}
    />
  )
}

const NominationPoolsStatisticsSideSheet = (props: NominationPoolsStatisticsSideSheetProps) => {
  const pool = usePoolStakes(props.account)

  if (pool === undefined) {
    return null
  }

  return <ExistingPool {...props} pool={pool} />
}

export default NominationPoolsStatisticsSideSheet
