import { init, reactRouterV6Instrumentation } from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { useEffect } from 'react'
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom'
import { HarmlessError } from './errors'

export const initSentry = () =>
  init({
    dsn: import.meta.env.REACT_APP_SENTRY_DSN,
    release: import.meta.env.REACT_APP_SENTRY_RELEASE,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
    ],
    tracesSampleRate: 0.5,
    beforeSend: (event, hint) => {
      if (hint.originalException instanceof HarmlessError) {
        return null
      }

      return event
    },
    ignoreErrors: [
      /(disconnected from wss)[(]?:\/\/[\w./:-]+: \d+:: Normal Closure[)]?/,
      /^disconnected from .+: [0-9]+:: .+$/,
      /^unsubscribed from .+: [0-9]+:: .+$/,
      /(Could not establish connection. Receiving end does not exist.)/,
    ],
  })
