import { accountsState } from '@domains/accounts/recoils'
import { apiState, nativeTokenDecimalState, nativeTokenPriceState } from '@domains/chains/recoils'
import { recommendedPoolsState } from '@domains/nominationPools/recoils'
import posthog from 'posthog-js'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useRecoilValueLoadable, waitForAll } from 'recoil'

import Layout from '../layout'
import Buy from './Buy'
import Explore from './Explore'
import NFTsPage from './NFTsPage'
import Staking from './Staking'
import TransactionHistory from './TransactionHistory'
import Wallet from './Wallet'

const Main = () => {
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
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="portfolio" />} />
        <Route path="portfolio" element={<Wallet />} />
        <Route path="nfts" element={<NFTsPage />} />
        <Route path="explore" element={<Explore />} />
        <Route path="staking" element={<Staking />} />
        <Route path="history" element={<TransactionHistory />} />
        <Route path="buy" element={<Buy />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}

const Router = () => (
  <BrowserRouter>
    <Main />
  </BrowserRouter>
)

export default Router
