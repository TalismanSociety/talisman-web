import useAprs from './useAprs'
import { selectedSubstrateAccountsState } from '@/domains/accounts'
import { nominationPoolsEnabledChainsState } from '@/domains/chains'
import { chainDeriveState } from '@/domains/common'
import { Decimal } from '@talismn/math'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

const useNominationPoolsProviders = () => {
  const nominationPools = useRecoilValue(nominationPoolsEnabledChainsState)
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  const rpcIds = nominationPools.map(({ rpc }) => rpc ?? '')

  const balancesByRpc = useRecoilValue(
    waitForAll(rpcIds.flatMap(apiId => addresses.map(address => chainDeriveState(apiId, 'balances', 'all', [address]))))
  )

  const aprs = useAprs({ rpcIds })

  const reducedBalancesByRpc = rpcIds.map((_, index) => {
    // groups balances of multiple addresses by rpc
    const balancesForRpc = balancesByRpc.slice(index * addresses.length, (index + 1) * addresses.length)
    return balancesForRpc.reduce((prev, curr) => prev + curr.availableBalance.toBigInt(), 0n)
  })

  const nominationPoolProviders = nominationPools?.map(({ chainName, id, nativeToken }, index) => {
    const { symbol, logo, decimals } = nativeToken ?? {}
    return {
      symbol,
      logo,
      chainName,
      chainId: id,
      apr: aprs[index]?.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 }),
      type: 'Nomination pool',
      provider: chainName,
      unbondingPeriod: '5 days',
      availableBalance: Decimal.fromPlanck(reducedBalancesByRpc[index] ?? 0n, decimals ?? 0, { currency: symbol }),
      stakePercentage: 0.5,
      actionLink: `?action=stake&type=nomination-pools&chain=${id}`,
    }
  })

  console.log({ nominationPoolProviders })
}

export default useNominationPoolsProviders
