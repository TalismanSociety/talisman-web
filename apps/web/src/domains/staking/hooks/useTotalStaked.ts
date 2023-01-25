import { substrateAccountsState } from '@domains/accounts/recoils'
import { useChainState, useTokenAmountFromAtomics } from '@domains/common/hooks'
import BN from 'bn.js'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

export const useTotalStaked = () => {
  const accounts = useRecoilValue(substrateAccountsState)
  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address),
    {
      enabled: accounts.length > 0,
    }
  )

  return useTokenAmountFromAtomics(
    useMemo(
      () =>
        accounts.length === 0
          ? new BN(0)
          : poolMembersLoadable
              .valueMaybe()
              ?.reduce((prev, curr) => prev.add(curr.unwrapOrDefault().points), new BN(0)),
      [accounts.length, poolMembersLoadable]
    )
  )
}
