import { useBalances } from '@talismn/balances-react'
import { formatDecimals } from '@talismn/util'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { formatUnits } from 'viem'

import { writeableEvmAccountsState } from '@/domains/accounts/recoils'
import { DECIMALS, SEEK_TICKER, SEEK_TOKEN_ADDRESS } from '@/domains/staking/seek/constants'
import { Decimal } from '@/util/Decimal'

const useGetSeekAvailableBalance = () => {
  const allBalances = useBalances()
  const ethAccounts = useRecoilValue(writeableEvmAccountsState)

  const seekBalances = allBalances.find(b => b.tokenId === `137-evm-erc20-${SEEK_TOKEN_ADDRESS}`)

  const totalAvailable = useMemo(
    () =>
      seekBalances?.each.reduce((acc, t) => {
        if (!ethAccounts.find(a => a.address === t.address)) return acc
        return acc + t.total.planck
      }, 0n) ?? 0n,
    [seekBalances, ethAccounts]
  )
  const totalAvailableFormatted = formatDecimals(formatUnits(totalAvailable, DECIMALS))

  const availableBalance = Decimal.fromPlanck(totalAvailable, 18, { currency: SEEK_TICKER })

  // TODO: fetch SEEK fiat price
  return { availableBalance: availableBalance, fiatAmount: 0, totalAvailable, totalAvailableFormatted, seekBalances }
}

export default useGetSeekAvailableBalance
