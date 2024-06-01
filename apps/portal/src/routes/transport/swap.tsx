import { evmAccountsState, substrateAccountsState } from '../../domains/accounts'
import { selectedCurrencyState } from '../../domains/balances'
import { enableTestnetsState } from '../../domains/chains'
import { useConnectedSubstrateWallet } from '../../domains/extension'
import { TitlePortal } from '../layout'
import React, { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { useWalletClient } from 'wagmi'

const SwapWidget = React.lazy(async () => await import('@talismn/swap'))

const Swap = () => {
  const substrateAccounts = useRecoilValue(substrateAccountsState)
  const evmAccounts = useRecoilValue(evmAccountsState)

  const substrateWallet = useConnectedSubstrateWallet()
  const { data: evmWalletClient } = useWalletClient()

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
              readonly: account.readonly || (account.type === 'ethereum' && !account.canSignEvm),
            })),
          [evmAccounts, substrateAccounts]
        )}
        currency={useRecoilValue(selectedCurrencyState)}
        substrateSigner={substrateWallet?.signer}
        viemWalletClient={evmWalletClient}
        coingeckoApiEndpoint={import.meta.env.REACT_APP_COIN_GECKO_API}
        coingeckoApiTier={import.meta.env.REACT_APP_COIN_GECKO_API_TIER}
        coingeckoApiKey={import.meta.env.REACT_APP_COIN_GECKO_API_KEY}
        useTestnet={useRecoilValue(enableTestnetsState)}
      />
    </>
  )
}

export default Swap
