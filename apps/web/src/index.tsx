import './index.css'
import './libs/i18n/i18n'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom'

import App from './App'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],
  tracesSampleRate: 0.5,
})

const ProfiledApp = Sentry.withProfiler(App)

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <ProfiledApp />
  </React.StrictMode>
)
