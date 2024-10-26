import { Decimal } from '@talismn/math'
import { usePolkadotApiId } from '@talismn/react-polkadot-api'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { selectedSubstrateAccountsState } from '@/domains/accounts'
import { chainDeriveState, substrateApiState, useTokenAmountFromPlanck } from '@/domains/common'

const useAvailableBalance = () => {
  const apiId = usePolkadotApiId()
  const api = useRecoilValue(substrateApiState(apiId as any))
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  const balances = useRecoilValue(
    waitForAll(addresses.map(address => chainDeriveState(apiId, 'balances', 'all', [address])))
  )
  const availableBalance = useMemo(
    () =>
      Decimal.fromPlanck(
        balances.reduce((prev, curr) => prev + curr.availableBalance.toBigInt(), 0n),
        api.registry.chainDecimals.at(0) ?? 0,
        { currency: api.registry.chainTokens.at(0) }
      ),
    [api.registry.chainDecimals, api.registry.chainTokens, balances]
  )

  const fiatAmount = useTokenAmountFromPlanck(availableBalance.planck).fiatAmount

  return { availableBalance, fiatAmount }
}

export default useAvailableBalance
