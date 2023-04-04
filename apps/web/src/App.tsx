import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'

import CookieBanner from '@archetypes/CookieBanner'
import Development from '@archetypes/Development'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { LegacyBalancesWatcher } from '@domains/balances/recoils'
import { chainRpcState } from '@domains/chains/recoils'
import { chainQueryMultiState, chainStorageState } from '@domains/common'
import { ExtensionWatcher } from '@domains/extension/recoils'
import NftProvider from '@libs/@talisman-nft/provider'
import * as MoonbeamContributors from '@libs/moonbeam-contributors'
import * as Portfolio from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import router from '@routes'
import { ToastBar } from '@talismn/ui'
import { PropsWithChildren, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot, useRecoilValue } from 'recoil'

import { PolkadotApiEndpointContext, PolkadotApiRecoilProvider } from '@talismn/polkadot-api-react'
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

// TODO: this is for backward compatibility only, will be remove
// after multi chain support
const LegacyApiProvider = (props: PropsWithChildren) => (
  <PolkadotApiEndpointContext.Provider value={useRecoilValue(chainRpcState)}>
    {props.children}
  </PolkadotApiEndpointContext.Provider>
)

const App = () => (
  <ThemeProvider>
    <ErrorBoundary>
      <RecoilRoot>
        <PolkadotApiRecoilProvider value={{ chainStorageState, chainQueryMultiState }}>
          <Suspense fallback={<Loader />}>
            <LegacyApiProvider>
              <Portfolio.Provider>
                <TalismanProvider>
                  <ExtensionWatcher />
                  <LegacyBalancesWatcher />
                  <MoonbeamContributors.Provider>
                    <Development />
                    <NftProvider />
                    <RouterProvider router={router} />
                    <Toaster position="top-right">{t => <ToastBar toast={t} />}</Toaster>
                    <CookieBanner />
                  </MoonbeamContributors.Provider>
                </TalismanProvider>
              </Portfolio.Provider>
            </LegacyApiProvider>
          </Suspense>
        </PolkadotApiRecoilProvider>
      </RecoilRoot>
    </ErrorBoundary>
  </ThemeProvider>
)

export default App
