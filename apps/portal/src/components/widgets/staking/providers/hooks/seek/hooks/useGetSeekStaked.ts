import { useRecoilValue } from 'recoil'
import { formatUnits } from 'viem'
import { useReadContracts } from 'wagmi'

import { writeableEvmAccountsState } from '@/domains/accounts/recoils'
import { Decimal } from '@/util/Decimal'

import {
  CHAIN_ID,
  DECIMALS,
  DEEK_SINGLE_POOL_STAKING_ADDRESS,
  DEEK_TICKER,
} from '../../../../../../../domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '../../../../../../../domains/staking/seek/seekSinglePoolStakingAbi'

const useGetSeekStaked = () => {
  const ethAccounts = useRecoilValue(writeableEvmAccountsState)

  const { data, isLoading, isError, refetch } = useReadContracts({
    allowFailure: false,
    contracts: ethAccounts.map(a => ({
      address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
      abi: seekSinglePoolStakingAbi,
      functionName: 'balanceOf',
      args: [a.address],
      chainId: CHAIN_ID,
      enable: ethAccounts.length > 0,
    })),
    query: { refetchInterval: 60_000 },
  })

  const balances = data
    ? ethAccounts.map((account, i) => ({
        address: account.address,
        amount: (data[i] as bigint) || 0n,
        amountFormatted: formatUnits((data[i] as bigint) || 0n, DECIMALS),
        amountDecimal: Decimal.fromPlanck(data[i] as bigint, DECIMALS ?? 0, { currency: DEEK_TICKER }),
      }))
    : []

  const totalStakedAmount = balances.reduce((total, account) => total + account.amount, 0n)

  const totalStaked = {
    amount: totalStakedAmount,
    amountFormatted: formatUnits(totalStakedAmount, DECIMALS),
  }

  return { data: { balances, totalStaked }, isLoading, isError, refetch }
}

export default useGetSeekStaked
