import { useTheme } from '@emotion/react'
import { Chip, type ChipProps, Skeleton, Text } from '@talismn/ui'
import { type ReactNode } from 'react'
import { VictoryPie, VictoryTooltip } from 'victory'

type Data = { label: string; value: number; renderValue?: (value: number) => ReactNode; color: string }

export type PortfolioAllocationGraphProps = {
  assetChip: ReactNode
  stateChip: ReactNode
  data: Data[]
}

const Legend = (props: Data) => (
  <span css={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
    <div css={{ width: '1.2rem', height: '1.2rem', borderRadius: '50%', backgroundColor: props.color }} />
    <Text.BodyLarge alpha="high">{props.label}</Text.BodyLarge>
    <Text.BodyLarge>{props.renderValue?.(props.value) ?? props.value}</Text.BodyLarge>
  </span>
)

const AssetChip = (props: ChipProps) => <Chip {...props}>Asset</Chip>

const StateChip = (props: ChipProps) => <Chip {...props}>State</Chip>

const PortfolioAllocationGraphSkeleton = () => (
  <Skeleton.Surface
    css={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderRadius: '2.4rem',
      padding: '2.4rem',
    }}
  >
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1.6rem',
        height: '100%',
      }}
    >
      <div>
        <header>
          <Text.H4>Portfolio allocation</Text.H4>
        </header>
      </div>
      <ul css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', margin: 0, padding: 0 }}>
        <Skeleton.Foreground css={{ width: '10rem', height: '1em' }} />
        <Skeleton.Foreground css={{ width: '10rem', height: '1em' }} />
      </ul>
    </div>
    <div>
      <VictoryPie
        width={196}
        height={196}
        padding={4}
        innerRadius={80}
        cornerRadius={20}
        padAngle={6}
        labels={() => ''}
        data={[{ x: 'dummy', y: 1 }]}
      />
    </div>
  </Skeleton.Surface>
)

const PortfolioAllocationGraph = Object.assign(
  (props: PortfolioAllocationGraphProps) => {
    const theme = useTheme()

    return (
      <article
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderRadius: '2.4rem',
          padding: '2.4rem',
          backgroundColor: theme.color.surface,
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.6rem',
            alignSelf: 'stretch',
          }}
        >
          <div>
            <header>
              <Text.H4>Portfolio allocation</Text.H4>
            </header>
            <div css={{ display: 'flex', gap: '0.8rem' }}>
              {props.assetChip}
              {props.stateChip}
            </div>
          </div>
          <ul css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', margin: 0, padding: 0 }}>
            {props.data.map((data, index) => (
              <Legend key={index} {...data} />
            ))}
          </ul>
        </div>
        <div>
          <VictoryPie
            width={196}
            height={196}
            padding={4}
            innerRadius={80}
            cornerRadius={20}
            padAngle={6}
            labelComponent={
              <VictoryTooltip
                x={99}
                y={149}
                orientation="top"
                pointerLength={0}
                cornerRadius={50}
                flyoutWidth={100}
                flyoutHeight={100}
                flyoutStyle={{ fill: theme.color.foreground }}
                style={{ fontFamily: "'Surt', sans-serif", fontWeight: 'bold', fill: theme.color.onForeground }}
              />
            }
            colorScale={props.data.map(x => x.color)}
            data={props.data.map(x => ({ x: x.label, y: x.value, color: x.color }))}
          />
        </div>
      </article>
    )
  },
  { AssetChip, StateChip, Skeleton: PortfolioAllocationGraphSkeleton }
)

export default PortfolioAllocationGraph
