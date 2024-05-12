import * as Sentry from '@sentry/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initSentry } from './domains/common/sentry'
import './index.css'
import './libs/i18n/i18n'

initSentry()

const ProfiledApp = Sentry.withProfiler(App)

const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <ProfiledApp />
  </React.StrictMode>
)
