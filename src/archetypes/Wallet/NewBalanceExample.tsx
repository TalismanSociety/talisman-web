import { useAccountAddresses } from '@libs/talisman'
import { EvmErc20Module } from '@talismn/balances-evm-erc20'
import { EvmNativeModule } from '@talismn/balances-evm-native'
import { useBalances, useChaindata, useTokens } from '@talismn/balances-react'
import { SubNativeModule } from '@talismn/balances-substrate-native'
import { SubOrmlModule } from '@talismn/balances-substrate-orml'
import { Token } from '@talismn/chaindata-provider'
import { formatDecimals } from '@talismn/util'
import { truncateString } from '@util/helpers'
import { useMemo } from 'react'

const balanceModules = [SubNativeModule, SubOrmlModule, EvmNativeModule, EvmErc20Module]

export default function NewBalanceExample() {
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

  return (
    <>
      <h2>Balances Demo</h2>

      {/* Display balances per balance (so, per token per account) */}
      {balances?.sorted.map(balance =>
        balance.total.planck === BigInt('0') ? null : (
          <div key={balance.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img alt="token logo" src={balance.token?.logo} style={{ height: '2rem', borderRadius: '9999999rem' }} />

            <span>{balance.status}</span>

            <span>{balance.chain?.name || balance.evmNetwork?.name}</span>
            <span>
              {formatDecimals(balance.transferable.tokens)} {balance.token?.symbol}
            </span>
            <span style={{ opacity: '0.6', fontSize: '0.8em' }}>
              {typeof balance.transferable.fiat('usd') === 'number'
                ? new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: 'usd',
                    currencyDisplay: 'narrowSymbol',
                  }).format(balance.transferable.fiat('usd') || 0)
                : ' -'}
            </span>
            <span>{truncateString(balance.address, 4, 4)}</span>
          </div>
        )
      )}

      {
        //      {/* Display balances per token */}
        //      {Object.values(tokens).map(token => (
        //        <div key={token.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        //          <img alt="token logo" src={token?.logo} style={{ height: '2rem', borderRadius: '9999999rem' }} />
        //
        //          {/* Can't do this yet, alec hasn't implemented it: */}
        //          {/* <span>{balances?.find({tokenId:token.id}).sum}</span> */}
        //
        //          {/* So sum it up manually instead: */}
        //          <span>
        //            {formatDecimals(
        //              new BalanceFormatter(
        //                balances?.find({ tokenId: token.id }).sorted.reduce((sum, balance) => {
        //                  return sum + balance.transferable.planck
        //                }, BigInt('0')) || BigInt('0'),
        //                token.decimals
        //              ).tokens
        //            )}{' '}
        //            {token.symbol}
        //          </span>
        //
        //          <span style={{ opacity: '0.6', fontSize: '0.8em' }}>
        //            {typeof balances?.find({ tokenId: token.id }).sum.fiat('usd').transferable === 'number'
        //              ? new Intl.NumberFormat(undefined, {
        //                  style: 'currency',
        //                  currency: 'usd',
        //                  currencyDisplay: 'narrowSymbol',
        //                }).format(balances?.find({ tokenId: token.id }).sum.fiat('usd').transferable || 0)
        //              : ' -'}
        //          </span>
        //        </div>
        //      ))}
      }
    </>
  )
}

/**
 * Given an array of `addresses` and an array of `tokenIds`, will return an `addressesByToken` map like so:
 *
 *     {
 *       [tokenIdOne]: [addressOne, addressTwo, etc]
 *       [tokenIdTwo]: [addressOne, addressTwo, etc]
 *       [etc]:        [addressOne, addressTwo, etc]
 *     }
 */
function useAddressesByToken(addresses: string[] | null | undefined, tokenIds: Token['id'][]) {
  return useMemo(() => {
    if (addresses === undefined || addresses === null) return {}
    return Object.fromEntries(tokenIds.map(tokenId => [tokenId, addresses]))
  }, [addresses, tokenIds])
}
