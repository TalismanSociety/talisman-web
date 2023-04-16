import '@polkadot/api-augment/polkadot'
import '@polkadot/api-augment/substrate'
import 'react-loading-skeleton/dist/skeleton.css'

import { EyeOfSauronProgressIndicator } from '@talismn/ui'
import { ToastBar } from '@talismn/ui'
import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { RecoilRelayEnvironmentProvider } from 'recoil-relay'

import ThemeProvider from './App.Theme'
import { ExtensionWatcher } from './domain/extension'
import RelayEnvironment, { chainDataSquidEnvKey } from './graphql/relay-environment'
import router from './routes'

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
        <Suspense fallback={<Loader />}>
          <ExtensionWatcher />
          <RouterProvider router={router} />
          <Toaster position="top-right" containerStyle={{ top: '6.4rem' }}>
            {t => <ToastBar toast={t} />}
          </Toaster>
        </Suspense>
      </RecoilRelayEnvironmentProvider>
    </RecoilRoot>
  </ThemeProvider>
)

export default App
