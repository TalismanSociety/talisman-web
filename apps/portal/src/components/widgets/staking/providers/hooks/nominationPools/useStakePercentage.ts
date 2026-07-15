import { usePolkadotApiId, useQueryState } from '@talismn/react-polkadot-api'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { selectedSubstrateAccountsState } from '@/domains/accounts/recoils'
import { chainQueryState } from '@/domains/common/recoils/query'

const useStakePercentage = () => {
  const apiId = usePolkadotApiId()
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  // NOTE: query `system.account` directly instead of `api.derive.balances.all` — the derive throws
  // "Balance: Negative number passed to unsigned type" on Asset Hub chains (new frozen/holds model).
  const accountInfos = useRecoilValue(
    waitForAll(addresses.map(address => chainQueryState(apiId, 'system', 'account', [address])))
  )
  const total = useMemo(() => accountInfos.reduce((prev, curr) => prev + curr.data.free.toBigInt(), 0n), [accountInfos])
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
