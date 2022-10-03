import { ChainLogo, ExtensionStatusGate, Info, Panel, PanelSection, Pendor, TokenLogo } from '@components'
import { calculateAssetPortfolioAmounts, usePortfolio, useTaggedAmountsInPortfolio } from '@libs/portfolio'
import { useAccountAddresses, useExtensionAutoConnect, useParachainDetailsById } from '@libs/talisman'
import { BalanceFormatter } from '@talismn/balances'
import { useBalances, useChaindata, useTokens } from '@talismn/balances-react'
import { EvmErc20Module } from '@talismn/balances-evm-erc20'
import { EvmNativeModule } from '@talismn/balances-evm-native'
import { SubNativeModule } from '@talismn/balances-substrate-native'
import { SubOrmlModule } from '@talismn/balances-substrate-orml'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { formatDecimals } from '@talismn/util'

const balanceModules = [SubNativeModule, SubOrmlModule, EvmNativeModule, EvmErc20Module]

const AssetItem = styled(({ token, tokenAmount, balance, className }) => {
  return (
    <div className={className}>
      <Info title={token?.symbol} subtitle={balance?.chain?.name || balance?.evmNetwork?.name} graphic={<TokenLogo token={token} type="logo" size={4} />} />
      <Info title={<Pendor suffix={` ${token?.symbol}`}>{tokenAmount}</Pendor>} subtitle={balance} />
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

const AssetBalance = styled(({ token, balances, addresses }) => {

  const tokenAmount : any = formatDecimals(
    new BalanceFormatter(
      balances?.find({ tokenId: token.id }).sorted.reduce((sum : any, balance : any) => {
        return BigInt(sum) + BigInt(balance.transferable.planck)
      }, BigInt('0')) || BigInt('0'),
      token.decimals
    ).tokens
  )

  if(tokenAmount === '0') return null

  const fiatBalance = typeof balances?.find({ tokenId: token.id }).sum.fiat('usd').transferable === 'number'
  ? new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'usd',
      currencyDisplay: 'narrowSymbol',
    }).format(balances?.find({ tokenId: token.id }).sum.fiat('usd').transferable || 0)
  : ' -'

  return (
    <PanelSection key={token.id} >
      <AssetItem 
      token={token} 
      tokenAmount={tokenAmount} 
      balance={fiatBalance.toString()} 
      addresses={addresses} />
    </PanelSection>
  )
})``

const Assets = styled(({ className }) => {

  const { t } = useTranslation()
  const chaindata = useChaindata()
  const addresses = useAccountAddresses()

  const tokens = useTokens(chaindata)

  const tokenIds = useMemo(
    () =>
      Object.values(tokens)
        // filter out testnet tokens
        .filter(({ isTestnet }) => !isTestnet)
        .map(({ id }) => id),
    [tokens]
  )

  const addressesByToken = useAddressesByToken(addresses, tokenIds)
  const balances = useBalances(balanceModules, chaindata, addressesByToken)

  const assetValue = typeof balances?.sum.fiat('usd').transferable === 'number'
  ? new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'usd',
    currencyDisplay: 'narrowSymbol',
  }).format(balances?.sum.fiat('usd').transferable || 0)
  : ' -'

  return (
    <section className={`wallet-assets ${className}`}>
      <Panel title={t('Assets')} subtitle={!balances ? "Loading" : assetValue?.toString()}>
        <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
          {tokens && balances && addresses ? 
            Object.values(tokens).map(token => (
              <AssetBalance key={token.id} token={token} balances={balances} addresses={addressesByToken} />
            )) :
            null
          }
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

  > div {
    > div {
      max-height: 360px;
      overflow-y: auto;
    }
  }
`

export default Assets

const ExtensionUnavailable = styled(props => {
  const { t } = useTranslation()
  return (
    <PanelSection comingSoon {...props}>
      <p>{t('extensionUnavailable.subtitle')}</p>
      <p>{t('extensionUnavailable.text')}</p>
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

function useAddressesByToken(addresses: string[] | null | undefined, tokenIds: Token['id'][]) {
  return useMemo(() => {
    if (addresses === undefined || addresses === null) return {}
    return Object.fromEntries(tokenIds.map(tokenId => [tokenId, addresses]))
  }, [addresses, tokenIds])
}