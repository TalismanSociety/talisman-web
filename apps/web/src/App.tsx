import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'

import CookieBanner from '@archetypes/CookieBanner'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import Development from '@components/widgets/development'
import { LegacyBalancesWatcher } from '@domains/balances/recoils'
import { SUBSTRATE_API_STATE_GARBAGE_COLLECTOR_UNSTABLE } from '@domains/common'
import { ExtensionWatcher } from '@domains/extension/recoils'
import NftProvider from '@libs/@talisman-nft/provider'
import * as MoonbeamContributors from '@libs/moonbeam-contributors'
import * as Portfolio from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import router from '@routes'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import ThemeProvider from './App.Theme'

const Loader = () => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
      }}
    >
      <TalismanHandLoader />
    </div>
  )
}

const App = () => (
  <ThemeProvider>
    <RecoilRoot>
      <ErrorBoundary
        renderFallback={fallback => (
          <div css={{ height: '100dvh', display: 'flex' }}>
            <div css={{ margin: 'auto' }}>{fallback}</div>
          </div>
        )}
      >
        <SUBSTRATE_API_STATE_GARBAGE_COLLECTOR_UNSTABLE />
        <Suspense fallback={<Loader />}>
          <Portfolio.Provider>
            <TalismanProvider>
              <ExtensionWatcher />
              <LegacyBalancesWatcher />
              <MoonbeamContributors.Provider>
                <Development />
                <NftProvider />
                <RouterProvider router={router} />
                <CookieBanner />
              </MoonbeamContributors.Provider>
            </TalismanProvider>
          </Portfolio.Provider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  </ThemeProvider>
)

export default App
