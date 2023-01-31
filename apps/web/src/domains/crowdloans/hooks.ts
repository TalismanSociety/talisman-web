import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { usePortfolio } from '@libs/portfolio'
import { encodeAnyAddress } from '@talismn/util'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

export const useTotalCrowdloanTotalFiatAmount = () => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState).map(x => x.address)
  const { totalCrowdloansUsdByAddress } = usePortfolio()
  const genericAccounts = useMemo(() => accounts?.map(account => encodeAnyAddress(account, 42)), [accounts])
  return useMemo(
    () =>
      Object.entries(totalCrowdloansUsdByAddress || {})
        .filter(([address]) => genericAccounts && genericAccounts.includes(address))
        .map(([, crowdloansUsd]) => crowdloansUsd)
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
        .toNumber(),
    [totalCrowdloansUsdByAddress, genericAccounts]
  )
}
