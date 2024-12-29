import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'
import '@talismn/astar-types/augment-api'
import '@talismn/astar-types/types-lookup'

import { BalancesProvider } from '@talismn/balances-react'
import { PolkadotApiProvider } from '@talismn/react-polkadot-api'
import { Toaster } from '@talismn/ui/molecules/Toaster'
import { PostHogProvider } from 'posthog-js/react'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import ThemeProvider from '@/App.Theme'
import { FairyBreadBanner } from '@/components/legacy/widgets/FairyBreadBanner'
import { FullscreenLoader } from '@/components/molecules/FullscreenLoader'
import { Development } from '@/components/widgets/development/Development'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { AccountWatcher, SignetWatcher } from '@/domains/accounts/recoils'
import { BalancesWatcher } from '@/domains/balances/BalancesWatcher'
import { chainDeriveState, chainQueryMultiState, chainQueryState } from '@/domains/common/recoils/query'
import { ExtensionWatcher } from '@/domains/extension/main'
import { TalismanExtensionSynchronizer } from '@/domains/extension/TalismanExtensionSynchronizer'
import { EvmProvider } from '@/domains/extension/wagmi'
import router from '@/routes'
import { JotaiProvider } from '@/util/jotaiStore'

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
          <JotaiProvider>
            <PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_AUTH_TOKEN}>
              <EvmProvider>
                <PolkadotApiProvider
                  queryState={chainQueryState}
                  deriveState={chainDeriveState}
                  queryMultiState={chainQueryMultiState}
                >
                  <BalancesProvider
                    onfinalityApiKey={import.meta.env.VITE_ONFINALITY_API_KEY ?? undefined}
                    coingeckoApiUrl={import.meta.env.VITE_COIN_GECKO_API}
                    coingeckoApiKeyValue={import.meta.env.VITE_COIN_GECKO_API_KEY}
                    coingeckoApiKeyName={
                      import.meta.env.VITE_COIN_GECKO_API_TIER === 'pro'
                        ? 'x-cg-pro-api-key'
                        : import.meta.env.VITE_COIN_GECKO_API_TIER === 'demo'
                        ? 'x-cg-demo-api-key'
                        : undefined
                    }
                  >
                    <ExtensionWatcher />
                    <AccountWatcher />
                    <SignetWatcher />
                    <TalismanExtensionSynchronizer />
                    <BalancesWatcher />
                    <Suspense fallback={<FullscreenLoader />}>
                      <RouterProvider router={router} />
                      <Toaster position="bottom-right" />
                    </Suspense>
                    <FairyBreadBanner />
                    <Development />
                  </BalancesProvider>
                </PolkadotApiProvider>
              </EvmProvider>
            </PostHogProvider>
          </JotaiProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  </ThemeProvider>
)

export default App
