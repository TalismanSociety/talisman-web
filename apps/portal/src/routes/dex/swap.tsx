import { evmAccountsState, writeableSubstrateAccountsState } from '@domains/accounts'
import { selectedCurrencyState } from '@domains/balances'
import { enableTestnetsState } from '@domains/chains'
import { useConnectedEip6963Provider, useConnectedSubstrateWallet } from '@domains/extension'
import { TitlePortal } from '@routes/layout'
import React, { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { createWalletClient, custom } from 'viem'

const SwapWidget = React.lazy(async () => await import('@talismn/swap'))

const Swap = () => {
  const substrateAccounts = useRecoilValue(writeableSubstrateAccountsState)
  const evmAccounts = useRecoilValue(evmAccountsState)

  const substrateWallet = useConnectedSubstrateWallet()
  const evmProvider = useConnectedEip6963Provider()

  return (
    <>
      <TitlePortal>Swap</TitlePortal>
      <SwapWidget
        accounts={useMemo(
          () =>
            [...substrateAccounts, ...evmAccounts].map(account => ({
              type: account.type === 'ethereum' ? 'evm' : 'substrate',
              address: account.address as any,
              name: account.name,
              readonly: account.readonly ?? (account.type === 'ethereum' && !account.canSignEvm),
            })),
          [evmAccounts, substrateAccounts]
        )}
        currency={useRecoilValue(selectedCurrencyState)}
        polkadotSigner={substrateWallet?.signer}
        viemWalletClient={useMemo(
          () =>
            evmProvider === undefined ? undefined : createWalletClient({ transport: custom(evmProvider.provider) }),
          [evmProvider]
        )}
        coingeckoApiEndpoint={import.meta.env.REACT_APP_COIN_GECKO_API}
        coingeckoApiTier={import.meta.env.REACT_APP_COIN_GECKO_API_TIER}
        coingeckoApiKey={import.meta.env.REACT_APP_COIN_GECKO_API_KEY}
        useTestnet={useRecoilValue(enableTestnetsState)}
      />
    </>
  )
}

export default Swap
