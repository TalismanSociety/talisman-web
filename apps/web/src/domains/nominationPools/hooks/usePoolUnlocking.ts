import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { useChainState } from '@domains/common/hooks'
import BN from 'bn.js'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

export const usePoolUnlocking = () => {
  const sessionProgressLoadable = useChainState('derive', 'session', 'progress', [])

  const [accounts] = useRecoilValue(waitForAll([selectedSubstrateAccountsState]))

  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address)
  )

  return useMemo(() => {
    if (sessionProgressLoadable.state !== 'hasValue' || poolMembersLoadable.state !== 'hasValue') {
      return undefined
    }

    return poolMembersLoadable.contents.flatMap((pool, index) => {
      const address = accounts[index]?.address

      const all = Array.from(pool.unwrapOrDefault().unbondingEras.entries(), ([era, amount]) => ({
        address: address,
        pool: pool.unwrapOrDefault(),
        amount,
        erasTilWithdrawable: era.lte(sessionProgressLoadable.contents.activeEra)
          ? undefined
          : era.sub(sessionProgressLoadable.contents.activeEra),
      }))

      const withdrawables = all.filter(x => x.erasTilWithdrawable === undefined)
      const pendings = all.filter(x => x.erasTilWithdrawable !== undefined)

      if (withdrawables.length === 0) return pendings

      return [
        { ...withdrawables[0], amount: withdrawables.reduce((prev, curr) => prev.add(curr.amount), new BN(0)) },
        ...pendings,
      ]
    })
  }, [
    sessionProgressLoadable.state,
    sessionProgressLoadable.contents.activeEra,
    poolMembersLoadable.state,
    poolMembersLoadable.contents,
    accounts,
  ])
}
