import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { formatUnits } from 'viem'
import { useReadContracts } from 'wagmi'

import { writeableEvmAccountsState } from '@/domains/accounts/recoils'
import { tokenPriceState } from '@/domains/chains/recoils'
import { Decimal } from '@/util/Decimal'

import {
  CHAIN_ID,
  DECIMALS,
  SEEK_COIN_GECKO_ID,
  SEEK_SINGLE_POOL_STAKING_ADDRESS,
  SEEK_TICKER,
} from '../../../../../../domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '../../../../../../domains/staking/seek/seekSinglePoolStakingAbi'

const useGetSeekStaked = () => {
  const ethAccounts = useRecoilValue(writeableEvmAccountsState)
  const tokenPriceLoadable = useRecoilValueLoadable(tokenPriceState({ coingeckoId: SEEK_COIN_GECKO_ID }))
  const tokenPrice = tokenPriceLoadable.valueMaybe()

  const { data, isLoading, isError, refetch } = useReadContracts({
    allowFailure: false,
    contracts: ethAccounts.map(a => ({
      address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
      abi: seekSinglePoolStakingAbi,
      functionName: 'balanceOf',
      args: [a.address],
      chainId: CHAIN_ID,
      enable: ethAccounts.length > 0,
    })),
    query: { refetchInterval: 60_000 },
  })

  const balances = data
    ? ethAccounts.map((account, i) => {
        const amountDecimal = Decimal.fromPlanck(data[i] as bigint, DECIMALS ?? 0, { currency: SEEK_TICKER })
        return {
          address: account.address,
          amount: (data[i] as bigint) || 0n,
          amountFormatted: formatUnits((data[i] as bigint) || 0n, DECIMALS),
          amountDecimal,
          fiatBalance: amountDecimal.toNumber() * (tokenPrice ?? 0),
        }
      })
    : []

  const totalStakedAmount = balances.reduce((total, account) => total + account.amount, 0n)

  const totalStaked = {
    amount: totalStakedAmount,
    amountFormatted: formatUnits(totalStakedAmount, DECIMALS),
  }

  return { data: { balances, totalStaked }, isLoading, isError, refetch }
}

export default useGetSeekStaked
