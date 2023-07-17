import { init, reactRouterV6Instrumentation } from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { useEffect } from 'react'
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom'
import { skipErrorReporting } from './consts'

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
      if (
        hint.originalException !== undefined &&
        hint.originalException !== null &&
        // @ts-expect-error
        skipErrorReporting in hint.originalException
      ) {
        return null
      }

      return event
    },
  })
