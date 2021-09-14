import { ModalProvider } from '@components'
import * as Portfolio from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import * as Tokenprices from '@libs/tokenprices'
import Routes from '@routes'
import { BrowserRouter as Router } from 'react-router-dom'

import ThemeProvider from './App.Theme'
import Layout from './layout'

const App: React.FC = () => (
  <Portfolio.Provider>
    <Tokenprices.Provider>
      <TalismanProvider>
        <Router>
          <ThemeProvider>
            <ModalProvider>
              <Layout>
                <Routes />
              </Layout>
            </ModalProvider>
          </ThemeProvider>
        </Router>
      </TalismanProvider>
    </Tokenprices.Provider>
  </Portfolio.Provider>
)

export default App
