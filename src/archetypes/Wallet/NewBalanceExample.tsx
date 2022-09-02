import { useAccountAddresses } from '@libs/talisman'
import { EvmErc20Module } from '@talismn/balances-evm-erc20'
import { EvmNativeModule } from '@talismn/balances-evm-native'
import { ExampleModule } from '@talismn/balances-example'
import { useBalances, useChaindata } from '@talismn/balances-react'
import { SubNativeModule } from '@talismn/balances-substrate-native'
import { SubOrmlModule } from '@talismn/balances-substrate-orml'
import { Token } from '@talismn/chaindata-provider'
import { useMemo } from 'react'

const balanceModules = [ExampleModule, SubNativeModule, SubOrmlModule, EvmNativeModule, EvmErc20Module]

export default function NewBalanceExample() {
  const chaindata = useChaindata()
  const addresses = useAccountAddresses()

  // TODO: Use the tokens from chaindata
  // i.e. const tokens = useTokens(chaindata)
  const tokenIds = useMemo(() => ['polkadot-example-dot', 'polkadot-example-ksm'], [])

  const addressesByToken = useAddressesByToken(addresses, tokenIds)
  const balances = useBalances(balanceModules, chaindata, addressesByToken)

  return (
    <>
      <h2>Balances Demo</h2>
      {balances?.sorted.map(balance => (
        <div key={balance.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            alt="chain logo"
            src={`https://raw.githubusercontent.com/TalismanSociety/chaindata/feat/split-entities/assets/${balance.chainId}/logo.svg`}
            style={{ height: '2rem', borderRadius: '9999999rem' }}
          />
          <span>{balance.chain?.name}</span>
          <span>{balance.transferable.tokens}</span>
          <span>{balance.token?.symbol}</span>
        </div>
      ))}
      <pre>{JSON.stringify({ addresses, balances }, null, 2)}</pre>
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
function useAddressesByToken(addresses: string[] | null, tokenIds: Token['id'][]) {
  return useMemo(() => {
    if (addresses === null) return {}
    return Object.fromEntries(tokenIds.map(tokenId => [tokenId, addresses]))
  }, [addresses, tokenIds])
}
