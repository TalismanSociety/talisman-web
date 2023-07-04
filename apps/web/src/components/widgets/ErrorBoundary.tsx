import ErrorMessage, { type ErrorMessageProps } from '@components/recipes/ErrorMessage'
import * as Sentry from '@sentry/react'
import { Button } from '@talismn/ui'
import { type PropsWithChildren, type ReactElement, type ReactNode, createContext, useContext, useState } from 'react'
import { useRouteError } from 'react-router-dom'
import { atom, useRecoilCallback, useRecoilValue } from 'recoil'

const OrientationContext = createContext<ErrorMessageProps['orientation']>(undefined)

type ErrorElementProps = {
  error: Error
  componentStack: string | null
  eventId: string | null
  resetError: () => void
}

const ErrorElement = (props: ErrorElementProps) => {
  const message =
    `${props.error.name}\n\n${props.error.message}` +
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    (props.error.cause ? `\n\n${props.error.cause}` : '') +
    (props.error.stack ? `\n\n${props.error.stack}` : '') +
    (props.componentStack ? `\n\n${props.componentStack}` : '')

  return (
    <ErrorMessage
      orientation={useContext(OrientationContext)}
      title="Oops!"
      message={
        <span>
          Sorry, an error occurred in Talisman.
          {props.eventId ? (
            <>
              <br />
              {props.eventId}
            </>
          ) : (
            ''
          )}
        </span>
      }
      actions={
        <ErrorMessage.Actions>
          {props.error !== undefined && <Button onClick={() => alert(message)}>Show error</Button>}
          {props.resetError !== undefined && <Button onClick={props.resetError}>Refresh</Button>}
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
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
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
      css={{ 'display': 'contents', '> *': { outline: '1px dotted red' } }}
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
    <Sentry.ErrorBoundary
      {...props}
      onReset={(...args) => {
        props.onReset?.(...args)
        setError(undefined)
      }}
    >
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

  const resetError = useRecoilCallback(
    ({ snapshot, refresh }) =>
      (error: Error | null) => {
        for (const node of snapshot.getNodes_UNSTABLE({ isInitialized: true })) {
          const { loadable, type } = snapshot.getInfo_UNSTABLE(node)
          if (loadable?.state === 'hasError' && loadable.contents === error) {
            switch (type) {
              case 'atom':
                // As of now Recoil doesn't have the ability to refresh & rerun atom effect
                // https://github.com/facebookexperimental/Recoil/issues/1685
                // https://github.com/facebookexperimental/Recoil/issues/2183
                window.location.reload()
                break
              case 'selector':
                return refresh(node)
            }
          }
        }
      },
    []
  )

  return (
    <OrientationContext.Provider value={orientation}>
      {useRecoilValue(debugErrorBoundaryState) ? (
        <ErrorBoundaryDebugger {...props} fallback={fallback} onReset={resetError} />
      ) : (
        <Sentry.ErrorBoundary {...props} fallback={fallback} onReset={resetError} />
      )}
    </OrientationContext.Provider>
  )
}

export default ErrorBoundary
