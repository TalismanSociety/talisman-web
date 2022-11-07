import { ExtensionStatusGate, Info, Panel, PanelSection, Pendor, TokenLogo } from '@components'
import styled from '@emotion/styled'
import { ReactComponent as Loader } from '@icons/loader.svg'
import { useActiveAccount } from '@libs/talisman'
import { useBalances } from '@libs/talisman'
import { Balance, BalanceFormatter, Balances } from '@talismn/balances'
import { useChaindata, useChains, useEvmNetworks } from '@talismn/balances-react'
import { Token } from '@talismn/chaindata-provider'
import { formatDecimals } from '@talismn/util'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

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
    <Info title={title} subtitle={subtitle} graphic={<TokenLogo token={token} size={4} />} />
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
  address: string | undefined
}
const AssetBalance = styled(({ token, balances, address }: AssetBalanceProps) => {
  // let tokenBalances = null

  const tokenBalances =
    address !== undefined
      ? balances?.find([{ address: address, tokenId: token.id }])
      : balances?.find({ tokenId: token.id })
  if (!tokenBalances) return null

  const tokenAmount = tokenBalances.sorted.reduce((sum, balance) => sum + balance.transferable.planck, BigInt('0'))
  if (tokenAmount === BigInt('0')) return null

  const tokenAmountFormatted = formatDecimals(new BalanceFormatter(tokenAmount, token.decimals).tokens)

  const fiatAmount =
    (balances?.find({ tokenId: token.id }).sum.fiat('usd').transferable ?? 0).toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }) ?? '-'

  const isOrml = token.type === 'substrate-orml'

  const chainName = tokenBalances?.sorted[0]?.chain?.name ?? tokenBalances?.sorted[0]?.evmNetwork?.name
  const chainType = getNetworkType(tokenBalances.sorted[0])

  return (
    <PanelSection key={token.id}>
      <AssetItem
        token={token}
        tokenAmount={tokenAmountFormatted}
        fiatAmount={fiatAmount}
        title={isOrml ? `${chainName} (${token.symbol})` : chainName}
        subtitle={chainType}
      />
    </PanelSection>
  )
})``

const Assets = styled(({ className }) => {
  const { t } = useTranslation()

  const { balances, tokenIds, tokens, assetsValue } = useBalances()
  const { address } = useActiveAccount()
  const chaindata = useChaindata()

  const chains = useChains(chaindata)
  const evmNetworks = useEvmNetworks(chaindata)

  const fiatTotal =
    address !== undefined
      ? (balances?.find({ address: address }).sum.fiat('usd').transferable ?? 0).toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
          currencyDisplay: 'narrowSymbol',
        }) ?? ' -'
      : assetsValue

  const value = balances?.find({ address: address })?.sum?.fiat('usd').transferable

  const assetBalances = useMemo(
    () =>
      tokenIds
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

          const aChain = a.chain?.id ? chains[a.chain.id] : a.evmNetwork?.id ? evmNetworks[a.evmNetwork.id] : null
          const bChain = b.chain?.id ? chains[b.chain.id] : b.evmNetwork?.id ? evmNetworks[b.evmNetwork.id] : null

          const aCmp = aChain?.name?.toLowerCase() || a.chain?.id || a.evmNetwork?.id
          const bCmp = bChain?.name?.toLowerCase() || b.chain?.id || b.evmNetwork?.id

          if (aCmp === undefined && bCmp === undefined) return 0
          if (aCmp === undefined) return 1
          if (bCmp === undefined) return -1

          return aCmp.localeCompare(bCmp)
        })
        .map(token => <AssetBalance key={token.id} token={token} balances={balances} address={address} />),
    [address, balances, chains, evmNetworks, tokenIds, tokens]
  )

  return (
    <section className={`wallet-assets ${className}`}>
      <Panel title={t('Assets')} subtitle={balances !== undefined ? fiatTotal : <Loader />}>
        <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
          {(balances?.sorted.length || 0) > 0 ? assetBalances : <AssetsLoading />}
          {value === 0 && address ? (
            <>
              <PanelSection>
                <AssetItem
                  token={tokens['kusama-substrate-native-ksm']}
                  tokenAmount={'0'}
                  fiatAmount={(0).toLocaleString(undefined, {
                    style: 'currency',
                    currency: 'USD',
                    currencyDisplay: 'narrowSymbol',
                  })}
                  title={tokens['kusama-substrate-native-ksm'].symbol}
                  subtitle={'Relay Chain'}
                />
              </PanelSection>
              <PanelSection>
                <AssetItem
                  token={tokens['polkadot-substrate-native-dot']}
                  tokenAmount={'0'}
                  fiatAmount={(0).toLocaleString(undefined, {
                    style: 'currency',
                    currency: 'USD',
                    currencyDisplay: 'narrowSymbol',
                  })}
                  title={tokens['polkadot-substrate-native-dot'].symbol}
                  subtitle={'Relay Chain'}
                />
              </PanelSection>
            </>
          ) : null}
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
      max-height: 400px;
      overflow-y: auto;
    }
  }
`

export default Assets

const AssetsLoading = styled(({ className }) => {
  const placeholderAssets = Array(5).fill('🍜')

  return (
    <PanelSection className={className}>
      {placeholderAssets.map((asset, index) => (
        <div className="loading-segment animate" key={index}>
          <span>{asset}</span>
        </div>
      ))}
    </PanelSection>
  )
})`
  padding: 0 !important;

  .loading-segment {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 71px;

    border-top: 1px solid rgba(165, 165, 165, 0.05);

    > span {
      opacity: 0;
    }

    > *:last-child {
      text-align: right;
    }
  }

  .animate {
    animation: shimmer 1.5s infinite;
    background: linear-gradient(90deg, rgba(26, 26, 26, 1) 15%, rgba(38, 38, 38, 1) 25%, rgba(26, 26, 26, 1) 26%);
    background-size: 3500px 100%;
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`

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

function getNetworkType({ chain, evmNetwork }: Balance): string | null {
  if (evmNetwork) return evmNetwork.isTestnet ? 'EVM Testnet' : 'EVM Blockchain'

  if (chain === null) return null

  if (chain.isTestnet) return 'Testnet'
  return chain.paraId ? 'Parachain' : (chain.parathreads ?? []).length > 0 ? 'Relay Chain' : 'Blockchain'
}
