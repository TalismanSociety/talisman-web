import ErrorMessage, { ErrorMessageProps } from '@components/recipes/ErrorMessage'
import * as Sentry from '@sentry/react'
import { Button } from '@talismn/ui'
import { PropsWithChildren, ReactElement, ReactNode, createContext, useContext, useState } from 'react'
import { useRouteError } from 'react-router-dom'
import { atom, useRecoilValue } from 'recoil'

const OrientationContext = createContext<ErrorMessageProps['orientation']>(undefined)

type ErrorElementProps = {
  error: Error
  componentStack?: string | null
  resetError?: () => void
}

const ErrorElement = (props: ErrorElementProps) => {
  const message =
    `${props.error.name}\n\n${props.error.message}` +
    (props.error.cause ? `\n\n${props.error.cause}` : '') +
    (props.error.stack ? `\n\n${props.error.stack}` : '') +
    (props.componentStack ? `\n\n${props.componentStack}` : '')

  return (
    <ErrorMessage
      orientation={useContext(OrientationContext)}
      title="Oops!"
      message="Sorry, an error occurred in Talisman."
      actions={
        <ErrorMessage.Actions>
          {props.error !== undefined && <Button onClick={() => alert(message)}>Show error</Button>}
          {props.resetError !== undefined && <Button onClick={props.resetError}>Retry</Button>}
        </ErrorMessage.Actions>
      }
    />
  )
}

export const RouteErrorElement = () => {
  const error = useRouteError()

  // let the root error boundary handle it instead
  // https://github.com/remix-run/react-router/discussions/10494
  if (error) {
    throw error
  }

  return null
}

export const debugErrorBoundaryState = atom({
  key: 'DebugErrorBoundary',
  default: false,
})

const ErrorBoundaryDebuggerChildren = (props: PropsWithChildren<{ error?: Error; onTriggerError: () => void }>) => {
  if (props.error !== undefined) {
    throw props.error
  }

  return (
    <div
      css={{ border: '1px dotted red' }}
      onContextMenu={event => {
        event.preventDefault()
        event.stopPropagation()
        props.onTriggerError()
      }}
    >
      {props.children}
    </div>
  )
}

const ErrorBoundaryDebugger = ({ children, ...props }: Sentry.ErrorBoundaryProps) => {
  const [error, setError] = useState<Error>()

  return (
    <Sentry.ErrorBoundary onReset={() => setError(undefined)} {...props}>
      <ErrorBoundaryDebuggerChildren error={error} onTriggerError={() => setError(new Error('This is a mock error'))}>
        {typeof children === 'function' ? children() : children}
      </ErrorBoundaryDebuggerChildren>
    </Sentry.ErrorBoundary>
  )
}

type ErrorBoundaryProps = Sentry.ErrorBoundaryProps &
  Pick<ErrorMessageProps, 'orientation'> & {
    renderFallback?: (fallback: ReactNode) => ReactElement
  }

const ErrorBoundary = ({ orientation, renderFallback, ...props }: ErrorBoundaryProps) => {
  const fallback = (errorProps: ErrorElementProps) =>
    renderFallback?.(<ErrorElement {...errorProps} />) ?? <ErrorElement {...errorProps} />

  return (
    <OrientationContext.Provider value={orientation}>
      {useRecoilValue(debugErrorBoundaryState) ? (
        <ErrorBoundaryDebugger fallback={fallback} {...props} />
      ) : (
        <Sentry.ErrorBoundary fallback={fallback} onReset={() => {}} {...props} />
      )}
    </OrientationContext.Provider>
  )
}

export default ErrorBoundary
