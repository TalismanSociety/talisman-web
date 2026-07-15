import { usePolkadotApiId } from '@talismn/react-polkadot-api'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { selectedSubstrateAccountsState } from '@/domains/accounts/recoils'
import { useTokenAmountFromPlanck } from '@/domains/common/hooks/useTokenAmount'
import { substrateApiState } from '@/domains/common/recoils/api'
import { chainQueryState } from '@/domains/common/recoils/query'
import { Decimal } from '@/util/Decimal'

/**
 * The relevant fields of `system.account`'s `data`, covering both the current (`frozen`) and the
 * legacy (`miscFrozen`) substrate balance models.
 */
type AccountBalanceData = {
  free: { toBigInt: () => bigint }
  frozen?: { toBigInt: () => bigint }
  miscFrozen?: { toBigInt: () => bigint }
}

const useAvailableBalance = () => {
  const apiId = usePolkadotApiId()
  const api = useRecoilValue(substrateApiState(apiId as string | undefined))
  const accounts = useRecoilValue(selectedSubstrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])

  // Query `system.account` directly instead of `api.derive.balances.all`: the derive throws
  // "Balance: Negative number passed to unsigned type" on Asset Hub chains, whose post-migration
  // frozen/holds balance model it doesn't understand.
  const accountInfos = useRecoilValue(
    waitForAll(addresses.map(address => chainQueryState(apiId, 'system', 'account', [address])))
  )
  const availableBalance = useMemo(
    () =>
      Decimal.fromPlanck(
        accountInfos.reduce((prev, curr) => {
          const data: AccountBalanceData = curr.data
          const free = data.free.toBigInt()
          const frozen = (data.frozen ?? data.miscFrozen)?.toBigInt() ?? 0n
          return prev + (free > frozen ? free - frozen : 0n)
        }, 0n),
        api.registry.chainDecimals.at(0) ?? 0,
        { currency: api.registry.chainTokens.at(0) }
      ),
    [accountInfos, api.registry.chainDecimals, api.registry.chainTokens]
  )

  const fiatAmount = useTokenAmountFromPlanck(availableBalance.planck).fiatAmount

  return { availableBalance, fiatAmount }
}

export default useAvailableBalance
