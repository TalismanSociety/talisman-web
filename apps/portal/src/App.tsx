import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'
import '@talismn/astar-types/augment-api'
import '@talismn/astar-types/types-lookup'

import { PolkadotApiProvider } from '@talismn/react-polkadot-api'
import { PostHogProvider } from 'posthog-js/react'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import ThemeProvider from '@/App.Theme'
import FairyBreadBanner from '@/components/legacy/archetypes/FairyBreadBanner'
import { TalismanHandLoader } from '@/components/legacy/TalismanHandLoader'
import Development from '@/components/widgets/development'
import ErrorBoundary from '@/components/widgets/ErrorBoundary'
import { AccountWatcher, SignetWatcher } from '@/domains/accounts'
import { BalancesWatcher } from '@/domains/balances'
import { chainDeriveState, chainQueryMultiState, chainQueryState } from '@/domains/common'
import { ExtensionWatcher, TalismanExtensionSynchronizer } from '@/domains/extension'
import { EvmProvider } from '@/domains/extension/wagmi'
import * as Portfolio from '@/libs/portfolio'
import TalismanProvider from '@/libs/talisman'
import router from '@/routes'

const App = () => (
  <ThemeProvider>
    <RecoilRoot>
      <ErrorBoundary
        renderFallback={fallback => (
          <div className="flex h-[100dvh]">
            <div className="m-auto">{fallback}</div>
          </div>
        )}
      >
        <Suspense fallback={<FullscreenLoader />}>
          <PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_AUTH_TOKEN}>
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
                    <Suspense fallback={<FullscreenLoader />}>
                      <RouterProvider router={router} />
                    </Suspense>
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

const FullscreenLoader = () => (
  <div className="absolute left-0 right-0 flex h-full items-center justify-center">
    <TalismanHandLoader />
  </div>
)

export default App
