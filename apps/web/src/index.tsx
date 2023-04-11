import './index.css'
import './libs/i18n/i18n'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { PostHogProvider } from 'posthog-js/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom'

import App from './App'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: process.env.REACT_APP_SENTRY_RELEASE,
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
    <PostHogProvider
      apiKey={process.env.REACT_APP_POSTHOG_AUTH_TOKEN}
      options={{ debug: process.env.NODE_ENV === 'development' }}
    >
      <ProfiledApp />
    </PostHogProvider>
  </React.StrictMode>
)
