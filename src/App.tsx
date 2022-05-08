import { ModalProvider } from '@components'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import * as Crowdloans from '@libs/crowdloans'
import * as MoonbeamContributors from '@libs/moonbeam-contributors'
import * as Portfolio from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import * as Tokenprices from '@libs/tokenprices'
import Routes from '@routes'
import { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import ThemeProvider from './App.Theme'

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
  <Suspense fallback={<Loader />}>
    <Portfolio.Provider>
      <Tokenprices.Provider>
        <TalismanProvider>
          <Crowdloans.Provider>
            <MoonbeamContributors.Provider>
              <Router>
                <ThemeProvider>
                  <ModalProvider>
                    <MoonbeamContributors.PopupProvider>
                      <Routes />
                    </MoonbeamContributors.PopupProvider>
                  </ModalProvider>
                </ThemeProvider>
              </Router>
            </MoonbeamContributors.Provider>
          </Crowdloans.Provider>
        </TalismanProvider>
      </Tokenprices.Provider>
    </Portfolio.Provider>
  </Suspense>
)

export default App
