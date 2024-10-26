import { usePolkadotApiId, useQueryState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { selectedSubstrateAccountsState } from '@/domains/accounts'
import { chainDeriveState } from '@/domains/common'

const useStakePercentage = () => {
  const apiId = usePolkadotApiId()
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  const balances = useRecoilValue(
    waitForAll(addresses.map(address => chainDeriveState(apiId, 'balances', 'all', [address])))
  )
  const total = useMemo(() => balances.reduce((prev, curr) => prev + curr.freeBalance.toBigInt(), 0n), [balances])
  const poolMembers = useRecoilValue(useQueryState('nominationPools', 'poolMembers.multi', addresses))
  const staked = useMemo(
    () => poolMembers.reduce((prev, curr) => prev + curr.unwrapOrDefault().points.toBigInt(), 0n),
    [poolMembers]
  )

  const stakePercentage = useMemo(
    () => (staked === 0n ? 0 : new BigNumber(staked.toString()).div((total + staked).toString()).toNumber()),
    [staked, total]
  )

  return stakePercentage
}

export default useStakePercentage
