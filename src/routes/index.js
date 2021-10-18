import { Redirect, Route, Switch } from 'react-router-dom'

import Buy from './Buy'
import CrowdloanDetail from './Crowdloan.Detail.tsx'
import CrowdloanIndex from './Crowdloan.Index.tsx'
import Wallet from './Wallet.tsx'

const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Wallet />
    </Route>
    <Route exact path="/crowdloans">
      <CrowdloanIndex />
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
