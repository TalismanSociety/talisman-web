import ErrorMessage from '../../recipes/ErrorMessage'
import StakeProvider from '../../recipes/StakeProvider'
import { Surface, Text, SurfaceIconButton } from '@talismn/ui'
import { MoreHorizontal } from '@talismn/web-icons'

type ErrorBoundaryFallbackProps = {
  symbol: string
  logo: string
  provider: string
  list?: 'stakes' | 'positions'
}

export default function ErrorBoundaryFallback({ symbol, logo, provider, list }: ErrorBoundaryFallbackProps) {
  const isPositions = list === 'positions'
  return (
    <div css={{ containerType: 'inline-size', position: 'relative' }}>
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
          borderRadius: isPositions ? '1.6rem' : '0.8rem',
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
      <Surface
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: isPositions ? '1.6rem' : '0.8rem',
          padding: '1.6rem',
        }}
      >
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: isPositions ? '1.6rem' : '0.6rem',
          }}
        >
          <img
            src={logo}
            css={{
              width: isPositions ? '4rem' : '2em',
              height: isPositions ? '4rem' : '2em',
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
        {isPositions ? (
          <SurfaceIconButton>
            <MoreHorizontal />
          </SurfaceIconButton>
        ) : (
          <StakeProvider.StakeButton />
        )}
      </Surface>
    </div>
  )
}
