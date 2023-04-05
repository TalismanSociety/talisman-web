import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'

import CookieBanner from '@archetypes/CookieBanner'
import Development from '@archetypes/Development'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { LegacyBalancesWatcher } from '@domains/balances/recoils'
import { SUBSTRATE_API_STATE_GARBAGE_COLLECTOR_UNSTABLE } from '@domains/common'
import { ExtensionWatcher } from '@domains/extension/recoils'
import NftProvider from '@libs/@talisman-nft/provider'
import * as MoonbeamContributors from '@libs/moonbeam-contributors'
import * as Portfolio from '@libs/portfolio'
import TalismanProvider from '@libs/talisman'
import router from '@routes'
import { PropsWithChildren, Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import { ChainProvider, chains } from '@domains/chains'
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
const LegacyChainProvider = (props: PropsWithChildren) => (
  <ChainProvider value={chains[0]}>{props.children}</ChainProvider>
)

const App = () => (
  <ThemeProvider>
    <ErrorBoundary>
      <RecoilRoot>
        <SUBSTRATE_API_STATE_GARBAGE_COLLECTOR_UNSTABLE />
        <Suspense fallback={<Loader />}>
          <LegacyChainProvider>
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
          </LegacyChainProvider>
        </Suspense>
      </RecoilRoot>
    </ErrorBoundary>
  </ThemeProvider>
)

export default App
