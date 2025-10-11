import { formatDecimals } from '@talismn/util'
import { useMemo } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { erc20Abi, formatUnits } from 'viem'
import { useReadContracts } from 'wagmi'

import { writeableEvmAccountsState } from '@/domains/accounts/recoils'
import { tokenPriceState } from '@/domains/chains/recoils'
import {
  CHAIN_ID,
  DECIMALS,
  SEEK_COIN_GECKO_ID,
  SEEK_TICKER,
  SEEK_TOKEN_ADDRESS,
} from '@/domains/staking/seek/constants'
import { Decimal } from '@/util/Decimal'

const useGetSeekAvailableBalance = () => {
  const ethAccounts = useRecoilValue(writeableEvmAccountsState)

  const { data, isLoading, isError, refetch } = useReadContracts({
    allowFailure: false,
    contracts: ethAccounts.map(a => ({
      address: SEEK_TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [a.address],
      chainId: CHAIN_ID,
      enable: ethAccounts.length > 0,
    })),
    query: { refetchInterval: 60_000 },
  })

  const totalAvailable = useMemo(() => {
    if (!data || data.length === 0) return 0n
    return (data as bigint[]).reduce((acc, balance) => acc + balance, 0n)
  }, [data])

  const totalAvailableFormatted = formatDecimals(formatUnits(totalAvailable, DECIMALS))
  const availableBalance = Decimal.fromPlanck(totalAvailable, 18, { currency: SEEK_TICKER })

  const seekBalances = useMemo(() => {
    return {
      tokenId: `137-evm-erc20-${SEEK_TOKEN_ADDRESS}`,
      each: ethAccounts.map((account, index) => ({
        address: account.address,
        total: {
          planck: (data as bigint[])?.[index] || 0n,
        },
      })),
    }
  }, [data, ethAccounts])

  const tokenPriceLoadable = useRecoilValueLoadable(tokenPriceState({ coingeckoId: SEEK_COIN_GECKO_ID }))
  const tokenPrice = tokenPriceLoadable.valueMaybe()
  const fiatAmount = useMemo(() => availableBalance.toNumber() * (tokenPrice ?? 0), [availableBalance, tokenPrice])

  return {
    availableBalance,
    fiatAmount,
    totalAvailable,
    totalAvailableFormatted,
    seekBalances,
    isLoading,
    isError,
    refetch,
  }
}

export default useGetSeekAvailableBalance
