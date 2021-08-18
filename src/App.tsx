import PortfolioProvider from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import TokenpricesProvider from '@libs/tokenprices'
import Routes from '@routes'
import { BrowserRouter as Router } from 'react-router-dom'

import ThemeProvider from './App.Theme'
import Layout from './layout'

const App: React.FC = () => (
  <PortfolioProvider>
    <TokenpricesProvider>
      <TalismanProvider>
        <Router>
          <ThemeProvider>
            <Layout>
              <Routes />
            </Layout>
          </ThemeProvider>
        </Router>
      </TalismanProvider>
    </TokenpricesProvider>
  </PortfolioProvider>
)

export default App
