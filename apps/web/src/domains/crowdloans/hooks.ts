import { DANGEROUS_SELECTED_SUBSTRATE_ACCOUNTS_STATE } from '@domains/accounts/recoils'
import { usePortfolio } from '@libs/portfolio'
import { encodeAnyAddress } from '@talismn/util'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

export const useTotalCrowdloanTotalFiatAmount = () => {
  const accounts = useRecoilValue(DANGEROUS_SELECTED_SUBSTRATE_ACCOUNTS_STATE)
  const { totalCrowdloansUsdByAddress } = usePortfolio()
  const genericAccounts = useMemo(
    () => accounts?.map(x => x.address).map(account => encodeAnyAddress(account, 42)),
    [accounts]
  )
  return useMemo(
    () =>
      Object.entries(totalCrowdloansUsdByAddress || {})
        .filter(([address]) => genericAccounts?.includes(address))
        .map(([, crowdloansUsd]) => crowdloansUsd)
        .reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
        .toNumber(),
    [totalCrowdloansUsdByAddress, genericAccounts]
  )
}
