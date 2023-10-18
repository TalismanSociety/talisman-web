import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'
import 'react-loading-skeleton/dist/skeleton.css'

import './index.css'

import { BalancesWatcher } from '@domains/balances'
import { ExtensionWatcher } from '@domains/extension'
import { balanceModules } from '@talismn/balances-default-modules'
import { BalancesProvider } from '@talismn/balances-react'
import { EyeOfSauronProgressIndicator } from '@talismn/ui'
import { ToastBar } from '@talismn/ui'
import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { RecoilRelayEnvironmentProvider } from 'recoil-relay'

import ThemeProvider from './App.Theme'
import RelayEnvironment, { chainDataSquidEnvKey } from './graphql/relay-environment'
import router from './routes'
import { supportedChains } from '@domains/chains'
import { AccountWatcher } from '@domains/auth'
import { AddressBookWatcher, TeamsWatcher } from '@domains/offchain-data'

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
      <EyeOfSauronProgressIndicator />
    </div>
  )
}

const App: React.FC = () => (
  <ThemeProvider>
    <RecoilRoot>
      <RecoilRelayEnvironmentProvider environment={RelayEnvironment} environmentKey={chainDataSquidEnvKey}>
        <BalancesProvider
          balanceModules={balanceModules}
          withTestnets
          enabledChains={supportedChains.map(chain => chain.genesisHash)}
        >
          <Suspense fallback={<Loader />}>
            <BalancesWatcher />
            <ExtensionWatcher />
            <AccountWatcher />
            <TeamsWatcher />
            <AddressBookWatcher />
            <RouterProvider router={router} />
            <Toaster position="top-right" containerStyle={{ top: '6.4rem' }}>
              {t => <ToastBar toast={t} />}
            </Toaster>
          </Suspense>
        </BalancesProvider>
      </RecoilRelayEnvironmentProvider>
    </RecoilRoot>
  </ThemeProvider>
)

export default App
