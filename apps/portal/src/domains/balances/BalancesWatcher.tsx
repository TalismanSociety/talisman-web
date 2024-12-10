import { useBalances as _useBalances, useSetBalancesAddresses } from '@talismn/balances-react'
import { useEffect, useMemo } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'

import { accountsState } from '@/domains/accounts/recoils'

import { useBalancesReportEffect } from './analytics'
import { balancesState } from './core'

export const BalancesWatcher = () => {
  const accounts = useRecoilValue(accountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  useSetBalancesAddresses(addresses)

  const unfilteredBalances = _useBalances()
  const balances = useMemo(() => unfilteredBalances, [unfilteredBalances])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    useRecoilCallback(({ set }) => () => {
      set(balancesState, balances)
    }),
    [balances]
  )

  useBalancesReportEffect()

  return null
}
