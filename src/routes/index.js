import { Redirect, Route, Switch } from 'react-router-dom'

import Layout from '../layout'
import Buy from './Buy'
import CrowdloanDetail from './Crowdloan.Detail.tsx'
import CrowdloanIndex from './Crowdloan.Index.tsx'
import Home from './Home'
import NFTsPage from './NFTsPage'
import SpiritKeysPage from './SpiritKeysPageV2'
import Wallet from './Wallet'

const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route exact path="/portfolio">
      <Layout>
        <Wallet />
      </Layout>
    </Route>
    <Route exact path="/nfts">
      <Layout>
        <NFTsPage />
      </Layout>
    </Route>
    <Route exact path="/crowdloans">
      <Layout>
        <CrowdloanIndex />
      </Layout>
    </Route>
    <Route exact path="/spiritkeys">
      <Layout>
        <SpiritKeysPage />
      </Layout>
    </Route>
    <Route exact path="/crowdloans/:slug">
      <Layout>
        <CrowdloanDetail />
      </Layout>
    </Route>
    <Route exact path="/buy">
      <Layout>
        <Buy />
      </Layout>
    </Route>
    <Route path="*">
      <Redirect to="/" />
    </Route>
  </Switch>
)

export default Routes
