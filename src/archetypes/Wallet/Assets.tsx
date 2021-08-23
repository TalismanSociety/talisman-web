import { Image, Info, Panel, PanelSection, Pendor } from '@components'
import { Tag, usePortfolio, useTaggedAmountsInPortfolio } from '@libs/portfolio'
import { useAccountAddresses, useGuardian } from '@libs/talisman'
import { useTokenPrice } from '@libs/tokenprices'
import { useBalances, useChain } from '@talismn/api-react-hooks'
import { formatCommas, formatCurrency } from '@util/helpers'
import BigNumber from 'bignumber.js'
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
}

const ChainLogo = styled(({ chain, type, className }) => {
  return (
    <Image
      src={chain?.asset?.logo}
      alt={`${chain?.name} ${type}`}
      className={`crowdloan-asset crowdloan-${type} ${className}`}
      data-type={type}
    />
  )
})`
  &[data-type='logo'] {
    font-size: ${({ size = 8 }) => `${size}rem`};
    width: 1em;
    height: 1em;
    border-radius: 50%;
    display: block;
  }
`

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
        .filter(balance => addresses.includes(balance.address))
        .map(balance => balance.tokens)
        .reduce(addBigNumbers, undefined),
    tokenBalances,
    addresses
  )
  const usd = useFuncMemo(
    (pricedBalances, addresses) =>
      pricedBalances
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

  const { balances, status, message } = useBalances(addresses, chainIds, customRpcs)
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
      {message && (
        <div className={`message ${status === 'ERROR' && 'is-error'}`}>
          Failed to fetch account balances
          <br />
          {message}
        </div>
      )}
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

//
// useFuncMemo: why type your arguments twice?
//
// Tired:
//
//   const someData = useSomeData()
//   const someMoreData = useSomeMoreData()
//
//   const result = useMemo(() => {
//     return processData(someData, someMoreData)
//   }, [someData, someMoreData])
//
// Wired:
//
//   const someData = useSomeData()
//   const someMoreData = useSomeMoreData()
//
//   const result = useFuncMemo(processData, someData, someMoreData)
//
function useFuncMemo<Args extends any[], Result>(func: (...args: Args) => Result, ...args: Args) {
  return useMemo(() => func(...args), args) // eslint-disable-line react-hooks/exhaustive-deps
}

// TODO: Move these helper functions and hooks into @talismn/api

function groupBalancesByChain(chainIds: string[], balances: any[]): { [key: string]: any[] } {
  const byChain = Object.fromEntries(chainIds.map<[string, any[]]>(chainId => [chainId, []]))

  balances
    .filter(balance => typeof balance.chainId === 'string')
    .filter(balance => chainIds.includes(balance.chainId))
    .forEach(balance => {
      byChain[balance.chainId].push(balance)
    })

  return byChain
}

function addTokensToBalances(balances: any[], tokenDecimals?: number): any[] {
  return balances.map(balance => ({ ...balance, tokens: planckToTokens(balance.free, tokenDecimals) }))
}

function planckToTokens(planck: string, tokenDecimals?: number): string | undefined {
  if (!planck || typeof tokenDecimals !== 'number') return

  const base = new BigNumber(10)
  const exponent = new BigNumber(tokenDecimals).negated()
  const multiplier = base.pow(exponent)

  return new BigNumber(planck).multipliedBy(multiplier).toString()
}

function addPriceToTokenBalances(balances: any[], tokenPrice?: string): any[] {
  if (typeof tokenPrice !== 'number') return balances

  return balances
    .filter(balance => typeof balance.tokens === 'string')
    .map(balance => ({
      ...balance,
      usd: new BigNumber(balance.tokens).multipliedBy(new BigNumber(tokenPrice || 0)).toString(),
    }))
}

function calculatePortfolioAmounts(balances: any[]): Array<{ tags: Tag[]; amount: string | undefined }> {
  const amounts: Array<{ tags: Tag[]; amount: string | undefined }> = []

  const byAddress = groupBalancesByAddress(balances.filter(balance => typeof balance.usd === 'string'))

  Object.entries(byAddress).forEach(([address, balances]) => {
    const tags: Tag[] = ['USD', 'Assets', { Address: address }]
    balances.forEach(balance => amounts.push({ tags, amount: balance.usd }))
  })

  return amounts
}

function groupBalancesByAddress(balances: any[]): { [key: string]: any[] } {
  const byAddress: { [key: string]: any } = {}

  balances
    .filter(balance => typeof balance.address === 'string')
    .forEach(balance => {
      if (!byAddress[balance.address]) byAddress[balance.address] = []
      byAddress[balance.address].push(balance)
    })

  return byAddress
}

// reducers

function addBigNumbers(a?: string, b?: string): string | undefined {
  if (!a && !b) return undefined
  if (!a) return b
  if (!b) return a

  return new BigNumber(a).plus(new BigNumber(b)).toString()
}
