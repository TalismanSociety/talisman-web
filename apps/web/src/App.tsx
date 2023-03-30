import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'

import CookieBanner from '@archetypes/CookieBanner'
import Development from '@archetypes/Development'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { LegacyBalancesWatcher } from '@domains/balances/recoils'
import { chainRpcState } from '@domains/chains/recoils'
import { SUBSTRATE_API_STATE_GARBAGE_COLLECTOR_UNSTABLE, SubstrateApiContext } from '@domains/common'
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
  <SubstrateApiContext.Provider value={{ endpoint: useRecoilValue(chainRpcState) }}>
    {props.children}
  </SubstrateApiContext.Provider>
)

const App = () => (
  <ThemeProvider>
    <ErrorBoundary>
      <RecoilRoot>
        <SUBSTRATE_API_STATE_GARBAGE_COLLECTOR_UNSTABLE />
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
      </RecoilRoot>
    </ErrorBoundary>
  </ThemeProvider>
)

export default App
