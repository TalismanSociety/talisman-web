import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'

import FairyBreadBanner from '@archetypes/FairyBreadBanner'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import Development from '@components/widgets/development'
import { LegacyBalancesWatcher } from '@domains/balances'
import { ExtensionWatcher } from '@domains/extension/recoils'
import * as Portfolio from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import router from '@routes'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import ThemeProvider from './App.Theme'
import { PolkadotApiProvider } from '@talismn/react-polkadot-api'
import { chainDeriveState, chainQueryMultiState, chainQueryState } from '@domains/common/recoils/query'
import { TalismanExtensionSynchronizer } from '@domains/extension'

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
        <Suspense fallback={<Loader />}>
          <PolkadotApiProvider
            queryState={chainQueryState}
            deriveState={chainDeriveState}
            queryMultiState={chainQueryMultiState}
          >
            <Portfolio.Provider>
              <TalismanProvider>
                <ExtensionWatcher />
                <TalismanExtensionSynchronizer />
                <LegacyBalancesWatcher />
                <Development />
                <RouterProvider router={router} />
                <FairyBreadBanner />
              </TalismanProvider>
            </Portfolio.Provider>
          </PolkadotApiProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  </ThemeProvider>
)

export default App
