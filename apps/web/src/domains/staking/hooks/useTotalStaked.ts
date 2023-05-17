import { type Account, selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { useNativeTokenPriceState } from '@domains/chains/recoils'
import { useChainState, useTokenAmountFromPlanck } from '@domains/common/hooks'
import BN from 'bn.js'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

export const useTotalStaked = () => {
  const accounts: Account[] = useRecoilValue(selectedSubstrateAccountsState)
  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address),
    {
      enabled: accounts.length > 0,
    }
  )

  return useTokenAmountFromPlanck(
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

export const useStakedBalances = () => {
  const accounts: Account[] = useRecoilValue(selectedSubstrateAccountsState)
  const price = useRecoilValue(useNativeTokenPriceState())

  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }: { address: string }) => address),
    {
      enabled: accounts.length > 0,
    }
  )

  return useMemo(
    () =>
      accounts.map((account, index) => {
        const balance = poolMembersLoadable.valueMaybe()?.[index]?.unwrapOrDefault().points.toNumber() ?? 0

        return {
          account,
          balance,
          fiatAmount: price * balance,
        }
      }),
    [accounts, poolMembersLoadable, price]
  )
}
