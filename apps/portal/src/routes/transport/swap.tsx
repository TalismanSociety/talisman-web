import { TitlePortal } from '../layout'
import { ChainFlipSwap } from '@/components/widgets/chainflip-swap'

const Swap = () => {
  return (
    <>
      <TitlePortal>Swap</TitlePortal>
      <ChainFlipSwap />
      {/* <SwapWidget
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
      /> */}
    </>
  )
}

export default Swap
