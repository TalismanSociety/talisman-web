import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'

import CookieBanner from '@archetypes/CookieBanner'
import Development from '@archetypes/Development'
import ToastBar from '@components/molecules/ToastBar'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import { AccountsWatcher } from '@domains/accounts/recoils'
import NftProvider from '@libs/@talisman-nft/provider'
import * as MoonbeamContributors from '@libs/moonbeam-contributors'
import * as Portfolio from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import * as Tokenprices from '@libs/tokenprices'
import router from '@routes'
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
  <RecoilRoot>
    <Portfolio.Provider>
      <Tokenprices.Provider>
        <TalismanProvider>
          <AccountsWatcher />
          <MoonbeamContributors.Provider>
            <ThemeProvider>
              <Development />
              <Suspense fallback={<Loader />}>
                <NftProvider />
                <RouterProvider router={router} />
                <Toaster position="top-right" containerStyle={{ top: '6.4rem' }}>
                  {t => <ToastBar toast={t} />}
                </Toaster>
                <CookieBanner />
              </Suspense>
            </ThemeProvider>
          </MoonbeamContributors.Provider>
        </TalismanProvider>
      </Tokenprices.Provider>
    </Portfolio.Provider>
  </RecoilRoot>
)

export default App
