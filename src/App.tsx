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
import Routes from '@routes'
import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import ThemeProvider from './App.Theme'
import { initPosthog } from './config/posthog'

initPosthog()

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
              <Router>
                <ThemeProvider>
                  <DevMenu />
                  <Suspense fallback={<Loader />}>
                    <ModalProvider>
                      <MoonbeamContributors.PopupProvider>
                        <Routes />
                      </MoonbeamContributors.PopupProvider>
                    </ModalProvider>
                    <Toaster position="top-right" containerStyle={{ top: '6rem' }}>
                      {t => <ToastBar toast={t} />}
                    </Toaster>
                  </Suspense>
                </ThemeProvider>
              </Router>
            </MoonbeamContributors.Provider>
          </Crowdloans.Provider>
        </TalismanProvider>
      </Tokenprices.Provider>
    </Portfolio.Provider>
  </RecoilRoot>
)

export default App
