import { Image, Info, Panel, Pendor } from '@components'
import { usePortfolio, useTaggedAmountInPortfolio } from '@libs/portfolio'
import { useAccountAddresses, useGuardian } from '@libs/talisman'
import { useTokenPrice } from '@libs/tokenprices'
import { useBalances, useChain } from '@talismn/api-react-hooks'
import { formatCommas, formatCurrency } from '@util/helpers'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import styled from 'styled-components'

const customRpcs = {
  '0': [], // ['wss://polkadot.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Polkadot Relay
  '2': [], // ['wss://kusama.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Kusama Relay
  '1000': [], // ['wss://statemine.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Statemine
  '2000': [], // ['wss://karura.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Karura
  '2001': [], // ['wss://bifrost-parachain.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Bifrost
  // '2004': [], // ['wss://khala.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Khala
  '2007': [], // ['wss://shiden.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Shiden
  // '2023': [], // ['wss://moonriver.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Moonriver
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

  const { name, nativeToken, tokenDecimals } = chain
  const freePlanck = useMemo(
    () =>
      balances.length > 0
        ? balances
            .filter(balance => addresses.includes(balance.address))
            .map(balance => balance.free)
            .reduce((freePlanck, balanceFree) => freePlanck.plus(new BigNumber(balanceFree)), new BigNumber(0))
            .toString()
        : undefined,
    [balances, addresses]
  )

  const [freeTokens, tokenSymbol] = usePlanckToTokens(freePlanck, nativeToken, tokenDecimals)

  const { price: tokenPrice, loading: priceLoading } = useTokenPrice(tokenSymbol)
  const totalUsd = useMemo(
    () => (freeTokens && tokenPrice ? String(Number(freeTokens) * Number(tokenPrice)) : undefined),
    [freeTokens, tokenPrice]
  )

  const tags = useMemo(
    () => ['USD', 'Assets', ...(addresses || []).map((Address: string) => ({ Address }))],
    [addresses]
  )
  useTaggedAmountInPortfolio(tags, totalUsd)

  return (
    <div className={className}>
      <span className="left">
        <Info title={name} subtitle={name} graphic={<ChainLogo chain={chain} type="logo" size={4} />} />
      </span>
      <span className="right">
        <Info
          title={<Pendor suffix={` ${tokenSymbol}`}>{freeTokens && formatCommas(freeTokens)}</Pendor>}
          subtitle={
            freeTokens ? (
              <Pendor prefix={!totalUsd && '-'} require={!priceLoading}>
                {totalUsd && formatCurrency(totalUsd)}
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
  const addresses = useMemo(() => accounts.map(account => account.address), [accounts])
  const accountAddresses = useAccountAddresses()

  const { balances, status, message } = useBalances(addresses, chainIds, customRpcs)
  const balancesByChain = useMemo(
    () =>
      (balances || []).reduce(
        (byChain, balance) => ({ ...byChain, [balance.chainId]: [...byChain[balance.chainId], balance] }),
        Object.fromEntries(chainIds.map(chainId => [chainId, []]))
      ),
    [chainIds, balances]
  )

  const { totalAssetsUsd } = usePortfolio()

  return (
    <section className={`wallet-assets ${className}`}>
      {message && (
        <div className={`message ${status === 'ERROR' && 'is-error'}`}>
          Failed to fetch account balances
          <br />
          {message}
        </div>
      )}
      <Panel title="Assets" subtitle={totalAssetsUsd && formatCurrency(totalAssetsUsd)}>
        {Object.entries(balancesByChain).map(([chainId, balances]) => (
          <Panel.Section key={chainId}>
            <AssetItem id={chainId} balances={balances} addresses={accountAddresses} />
          </Panel.Section>
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

function usePlanckToTokens(
  planck: string,
  token?: string,
  tokenDecimals?: number
): [tokens: string, tokenSymbol: string] {
  return useMemo(() => {
    if (!planck || !token || typeof tokenDecimals !== 'number') return [planck, 'Planck']

    const base = new BigNumber(10)
    const exponent = new BigNumber(tokenDecimals).negated()
    const multiplier = base.pow(exponent)

    const tokens = new BigNumber(planck).multipliedBy(multiplier).toString()
    return [tokens, token]
  }, [planck, token, tokenDecimals])
}
