import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '@domains/chains/recoils'
import { accountsState } from '@domains/extension/recoils'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useRecoilValueLoadable, waitForAll } from 'recoil'

import Layout from '../layout'
import Buy from './Buy'
import Explore from './Explore'
import Home from './Home'
import NFTsPage from './NFTsPage'
import Staking, { recommendedPoolsState } from './Staking'
import Wallet from './Wallet'

const Routes = () => {
  // Pre-loading
  useRecoilValueLoadable(
    waitForAll([apiState, accountsState, nativeTokenDecimalState, nativeTokenPriceState('usd'), recommendedPoolsState])
  )

  return (
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
      <Route exact path="/explore">
        <Layout>
          <Explore />
        </Layout>
      </Route>
      <Route path="/staking">
        <Layout>
          <Staking />
        </Layout>
      </Route>
      <Route
        path="/spiritkeys"
        component={() => {
          window.location.replace('https://talisman.xyz/download')
          return null
        }}
      />
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
}

export default Routes
