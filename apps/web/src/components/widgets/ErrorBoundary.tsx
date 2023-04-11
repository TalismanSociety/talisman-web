import { useTheme } from '@emotion/react'
import * as Sentry from '@sentry/react'
import { Text } from '@talismn/ui'
import { PropsWithChildren, useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export const ErrorElement = ({ error, componentStack }: { error: unknown; componentStack?: string }) => {
  const theme = useTheme()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
    ? error.message
    : JSON.stringify(error)
  const stack = error instanceof Error ? error.stack : undefined

  return (
    <>
      <Text.H2>Unexpected Application Error!</Text.H2>
      <Text.H3 css={{ fontStyle: 'italic' }}>{message}</Text.H3>
      {stack && (
        <pre css={{ margin: '0.5rem 0', padding: '0.5rem', backgroundColor: theme.color.foreground }}>
          <code>{stack}</code>
        </pre>
      )}
      {componentStack && (
        <pre css={{ margin: '0.5rem 0', padding: '0.5rem', backgroundColor: theme.color.foreground }}>
          <code>{componentStack}</code>
        </pre>
      )}
    </>
  )
}

export const RouteErrorElement = () => {
  const error = useRouteError()

  useEffect(() => {
    const eventId = Sentry.captureException(error)
    Sentry.showReportDialog({ eventId })
  }, [error])

  return <ErrorElement error={error} />
}

const ErrorBoundary = (props: PropsWithChildren) => (
  <Sentry.ErrorBoundary
    fallback={({ error, componentStack }) => (
      <ErrorElement error={error} componentStack={componentStack ?? undefined} />
    )}
    showDialog
    {...props}
  />
)

export default ErrorBoundary
