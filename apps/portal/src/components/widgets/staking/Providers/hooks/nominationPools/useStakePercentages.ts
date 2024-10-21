import useAvailableBalances from './useAvailableBalances'
import { selectedSubstrateAccountsState } from '@/domains/accounts'
import { chainQueryState } from '@/domains/common'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

const useStakePercentages = ({ rpcIds }: { rpcIds: string[] }) => {
  const availableBalances = useAvailableBalances({ rpcIds })
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  const poolsMembers = useRecoilValue(
    waitForAll(rpcIds.map(apiId => chainQueryState(apiId, 'nominationPools', 'poolMembers.multi', addresses)))
  )

  const stakedPools = useMemo(
    () =>
      poolsMembers.map(poolMembers =>
        poolMembers.reduce((prev, curr) => prev + curr.unwrapOrDefault().points.toBigInt(), 0n)
      ),
    [poolsMembers]
  )

  const stakePercentages = useMemo(
    () =>
      stakedPools.map((staked, index) =>
        staked === 0n || availableBalances[index] === undefined
          ? 0
          : new BigNumber(staked.toString()).div((availableBalances[index] + staked).toString()).toNumber()
      ),
    [availableBalances, stakedPools]
  )

  return stakePercentages
}

export default useStakePercentages
