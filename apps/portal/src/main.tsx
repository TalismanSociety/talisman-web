import * as Sentry from '@sentry/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App'
import { initSentry } from '@/domains/common/sentry'

import '@/libs/i18n/i18n'

initSentry()

const ProfiledApp = Sentry.withProfiler(App)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProfiledApp />
  </StrictMode>
)
