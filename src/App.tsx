import { ModalProvider } from '@components'
import * as Crowdloans from '@libs/crowdloans'
import * as MoonbeamContributors from '@libs/moonbeam-contributors'
import * as Portfolio from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import * as Tokenprices from '@libs/tokenprices'
import Routes from '@routes'
import { BrowserRouter as Router } from 'react-router-dom'

import ThemeProvider from './App.Theme'

const App: React.FC = () => (
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
)

export default App
