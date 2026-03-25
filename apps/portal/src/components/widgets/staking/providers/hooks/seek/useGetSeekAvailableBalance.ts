import { evmErc20TokenId } from '@talismn/balances-react'
import { formatDecimals } from '@talismn/util'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { erc20Abi, formatUnits } from 'viem'

import { writeableEvmAccountsState } from '@/domains/accounts/recoils'
import { selectedCurrencyState } from '@/domains/balances/currency'
import { tokenPriceState } from '@/domains/chains/recoils'
import { seekPublicClient } from '@/domains/staking/seek/client'
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

  const addresses = ethAccounts.map(a => a.address as `0x${string}`)
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['seek-available-balance', addresses],
    queryFn: async () => {
      if (addresses.length === 0) return [] as bigint[]
      return await seekPublicClient.multicall({
        contracts: addresses.map(address => ({
          address: SEEK_TOKEN_ADDRESS,
          abi: erc20Abi,
          functionName: 'balanceOf' as const,
          args: [address],
        })),
        allowFailure: false,
      })
    },
    enabled: ethAccounts.length > 0,
    refetchInterval: 60_000,
  })

  const totalAvailable = useMemo(() => {
    if (!data || data.length === 0) return 0n
    return (data as bigint[]).reduce((acc, balance) => acc + balance, 0n)
  }, [data])

  const totalAvailableFormatted = formatDecimals(formatUnits(totalAvailable, DECIMALS))
  const availableBalance = Decimal.fromPlanck(totalAvailable, 18, { currency: SEEK_TICKER })

  const tokenPriceLoadable = useRecoilValueLoadable(tokenPriceState({ coingeckoId: SEEK_COIN_GECKO_ID }))
  const tokenPrice = tokenPriceLoadable.valueMaybe()
  const fiatAmount = useMemo(() => availableBalance.toNumber() * (tokenPrice ?? 0), [availableBalance, tokenPrice])
  const currency = useRecoilValue(selectedCurrencyState)
  const tokenId = evmErc20TokenId(CHAIN_ID.toString(), SEEK_TOKEN_ADDRESS)

  const seekBalances = useMemo(() => {
    return {
      tokenId,
      each: ethAccounts.map((account, index) => {
        const planckBalance = (data as bigint[])?.[index] || 0n
        const accountAvailableBalance = Decimal.fromPlanck(planckBalance, 18, { currency: SEEK_TICKER })
        const accountFiatAmount = accountAvailableBalance.toNumber() * (tokenPrice ?? 0)
        return {
          address: account.address,
          total: {
            planck: planckBalance,
          },
          availableBalance: accountAvailableBalance,
          fiatAmount: accountFiatAmount,
          fiatAmountFormatted: accountFiatAmount.toLocaleString(undefined, { style: 'currency', currency }),
        }
      }),
    }
  }, [currency, data, ethAccounts, tokenId, tokenPrice])

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
