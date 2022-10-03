import { Pendor, Pill } from '@components'
import { ReactComponent as Loader } from '@icons/loader.svg'
import { usePortfolio } from '@libs/portfolio'
import { useAccountAddresses } from '@libs/talisman'
import { useBalances } from '@talismn/balances-react'
import { EvmErc20Module } from '@talismn/balances-evm-erc20'
import { EvmNativeModule } from '@talismn/balances-evm-native'
import { useChaindata, useTokens } from '@talismn/balances-react'
import { SubNativeModule } from '@talismn/balances-substrate-native'
import { SubOrmlModule } from '@talismn/balances-substrate-orml'
import { addBigNumbers } from '@talismn/util-legacy'
import { device } from '@util/breakpoints'
import { formatCurrency } from '@util/helpers'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const balanceModules = [SubNativeModule, SubOrmlModule, EvmNativeModule, EvmErc20Module]

const Total = styled(({ id, className }) => {

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

  const assetsValue = typeof balances?.sum.fiat('usd').transferable === 'number'
  ? new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'usd',
    currencyDisplay: 'narrowSymbol',
  }).format(balances?.sum.fiat('usd').transferable || 0)
  : <Loader />

  return (
    <div className={`wallet-total ${className}`}>
      <div className="title">{t('Portfolio value')}</div>
      <div className='amount'>
        <span>{assetsValue}</span>
      </div>
    </div>
  )
})`
  color: var(--color-text);

  > .title {
    font-size: var(--font-size-xsmall);
    color: var(--color-mid);
    margin: 0;
  }

  > .amount {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: var(--font-size-large);
    @media ${device.sm} {
      font-size: var(--font-size-xlarge);
    }
    @media ${device.md} {
      font-size: var(--font-size-xxlarge);
    }
    font-weight: bold;
    margin: 0;
    line-height: 1.4em;
  }
`

function useAddressesByToken(addresses: string[] | null | undefined, tokenIds: Token['id'][]) {
  return useMemo(() => {
    if (addresses === undefined || addresses === null) return {}
    return Object.fromEntries(tokenIds.map(tokenId => [tokenId, addresses]))
  }, [addresses, tokenIds])
}

export default Total
