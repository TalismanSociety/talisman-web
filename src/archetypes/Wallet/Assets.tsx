import { ChainLogo, ExtensionStatusGate, Info, Panel, PanelSection, Pendor } from '@components'
import { calculateAssetPortfolioAmounts, usePortfolio, useTaggedAmountsInPortfolio } from '@libs/portfolio'
import { useAccountAddresses, useExtensionAutoConnect } from '@libs/talisman'
import { useTokenPrice } from '@libs/tokenprices'
import {
  BalanceWithTokens,
  BalanceWithTokensWithPrice,
  addPriceToTokenBalances,
  addTokensToBalances,
  groupBalancesByChain,
  useBalances,
  useChain,
} from '@talismn/api-react-hooks'
import { addBigNumbers, useFuncMemo } from '@talismn/util'
import customRpcs from '@util/customRpcs'
import { formatCommas, formatCurrency } from '@util/helpers'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const AssetItem = styled(({ id, balances, addresses, className }) => {
  const chain = useChain(id)

  const { status, accounts } = useExtensionAutoConnect()
  const isMoonriver = id === '2-2023'
  const hasNoEthereumAddress = useMemo(
    () => status === 'OK' && accounts.every(account => account.type !== 'ethereum'),
    [status, accounts]
  )

  const { name, longName, nativeToken, tokenDecimals } = chain
  const { price: tokenPrice, loading: priceLoading } = useTokenPrice(nativeToken)

  const tokenBalances = useFuncMemo(addTokensToBalances, balances, nativeToken ? tokenDecimals : undefined)
  const pricedTokenBalances = useFuncMemo(addPriceToTokenBalances, tokenBalances, tokenPrice)

  const portfolioAmounts = useFuncMemo(calculateAssetPortfolioAmounts, pricedTokenBalances)
  useTaggedAmountsInPortfolio(portfolioAmounts)

  const tokenSymbol = useFuncMemo(token => token || 'Planck', nativeToken)
  const tokens = useFuncMemo(
    (tokenBalances, addresses) =>
      tokenBalances
        .filter((balance): balance is BalanceWithTokens => balance !== null)
        .filter(balance => addresses.includes(balance.address))
        .map(balance => balance.tokens)
        .reduce(addBigNumbers, undefined),
    tokenBalances,
    addresses
  )
  const usd = useFuncMemo(
    (pricedBalances, addresses) =>
      pricedBalances
        .filter((balance): balance is BalanceWithTokensWithPrice => balance !== null)
        .filter(balance => addresses.includes(balance.address))
        .map(balance => balance.usd)
        .reduce(addBigNumbers, undefined),
    pricedTokenBalances,
    addresses
  )
  return (
    <div className={className}>
      <Info title={name} subtitle={longName || name} graphic={<ChainLogo chain={chain} type="logo" size={4} />} />
      {isMoonriver && hasNoEthereumAddress ? (
        <MoonriverWalletInstructions />
      ) : (
        <Info
          title={<Pendor suffix={` ${tokenSymbol}`}>{tokens && formatCommas(tokens)}</Pendor>}
          subtitle={
            tokens ? (
              <Pendor prefix={!usd && '-'} require={!priceLoading}>
                {usd && formatCurrency(usd)}
              </Pendor>
            ) : null
          }
        />
      )}
    </div>
  )
})`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > *:last-child {
    text-align: right;
  }
`

const MoonriverWalletInstructions = styled(({ className }) => {
  const { t } = useTranslation()
  return (
    <Info
      className={className}
      title={`🌕  ${t('Unavailable')}`}
      subtitle={
        <a
          href="https://medium.com/we-are-talisman/how-to-view-your-moonriver-balance-in-the-talisman-web-app-c37185fb3980"
          target="_blank"
          rel="noreferrer noopener"
        >
          <div className="text-vertical-center">
            <span className="plus-icon">(+)</span> {`${t('Add {{asset}} Balance', { asset: 'Moonriver' })}`}
          </div>
        </a>
      }
    />
  )
})`
  .text-vertical-center {
    display: flex;
    align-items: center;
  }
  .plus-icon {
    font: 0.75em monospace;
    letter-spacing: -1px;
    margin-right: 0.25em;
  }
  > .text > .subtitle a {
    color: var(--color-primary);
  }
`

const Assets = styled(({ className }) => {
  const { t } = useTranslation()
  const chainIds = useMemo(() => Object.keys(customRpcs), [])

  const { accounts } = useExtensionAutoConnect()
  const addresses = useMemo(() => accounts.map((account: any) => account.address), [accounts])
  const accountAddresses = useAccountAddresses()

  const { balances } = useBalances(addresses, chainIds, customRpcs)
  const balancesByChain = useFuncMemo(groupBalancesByChain, chainIds, balances)

  const { totalAssetsUsdByAddress } = usePortfolio()
  const assetsUsd = useMemo(
    () =>
      Object.entries(totalAssetsUsdByAddress || {})
        .filter(([address]) => accountAddresses && accountAddresses.includes(address))
        .map(([, assetsUsd]) => assetsUsd)
        .reduce(addBigNumbers, undefined),
    [totalAssetsUsdByAddress, accountAddresses]
  )

  return (
    <section className={`wallet-assets ${className}`}>
      <Panel title={t('Assets')} subtitle={assetsUsd && formatCurrency(assetsUsd)}>
        <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
          {Object.entries(balancesByChain).map(([chainId, balances]) => (
            <PanelSection key={chainId}>
              <AssetItem id={chainId} balances={balances} addresses={accountAddresses} />
            </PanelSection>
          ))}
        </ExtensionStatusGate>
      </Panel>
    </section>
  )
})`
  > .message {
    text-align: right;

    &.is-error {
      color: red;
    }
  }
`

export default Assets

const ExtensionUnavailable = styled(props => {
  const { t } = useTranslation()
  return (
    <PanelSection comingSoon {...props}>
      <h2>{t('extensionUnavailable.title')}</h2>
      <p>{t('extensionUnavailable.subtitle')}</p>
      <p>
        {t('extensionUnavailable.text')}
        <br />
        {t('extensionUnavailable.text2')}
      </p>
    </PanelSection>
  )
})`
  text-align: center;

  > *:not(:last-child) {
    margin-bottom: 2rem;
  }
  > *:last-child {
    margin-bottom: 0;
  }

  > h2 {
    color: var(--color-text);
    font-weight: 600;
    font-size: 1.8rem;
  }
  p {
    color: #999;
    font-size: 1.6rem;
  }
`
