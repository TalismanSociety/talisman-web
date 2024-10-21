import { selectedSubstrateAccountsState } from '@/domains/accounts'
import { chainDeriveState } from '@/domains/common'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

const useAvailableBalance = ({ rpcId }: { rpcId: string }) => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const balances = useRecoilValue(
    waitForAll(addresses.map(address => chainDeriveState(rpcId, 'balances', 'all', [address])))
  )

  const availableBalance = balances.reduce((prev, curr) => prev + curr.availableBalance.toBigInt(), 0n)

  return availableBalance
}
export default useAvailableBalance
