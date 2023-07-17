import { initSentry } from '@domains/common/sentry'
import * as Sentry from '@sentry/react'
import { PostHogProvider } from 'posthog-js/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './libs/i18n/i18n'

initSentry()

const ProfiledApp = Sentry.withProfiler(App)

const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <PostHogProvider apiKey={import.meta.env.REACT_APP_POSTHOG_AUTH_TOKEN} options={{ debug: import.meta.env.DEV }}>
      <ProfiledApp />
    </PostHogProvider>
  </React.StrictMode>
)
