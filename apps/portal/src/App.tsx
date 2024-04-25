import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'
import '@talismn/astar-types/augment-api'
import '@talismn/astar-types/types-lookup'

import FairyBreadBanner from '@archetypes/FairyBreadBanner'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import Development from '@components/widgets/development'
import { AccountWatcher, SignetWatcher } from '@domains/accounts'
import { BalancesWatcher } from '@domains/balances'
import { chainDeriveState, chainQueryMultiState, chainQueryState } from '@domains/common/recoils/query'
import { ExtensionWatcher, TalismanExtensionSynchronizer } from '@domains/extension'
import { EvmProvider } from '@domains/extension/wagmi'
import * as Portfolio from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import router from '@routes'
import { PolkadotApiProvider } from '@talismn/react-polkadot-api'
import { PostHogProvider } from 'posthog-js/react'
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
        <Suspense fallback={<Loader />}>
          <PostHogProvider apiKey={import.meta.env.REACT_APP_POSTHOG_AUTH_TOKEN}>
            <EvmProvider>
              <PolkadotApiProvider
                queryState={chainQueryState}
                deriveState={chainDeriveState}
                queryMultiState={chainQueryMultiState}
              >
                <Portfolio.Provider>
                  <TalismanProvider>
                    <ExtensionWatcher />
                    <AccountWatcher />
                    <SignetWatcher />
                    <TalismanExtensionSynchronizer />
                    <BalancesWatcher />
                    <RouterProvider router={router} />
                    <FairyBreadBanner />
                    <Development />
                  </TalismanProvider>
                </Portfolio.Provider>
              </PolkadotApiProvider>
            </EvmProvider>
          </PostHogProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  </ThemeProvider>
)

export default App
