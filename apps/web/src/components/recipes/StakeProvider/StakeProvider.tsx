import { Zap } from '@talismn/icons'
import {
  Button,
  LinearProgressIndicator,
  Surface,
  Text,
  type ButtonProps,
  CircularProgressIndicator,
} from '@talismn/ui'
import type { ElementType, PropsWithChildren, ReactNode } from 'react'

export type StakeProviderProps = {
  logo: string
  symbol: ReactNode
  chain: ReactNode
  apr: ReactNode
  type: ReactNode
  provider: ReactNode
  unbondingPeriod: ReactNode
  availableBalance: ReactNode
  availableFiatBalance: ReactNode
  stakePercentage: ReactNode
  stakeButton: ReactNode
}

const StakeButton = <T extends ElementType>(props: Omit<ButtonProps<T>, 'children'>) => (
  // @ts-expect-error
  <Button {...props} variant="surface" leadingIcon={<Zap />} css={theme => ({ color: theme.color.primary })}>
    Stake
  </Button>
)

type StakePercentageProps =
  | {
      loading: true
    }
  | { loading?: false; percentage: number }

const StakePercentage = (props: StakePercentageProps) => (
  <>
    <Text.BodySmall as="div" alpha="high" css={{ textAlign: 'end', marginBottom: '0.6rem' }}>
      {props.loading ? (
        <CircularProgressIndicator size="1em" />
      ) : (
        props.percentage.toLocaleString(undefined, { style: 'percent' })
      )}
    </Text.BodySmall>
    <LinearProgressIndicator value={props.loading ? 0 : props.percentage} />
  </>
)

const Grid = (props: PropsWithChildren<{ className?: string }>) => (
  <Surface
    as="article"
    css={{
      'borderRadius': '0.8rem',
      'padding': '1.6rem',
      'display': 'grid',
      'gridTemplateAreas': `
        'asset   action'
        'divider divider'
        'apr     type'
      `,
      'gap': '0.6rem',
      '@container (min-width: 100rem)': {
        alignItems: 'center',
        gridTemplateAreas: `'asset apr type provider unbonding-period available-balance stake-percentage action'`,
        gridTemplateColumns:
          'minmax(0, 1fr) minmax(0, 0.75fr) repeat(4, minmax(0, 1fr)) minmax(0, 0.5fr) minmax(0, 1fr)',
      },
    }}
    {...props}
  />
)

const StakeProvider = Object.assign(
  (props: StakeProviderProps) => {
    return (
      <div css={{ containerType: 'inline-size' }}>
        <Grid>
          <div css={{ gridArea: 'asset', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img
              src={props.logo}
              css={{
                width: '2em',
                height: '2em',
                borderRadius: '50%',
              }}
            />
            <div>
              <Text.Body as="div" alpha="high">
                {props.symbol}
              </Text.Body>
              <Text.BodySmall as="div">{props.provider}</Text.BodySmall>
            </div>
          </div>
          <div css={{ gridArea: 'action', justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {props.stakeButton}
          </div>
          <div css={{ gridArea: 'type' }}>
            <Text.BodySmall as="div" css={{ '@container (min-width: 100rem)': { display: 'none' } }}>
              Type
            </Text.BodySmall>
            <Text.Body as="div" alpha="high">
              {props.type}
            </Text.Body>
          </div>
          <div
            css={{ 'gridArea': 'provider', 'display': 'none', '@container (min-width: 100rem)': { display: 'revert' } }}
          >
            <Text.BodySmall as="div" css={{ '@container (min-width: 100rem)': { display: 'none' } }}>
              Provider
            </Text.BodySmall>
            <Text.Body as="div" alpha="high">
              {props.provider}
            </Text.Body>
          </div>
          <div
            css={{
              'gridArea': 'unbonding-period',
              'display': 'none',
              '@container (min-width: 100rem)': { display: 'revert' },
            }}
          >
            <Text.BodySmall as="div" css={{ '@container (min-width: 100rem)': { display: 'none' } }}>
              Unbonding period
            </Text.BodySmall>
            <Text.Body as="div" alpha="high">
              {props.unbondingPeriod}
            </Text.Body>
          </div>
          <div
            css={{
              'gridArea': 'available-balance',
              'display': 'none',
              '@container (min-width: 100rem)': { display: 'revert' },
            }}
          >
            <Text.Body as="div" alpha="high">
              {props.availableBalance}
            </Text.Body>
            <Text.BodySmall
              as="div"
              css={{ 'display': 'none', '@container (min-width: 100rem)': { display: 'revert' } }}
            >
              {props.availableFiatBalance}
            </Text.BodySmall>
          </div>
          <div
            css={{
              'gridArea': 'stake-percentage',
              'display': 'none',
              '@container (min-width: 100rem)': { display: 'revert' },
            }}
          >
            {props.stakePercentage}
          </div>
          <Surface
            css={{
              'gridArea': 'divider',
              'height': 1,
              '@container (min-width: 100rem)': { display: 'none' },
            }}
          />
          <div css={{ gridArea: 'apr' }}>
            <Text.BodySmall as="div" css={{ '@container (min-width: 100rem)': { display: 'none' } }}>
              APR (%)
            </Text.BodySmall>
            <Text.Body as="div" alpha="high">
              {props.apr}
            </Text.Body>
          </div>
        </Grid>
      </div>
    )
  },
  { StakeButton, StakePercentage }
)

export const StakeProviderList = (props: PropsWithChildren<{ className?: string }>) => (
  <section {...props}>
    <div css={{ containerType: 'inline-size' }}>
      <header
        css={{
          'display': 'none',
          'marginBottom': '1.2rem',
          '@container (min-width: 100rem)': { display: 'revert' },
        }}
      >
        <Grid css={{ backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 }}>
          <Text.BodySmall css={{ gridArea: 'asset' }}>Asset</Text.BodySmall>
          <Text.BodySmall css={{ gridArea: 'apr' }}>Est. Return</Text.BodySmall>
          <Text.BodySmall css={{ gridArea: 'type' }}>Type</Text.BodySmall>
          <Text.BodySmall css={{ gridArea: 'provider' }}>Provider</Text.BodySmall>
          <Text.BodySmall css={{ gridArea: 'unbonding-period' }}>Unbonding period</Text.BodySmall>
          <Text.BodySmall css={{ gridArea: 'available-balance' }}>Available balance</Text.BodySmall>
          <Text.BodySmall css={{ gridArea: 'stake-percentage', textAlign: 'end' }}>Staked (%)</Text.BodySmall>
        </Grid>
      </header>
    </div>
    <div css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>{props.children}</div>
  </section>
)

export default StakeProvider
