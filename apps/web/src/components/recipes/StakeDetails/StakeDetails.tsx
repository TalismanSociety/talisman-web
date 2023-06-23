import { useTheme } from '@emotion/react'
import { Zap } from '@talismn/icons'
import { Button, DescriptionList, Icon, Identicon, ListItem, StatusIndicator, Surface, Text } from '@talismn/ui'
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory'

export type StakeDetailsProps = {
  className?: string
}

const StakeDetails = (props: StakeDetailsProps) => {
  const theme = useTheme()
  return (
    <div className={props.className} css={{ containerType: 'inline-size' }}>
      <Surface
        css={{
          'display': 'grid',
          'gridTemplateAreas': `
            'account'
            'actions'
            'statistics'
            'chart'
            'payouts'
         `,
          'flexDirection': 'column',
          'gap': '3.2rem',
          'borderRadius': '0.8rem',
          'padding': '2.4rem',
          '@container(min-width: 80rem)': {
            gridTemplateAreas: `
              'account    actions'
              'statistics statistics'
              'chart      payouts'
            `,
          },
        }}
      >
        <ListItem
          css={{ gridArea: 'account', padding: 0 }}
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
            'gridArea': 'actions',
            'display': 'flex',
            'flexWrap': 'wrap',
            'gap': '0.8rem',
            '@container(min-width: 80rem)': { justifySelf: 'end' },
          }}
        >
          <Button>Claim</Button>
          <Button>Add stake</Button>
          <Button variant="surface">Unstake</Button>
        </div>
        <div
          css={{
            'gridArea': 'statistics',
            'display': 'grid',
            'gridTemplateColumns': 'repeat(2, minmax(0, 1fr))',
            'gap': '0.5rem 2.4rem',
            '@container(min-width: 80rem)': {
              display: 'flex',
              justifyContent: 'space-between',
            },
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
            headlineText="34234.12 DOT"
          />
          <ListItem
            css={{ padding: 0 }}
            leadingContent={
              <Icon>
                <Zap />
              </Icon>
            }
            overlineText="Total balance"
            headlineText="34234.12 DOT"
          />
          <ListItem
            css={{ padding: 0 }}
            leadingContent={
              <Icon>
                <Zap />
              </Icon>
            }
            overlineText="Total balance"
            headlineText="34234.12 DOT"
          />
          <ListItem
            css={{ padding: 0 }}
            leadingContent={
              <Icon>
                <Zap />
              </Icon>
            }
            overlineText="Total balance"
            headlineText="34234.12 DOT"
          />
        </div>
        <Surface as="section" css={{ gridArea: 'chart', borderRadius: '0.8rem', padding: '1.6rem' }}>
          <header css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text.H4>Total balance</Text.H4>
            <div css={{ textAlign: 'end' }}>
              <Text.BodyLarge as="div" alpha="high">
                34234.12 DOT
              </Text.BodyLarge>
              <Text.BodyLarge as="div">$495.11</Text.BodyLarge>
            </div>
          </header>
          <VictoryChart domainPadding={40}>
            <VictoryAxis
              style={{
                axis: { stroke: `color-mix(in srgb, ${theme.color.onSurface}, transparent 50%)` },
                ticks: { stroke: 'transparent' },
                tickLabels: { fill: `color-mix(in srgb, ${theme.color.onSurface}, transparent 50%)` },
              }}
            />
            <VictoryAxis
              dependentAxis
              crossAxis
              style={{
                axis: { stroke: 'transparent' },
                ticks: { stroke: 'transparent' },
                tickLabels: { fill: theme.color.onSurface },
                grid: { stroke: `color-mix(in srgb, ${theme.color.onSurface}, transparent 90%)`, strokeDasharray: 4 },
              }}
            />
            <VictoryBar
              style={{ data: { fill: '#E6007A' } }}
              data={[
                { quarter: 1, earnings: 13 },
                { quarter: 2, earnings: 16 },
                { quarter: 3, earnings: 14 },
                { quarter: 4, earnings: 19 },
                { quarter: 5, earnings: 13 },
                { quarter: 6, earnings: 16 },
                { quarter: 7, earnings: 14 },
                { quarter: 8, earnings: 19 },
              ]}
              x="quarter"
              y="earnings"
              cornerRadius={2}
            />
          </VictoryChart>
        </Surface>
        <section css={{ gridArea: 'payouts' }}>
          <Text.H4>Latest payouts</Text.H4>
          <DescriptionList>
            <DescriptionList.Description>
              <DescriptionList.Term>123.3 DOT</DescriptionList.Term>
              <DescriptionList.Details>2h 32min</DescriptionList.Details>
            </DescriptionList.Description>
            <DescriptionList.Description>
              <DescriptionList.Term>123.3 DOT</DescriptionList.Term>
              <DescriptionList.Details>2h 32min</DescriptionList.Details>
            </DescriptionList.Description>
            <DescriptionList.Description>
              <DescriptionList.Term>123.3 DOT</DescriptionList.Term>
              <DescriptionList.Details>2h 32min</DescriptionList.Details>
            </DescriptionList.Description>
            <DescriptionList.Description>
              <DescriptionList.Term>123.3 DOT</DescriptionList.Term>
              <DescriptionList.Details>2h 32min</DescriptionList.Details>
            </DescriptionList.Description>
          </DescriptionList>
        </section>
      </Surface>
    </div>
  )
}

export default StakeDetails
