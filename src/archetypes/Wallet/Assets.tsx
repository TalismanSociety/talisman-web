import { ChainLogo, Info, Panel, PanelSection, Pendor } from '@components'
import { calculatePortfolioAmounts, usePortfolio, useTaggedAmountsInPortfolio } from '@libs/portfolio'
import { useAccountAddresses, useGuardian } from '@libs/talisman'
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
import { formatCommas, formatCurrency } from '@util/helpers'
import { useMemo } from 'react'
import styled from 'styled-components'

// TODO: Move these to a global config object
const customRpcs = {
  '0': [], // ['wss://polkadot.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Polkadot Relay
  '2': [], // ['wss://kusama.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Kusama Relay
  '1000': [], // ['wss://statemine.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Statemine
  '2000': [], // ['wss://karura.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Karura
  '2001': [], // ['wss://bifrost-parachain.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Bifrost
  '2004': [], // ['wss://khala.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Khala
  '2007': [], // ['wss://shiden.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Shiden
  '2023': [], // ['wss://moonriver.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Moonriver
  '2084': [], // Calamari
  '2086': [], // KILT Spiritnet
  '2090': [], // Basilisk
}

const AssetItem = styled(({ id, balances, addresses, className }) => {
  const chain = useChain(id)

  const { name, longName, nativeToken, tokenDecimals } = chain
  const { price: tokenPrice, loading: priceLoading } = useTokenPrice(nativeToken)

  const tokenBalances = useFuncMemo(addTokensToBalances, balances, nativeToken ? tokenDecimals : undefined)
  const pricedTokenBalances = useFuncMemo(addPriceToTokenBalances, tokenBalances, tokenPrice)

  const portfolioAmounts = useFuncMemo(calculatePortfolioAmounts, pricedTokenBalances)
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
      <span className="left">
        <Info title={name} subtitle={longName || name} graphic={<ChainLogo chain={chain} type="logo" size={4} />} />
      </span>
      <span className="right">
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
      </span>
    </div>
  )
})`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > span {
    display: flex;
    align-items: center;

    &.right {
      text-align: right;
    }
  }
`

const Assets = styled(({ id, className }) => {
  const chainIds = useMemo(() => Object.keys(customRpcs), [])

  const { accounts } = useGuardian()
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
      <Panel title="Assets" subtitle={assetsUsd && formatCurrency(assetsUsd)}>
        {Object.entries(balancesByChain).map(([chainId, balances]) => (
          <PanelSection key={chainId}>
            <AssetItem id={chainId} balances={balances} addresses={accountAddresses} />
          </PanelSection>
        ))}
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
