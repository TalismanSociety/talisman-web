import { usePolkadotApiId } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { selectedSubstrateAccountsState } from '@/domains/accounts'
import { useChainState } from '@/domains/chains'
import { chainDeriveState, chainQueryState } from '@/domains/common/recoils/query'

const useStakePercentage = () => {
  const apiId = usePolkadotApiId()
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  const balances = useRecoilValue(
    waitForAll(addresses.map(address => chainDeriveState(apiId, 'balances', 'all', [address])))
  )
  const free = useMemo(() => balances.reduce((prev, curr) => prev + curr.freeBalance.toBigInt(), 0n), [balances])
  const chain = useRecoilValue(useChainState())
  const ledgers = useRecoilValue(
    // @ts-expect-error
    waitForAll(addresses.map(address => chainQueryState(chain.rpc, 'subtensorModule', 'totalColdkeyStake', [address])))
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const staked = useMemo(() => ledgers.reduce((prev, curr: any) => prev + curr?.toBigInt?.(), 0n), [ledgers])
  const total = useMemo(() => free + staked, [free, staked])

  const stakePercentage = useMemo(
    () => (staked === 0n ? 0 : new BigNumber(staked.toString()).div(total.toString()).toNumber()),
    [staked, total]
  )
  return stakePercentage
}

export default useStakePercentage
