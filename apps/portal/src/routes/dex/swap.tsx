import { TalismanHandLoader } from '@components/TalismanHandLoader'
import { evmAccountsState, writeableSubstrateAccountsState } from '@domains/accounts'
import { useConnectedEip6963Provider, useConnectedSubstrateWallet } from '@domains/extension'
import { TitlePortal } from '@routes/layout'

import React, { Suspense, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { createWalletClient, custom } from 'viem'

const SwapWidget = React.lazy(async () => await import('@talismn/swap'))

const Swap = () => {
  const substrateAccounts = useRecoilValue(writeableSubstrateAccountsState)
  const evmAccounts = useRecoilValue(evmAccountsState)

  const substrateWallet = useConnectedSubstrateWallet()
  const evmProvider = useConnectedEip6963Provider()

  return (
    <div css={{ display: 'flex', justifyContent: 'center' }}>
      <TitlePortal>Swap</TitlePortal>
      <Suspense fallback={<TalismanHandLoader />}>
        <SwapWidget
          accounts={useMemo(
            () =>
              [
                ...substrateAccounts,
                ...evmAccounts.filter(account => Boolean(account.readonly) || account.canSignEvm),
              ].map(account => ({
                type: account.type === 'ethereum' ? 'evm' : 'substrate',
                address: account.address as any,
                name: account.name,
              })),
            [evmAccounts, substrateAccounts]
          )}
          polkadotSigner={substrateWallet?.signer}
          viemWalletClient={useMemo(
            () =>
              evmProvider === undefined ? undefined : createWalletClient({ transport: custom(evmProvider.provider) }),
            [evmProvider]
          )}
          coingeckoApiEndpoint={import.meta.env.REACT_APP_COIN_GECKO_API}
          coingeckoApiTier={import.meta.env.REACT_APP_COIN_GECKO_API_TIER}
          coingeckoApiKey={import.meta.env.REACT_APP_COIN_GECKO_API_KEY}
        />
      </Suspense>
    </div>
  )
}

export default Swap
