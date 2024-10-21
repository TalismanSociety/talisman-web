import { selectedSubstrateAccountsState } from '@/domains/accounts'
import { chainDeriveState } from '@/domains/common'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

const useAvailableBalances = ({ rpcIds }: { rpcIds: string[] }) => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const balancesByRpc = useRecoilValue(
    waitForAll(rpcIds.flatMap(apiId => addresses.map(address => chainDeriveState(apiId, 'balances', 'all', [address]))))
  )

  const availableBalances = rpcIds.map((_, index) => {
    // groups balances of multiple addresses by rpc
    const balancesForRpc = balancesByRpc.slice(index * addresses.length, (index + 1) * addresses.length)
    return balancesForRpc.reduce((prev, curr) => prev + curr.availableBalance.toBigInt(), 0n)
  })

  return availableBalances
}

export default useAvailableBalances
