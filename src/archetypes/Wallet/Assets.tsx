import { ExtensionStatusGate, Info, Panel, PanelSection, Pendor, TokenLogo } from '@components'
import { useAccountAddresses } from '@libs/talisman'
import { Balance, BalanceFormatter, Balances } from '@talismn/balances'
import { EvmErc20Module } from '@talismn/balances-evm-erc20'
import { EvmNativeModule } from '@talismn/balances-evm-native'
import { useBalances, useChaindata, useChains, useEvmNetworks, useTokens } from '@talismn/balances-react'
import { SubNativeModule } from '@talismn/balances-substrate-native'
import { SubOrmlModule } from '@talismn/balances-substrate-orml'
import { Token } from '@talismn/chaindata-provider'
import { formatDecimals } from '@talismn/util'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const balanceModules = [SubNativeModule, SubOrmlModule, EvmNativeModule, EvmErc20Module]

type AssetItemProps = {
  className?: string
  token: Token
  tokenAmount: string
  fiatAmount: string
  title?: string | null
  subtitle?: string | null
}
const AssetItem = styled(({ token, tokenAmount, fiatAmount, title, subtitle, className }: AssetItemProps) => (
  <div className={className}>
    <Info title={title} subtitle={subtitle} graphic={<TokenLogo token={token} type="logo" size={4} />} />
    <Info title={<Pendor suffix={` ${token?.symbol}`}>{tokenAmount}</Pendor>} subtitle={fiatAmount} />
  </div>
))`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > *:last-child {
    text-align: right;
  }
`

type AssetBalanceProps = {
  token: Token
  balances: Balances | undefined
}
const AssetBalance = styled(({ token, balances }: AssetBalanceProps) => {
  const tokenBalances = balances?.find({ tokenId: token.id })
  if (!tokenBalances) return null

  const tokenAmount = tokenBalances.sorted.reduce((sum, balance) => sum + balance.transferable.planck, BigInt('0'))
  if (tokenAmount === BigInt('0')) return null

  const tokenAmountFormatted = formatDecimals(new BalanceFormatter(tokenAmount, token.decimals).tokens)

  const fiatAmount =
    typeof tokenBalances.sum.fiat('usd').transferable === 'number'
      ? new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'usd',
          currencyDisplay: 'narrowSymbol',
        }).format(tokenBalances.sum.fiat('usd').transferable || 0)
      : '-'

  const chainName = tokenBalances.sorted[0].chain?.name || tokenBalances.sorted[0].evmNetwork?.name
  const chainType = getNetworkType(tokenBalances.sorted[0])

  return (
    <PanelSection key={token.id}>
      <AssetItem
        token={token}
        tokenAmount={tokenAmountFormatted}
        fiatAmount={fiatAmount}
        title={chainName}
        subtitle={chainType}
      />
    </PanelSection>
  )
})``

const Assets = styled(({ className }) => {
  const { t } = useTranslation()

  const chaindata = useChaindata()
  const addresses = useAccountAddresses()

  const chains = useChains(chaindata)
  const evmNetworks = useEvmNetworks(chaindata)
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

  const fiatTotal =
    typeof balances?.sum.fiat('usd').transferable === 'number'
      ? new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'usd',
          currencyDisplay: 'narrowSymbol',
        }).format(balances?.sum.fiat('usd').transferable || 0)
      : '-'

  return (
    <section className={`wallet-assets ${className}`}>
      <Panel title={t('Assets')} subtitle={!balances ? 'Loading' : fiatTotal}>
        <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
          {(balances?.sorted.length || 0) > 0
            ? tokenIds
                .map(tokenId => tokens[tokenId])
                .sort((a, b) => {
                  // TODO: Move token sorting into the chaindata subsquid indexer

                  if (a.chain?.id === 'polkadot' && b.chain?.id !== 'polkadot') return -1
                  if (b.chain?.id === 'polkadot' && a.chain?.id !== 'polkadot') return 1
                  if (a.chain?.id === 'kusama' && b.chain?.id !== 'kusama') return -1
                  if (b.chain?.id === 'kusama' && a.chain?.id !== 'kusama') return 1

                  if ((a.chain?.id || a.evmNetwork?.id) === (b.chain?.id || b.evmNetwork?.id)) {
                    if (a.type === 'substrate-native') return -1
                    if (b.type === 'substrate-native') return 1
                    if (a.type === 'evm-native') return -1
                    if (b.type === 'evm-native') return 1

                    const aCmp = a.symbol?.toLowerCase() || a.id
                    const bCmp = b.symbol?.toLowerCase() || b.id

                    return aCmp.localeCompare(bCmp)
                  }

                  const aChain = a.chain?.id
                    ? chains[a.chain.id]
                    : a.evmNetwork?.id
                    ? evmNetworks[a.evmNetwork.id]
                    : null
                  const bChain = b.chain?.id
                    ? chains[b.chain.id]
                    : b.evmNetwork?.id
                    ? evmNetworks[b.evmNetwork.id]
                    : null

                  const aCmp = aChain?.name?.toLowerCase() || a.chain?.id || a.evmNetwork?.id
                  const bCmp = bChain?.name?.toLowerCase() || b.chain?.id || b.evmNetwork?.id

                  if (aCmp === undefined && bCmp === undefined) return 0
                  if (aCmp === undefined) return 1
                  if (bCmp === undefined) return -1

                  return aCmp.localeCompare(bCmp)
                })
                .map(token => <AssetBalance key={token.id} token={token} balances={balances} />)
            : null}
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

/**
 * Given an array of `addresses` and an array of `tokenIds`, will return an `addressesByToken` map like so:
 *
 *     {
 *       [tokenIdOne]: [addressOne, addressTwo, etc]
 *       [tokenIdTwo]: [addressOne, addressTwo, etc]
 *       [etc]:        [addressOne, addressTwo, etc]
 *     }
 */
function useAddressesByToken(addresses: string[] | null | undefined, tokenIds: string[]) {
  return useMemo(() => {
    if (addresses === undefined || addresses === null) return {}
    return Object.fromEntries(tokenIds.map(tokenId => [tokenId, addresses]))
  }, [addresses, tokenIds])
}

function getNetworkType({ chain, evmNetwork }: Balance): string | null {
  if (evmNetwork) return evmNetwork.isTestnet ? 'EVM Testnet' : 'EVM Blockchain'
  if (chain) {
    if (chain.isTestnet) return 'Testnet'
    return chain.paraId ? 'Parachain' : (chain.parathreads || []).length > 0 ? 'Relay Chain' : 'Blockchain'
  }
  return null
}
