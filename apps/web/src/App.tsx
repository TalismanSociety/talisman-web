import DevMenu from '@archetypes/DevMenu'
import { ModalProvider } from '@components'
import ToastBar from '@components/molecules/ToastBar'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import { AccountsWatcher } from '@domains/accounts/recoils'
import * as Crowdloans from '@libs/crowdloans'
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
          <Crowdloans.Provider>
            <MoonbeamContributors.Provider>
              <ThemeProvider>
                <DevMenu />
                <Suspense fallback={<Loader />}>
                  <ModalProvider>
                    <MoonbeamContributors.PopupProvider>
                      <RouterProvider router={router} />
                    </MoonbeamContributors.PopupProvider>
                  </ModalProvider>
                  <Toaster position="top-right" containerStyle={{ top: '6.4rem' }}>
                    {t => <ToastBar toast={t} />}
                  </Toaster>
                </Suspense>
              </ThemeProvider>
            </MoonbeamContributors.Provider>
          </Crowdloans.Provider>
        </TalismanProvider>
      </Tokenprices.Provider>
    </Portfolio.Provider>
  </RecoilRoot>
)

export default App
