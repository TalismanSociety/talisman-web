import { Redirect, Route, Switch } from 'react-router-dom'

import Buy from './Buy'
import Connect from './Connect'
import CrowdloanDetail from './Crowdloan.Detail.tsx'
import CrowdloanIndex from './Crowdloan.Index.tsx'
import Home from './Home'
import SpiritKeys from './SpiritKeysPage'
import Wallet from './Wallet'

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
    <Route exact path="/connect">
      <Connect />
    </Route>
    <Route path="*">
      <Redirect to="/" />
    </Route>
  </Switch>
)

export default Routes
