import { accountsState } from '@domains/accounts/recoils'
import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '@domains/chains/recoils'
import { recommendedPoolsState } from '@domains/nominationPools/recoils'
import posthog from 'posthog-js'
import { useEffect } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import { useRecoilValueLoadable, waitForAll } from 'recoil'

import Layout from '../layout'
import Buy from './Buy'
import Explore from './Explore'
import Home from './Home'
import NFTsPage from './NFTsPage'
import Staking from './Staking'
import TransactionHistory from './TransactionHistory'
import Wallet from './Wallet'

const Routes = () => {
  // Pre-loading
  useRecoilValueLoadable(
    waitForAll([apiState, accountsState, nativeTokenDecimalState, nativeTokenPriceState('usd'), recommendedPoolsState])
  )

  const location = useLocation()

  useEffect(() => {
    if (location.hash !== '') {
      const observer = new MutationObserver(() => {
        const element = document.getElementById(location.hash.slice(1))

        if (element !== null) {
          element.scrollIntoView({ behavior: 'smooth' })
          observer.disconnect()
        }
      })

      observer.observe(document.body, { childList: true, subtree: true })

      return observer.disconnect.bind(observer)
    }
  }, [location])

  useEffect(() => {
    posthog.capture('$pageview')
  }, [location.pathname])

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
      <Route exact path="/history">
        <Layout>
          <TransactionHistory />
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
}

export default Routes
