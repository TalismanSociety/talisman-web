import { Redirect, Route, Switch } from 'react-router-dom'

import Buy from './Buy'
import CrowdloanDetail from './Crowdloan.Detail.tsx'
import CrowdloanIndex from './Crowdloan.Index.tsx'
import Home from './Home'
import Wallet from './Wallet'
import SpiritKeys from './SpiritKeysPage'

const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route exact path="/portfolio">
      <Wallet />
    </Route>
    <Route exact path="/crowdloans">
      <CrowdloanIndex />
    </Route>
    <Route exact path="/spiritkeys">
      <SpiritKeys />
    </Route>
    <Route exact path="/crowdloans/:slug">
      <CrowdloanDetail />
    </Route>
    <Route exact path="/buy">
      <Buy />
    </Route>
    <Route path="*">
      <Redirect to="/" />
    </Route>
  </Switch>
)

export default Routes
