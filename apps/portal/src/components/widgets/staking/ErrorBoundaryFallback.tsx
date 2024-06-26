import { StakeStatusIndicator } from '../../recipes/StakeStatusIndicator'
import { Surface, Text, Tooltip, TonalButton, useTheme } from '@talismn/ui'

type ErrorBoundaryFallbackProps = {
  symbol: string
  logo: string
  provider: string
  list?: 'stakes' | 'positions'
}

export default function ErrorBoundaryFallback({ symbol, logo, provider }: ErrorBoundaryFallbackProps) {
  const theme = useTheme()
  return (
    <div css={{ containerType: 'inline-size' }}>
      <Surface
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '0.8rem',
          padding: '1.6rem',
        }}
      >
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <img
            src={logo}
            css={{
              width: '2em',
              height: '2em',
              borderRadius: '50%',
            }}
          />
          <div>
            <Text.Body as="div" alpha="high">
              {symbol}
            </Text.Body>
            <Text.BodySmall as="div">{provider}</Text.BodySmall>
          </div>
        </div>

        <div css={{ marginLeft: 'auto' }}>
          <Tooltip content="Error loading staking provider data">
            <TonalButton
              leadingIcon={<StakeStatusIndicator status={'not_nominating'} />}
              css={{
                width: '100%',
                backgroundColor: `color-mix(in srgb, ${theme.color.error}, transparent 95%)`,
                color: theme.color.error,
              }}
            >
              Loading Error
            </TonalButton>
          </Tooltip>
        </div>
      </Surface>
    </div>
  )
}
