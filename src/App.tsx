import { ModalProvider } from '@components'
import { ReactComponent as Loader } from '@icons/loader.svg'
import * as Crowdloans from '@libs/crowdloans'
import * as Portfolio from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import * as Tokenprices from '@libs/tokenprices'
import Routes from '@routes'
import { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import ThemeProvider from './App.Theme'
import Layout from './layout'

const LoadingLayout = () => {
  return <Loader />
}

const App: React.FC = () => (
  <Suspense fallback={<LoadingLayout />}>
    <Portfolio.Provider>
      <Tokenprices.Provider>
        <TalismanProvider>
          <Crowdloans.Provider uri="https://api.subquery.network/sq/TalismanSociety/kusama-crowdloans">
            <Router>
              <ThemeProvider>
                <ModalProvider>
                  <Layout>
                    <Routes />
                  </Layout>
                </ModalProvider>
              </ThemeProvider>
            </Router>
          </Crowdloans.Provider>
        </TalismanProvider>
      </Tokenprices.Provider>
    </Portfolio.Provider>
  </Suspense>
)

export default App
