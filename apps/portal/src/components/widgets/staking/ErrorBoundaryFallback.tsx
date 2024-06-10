import ErrorMessage from '../../recipes/ErrorMessage'
import StakeProvider from '../../recipes/StakeProvider'
import { Surface, Text } from '@talismn/ui'

type ErrorBoundaryFallbackProps = {
  symbol: string
  logo: string
  provider: string
}

export default function ErrorBoundaryFallback({ symbol, logo, provider }: ErrorBoundaryFallbackProps) {
  return (
    <div css={{ containerType: 'inline-size' }}>
      <Surface
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '0.8rem',
          padding: '1.6rem',
          position: 'relative',
        }}
      >
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <div
            css={{
              padding: '1.6rem',
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(2px)',
            }}
          >
            <div
              css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.6rem',
                height: '100%',
              }}
            >
              <ErrorMessage
                orientation="horizontal"
                title="Oops!"
                message={<span> {`Error loading ${provider} staking provider data for ${symbol} token.`}</span>}
              />
            </div>
          </div>
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
        <StakeProvider.StakeButton />
      </Surface>
    </div>
  )
}
