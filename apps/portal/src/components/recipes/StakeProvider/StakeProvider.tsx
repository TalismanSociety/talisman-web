import AssetLogoWithChain from '../AssetLogoWithChain'
import {
  Button,
  LinearProgressIndicator,
  Surface,
  Text,
  type ButtonProps,
  CircularProgressIndicator,
} from '@talismn/ui'
import { Zap } from '@talismn/web-icons'
import { Suspense, type ElementType, type PropsWithChildren, type ReactNode } from 'react'

export type StakeProviderProps = {
  logo: string
  symbol: ReactNode
  chain: string
  chainId?: string | number
  apr: ReactNode
  type: ReactNode
  provider: ReactNode
  unbondingPeriod: ReactNode
  availableBalance: ReactNode
  availableFiatBalance: ReactNode
  stakePercentage: ReactNode
  stakeButton: ReactNode
  networkLogo?: string
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
    <LinearProgressIndicator value={props.loading ? 0 : props.percentage} least={0.25} optimum={0.5} />
  </>
)

const Grid = (props: PropsWithChildren<{ className?: string }>) => (
  <Surface
    as="article"
    css={{
      borderRadius: '1.6rem',
      padding: '1.6rem',
      display: 'grid',
      gridTemplateAreas: `
        'asset   action'
        'divider divider'
        'apr     type'
      `,
      gridTemplateColumns: `repeat(2, minmax(0, 1fr))`,
      gap: '0.6rem',
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
          <div
            css={{
              gridArea: 'asset',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
            }}
          >
            <AssetLogoWithChain assetLogoUrl={props.logo} chainId={props.chainId ?? ''} />
            <div className="truncate">
              <Text.Body as="div" alpha="high">
                {props.symbol}
              </Text.Body>
              <Text.BodySmall as="div">{props.chain}</Text.BodySmall>
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
          <div css={{ gridArea: 'provider', display: 'none', '@container (min-width: 100rem)': { display: 'revert' } }}>
            <Text.BodySmall as="div" css={{ '@container (min-width: 100rem)': { display: 'none' } }}>
              Provider
            </Text.BodySmall>
            <Text.Body as="div" alpha="high">
              {props.provider}
            </Text.Body>
          </div>
          <div
            css={{
              gridArea: 'unbonding-period',
              display: 'none',
              '@container (min-width: 100rem)': { display: 'revert' },
            }}
          >
            <Text.BodySmall as="div" css={{ '@container (min-width: 100rem)': { display: 'none' } }}>
              Unbonding period
            </Text.BodySmall>
            <Text.Body as="div" alpha="high">
              <Suspense fallback={<CircularProgressIndicator size="1em" />}>{props.unbondingPeriod}</Suspense>
            </Text.Body>
          </div>
          <div
            css={{
              gridArea: 'available-balance',
              display: 'none',
              '@container (min-width: 100rem)': { display: 'revert' },
            }}
          >
            <Text.Body as="div" alpha="high">
              <Suspense fallback={<CircularProgressIndicator size="1em" />}>{props.availableBalance}</Suspense>
            </Text.Body>
            <Text.BodySmall as="div" css={{ display: 'none', '@container (min-width: 100rem)': { display: 'revert' } }}>
              <Suspense>{props.availableFiatBalance}</Suspense>
            </Text.BodySmall>
          </div>
          <div
            css={{
              gridArea: 'stake-percentage',
              display: 'none',
              '@container (min-width: 100rem)': { display: 'revert' },
            }}
          >
            <Suspense fallback={<StakeProvider.StakePercentage loading />}>{props.stakePercentage}</Suspense>
          </div>
          <Surface
            css={{
              gridArea: 'divider',
              height: 1,
              '@container (min-width: 100rem)': { display: 'none' },
            }}
          />
          <div css={{ gridArea: 'apr' }}>
            <Text.BodySmall as="div" css={{ '@container (min-width: 100rem)': { display: 'none' } }}>
              Est. return
            </Text.BodySmall>
            <Text.Body as="div" alpha="high">
              <Suspense fallback={<CircularProgressIndicator size="1em" />}>{props.apr}</Suspense>
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
          display: 'none',
          marginBottom: '1.2rem',
          '@container (min-width: 100rem)': { display: 'revert' },
        }}
      >
        <Grid css={{ backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0 }}>
          <Text.BodySmall css={{ gridArea: 'asset' }}>Asset</Text.BodySmall>
          <Text.BodySmall css={{ gridArea: 'apr' }}>Est. return</Text.BodySmall>
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
