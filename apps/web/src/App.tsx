import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'

import CookieBanner from '@archetypes/CookieBanner'
import Development from '@archetypes/Development'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { LegacyBalancesWatcher } from '@domains/balances/recoils'
import { ExtensionWatcher } from '@domains/extension/recoils'
import NftProvider from '@libs/@talisman-nft/provider'
import * as MoonbeamContributors from '@libs/moonbeam-contributors'
import * as Portfolio from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import router from '@routes'
import { ToastBar } from '@talismn/ui'
import posthog from 'posthog-js'
import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import ThemeProvider from './App.Theme'

if (process.env.REACT_APP_POSTHOG_AUTH_TOKEN) {
  posthog.init(process.env.REACT_APP_POSTHOG_AUTH_TOKEN)
  // eslint-disable-next-line
  posthog.debug(process.env.NODE_ENV === 'development')
}

const Loader = () => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
      }}
    >
      <TalismanHandLoader />
    </div>
  )
}

const App: React.FC = () => (
  <ThemeProvider>
    <ErrorBoundary>
      <RecoilRoot>
        <Portfolio.Provider>
          <TalismanProvider>
            <ExtensionWatcher />
            <LegacyBalancesWatcher />
            <MoonbeamContributors.Provider>
              <Development />
              <Suspense fallback={<Loader />}>
                <NftProvider />
                <RouterProvider router={router} />
                <Toaster position="top-right">{t => <ToastBar toast={t} />}</Toaster>
                <CookieBanner />
              </Suspense>
            </MoonbeamContributors.Provider>
          </TalismanProvider>
        </Portfolio.Provider>
      </RecoilRoot>
    </ErrorBoundary>
  </ThemeProvider>
)

export default App
