import { formatDecimals } from "@talismn/util"
import { useMemo } from "react"
import { erc20Abi, formatUnits } from "viem"
import { useReadContracts } from "wagmi"

import { useWriteableEvmAccounts } from "@/domains/accounts/accounts"
import { useSelectedCurrency } from "@/domains/balances/currency"
import { useTokenPriceLoadable } from "@/domains/balances/token-rates"
import {
	CHAIN_ID,
	DECIMALS,
	SEEK_TICKER,
	SEEK_TOKEN_ADDRESS,
	SEEK_TOKEN_ID,
} from "@/domains/staking/seek/constants"
import { Decimal } from "@/util/Decimal"
import { loadableData } from "@/util/loadable"

const useGetSeekAvailableBalance = () => {
	const ethAccounts = useWriteableEvmAccounts()

	const { data, isLoading, isError, refetch } = useReadContracts({
		allowFailure: false,
		contracts: ethAccounts.map((a) => ({
			address: SEEK_TOKEN_ADDRESS,
			abi: erc20Abi,
			functionName: "balanceOf",
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

	const tokenPrice = loadableData(useTokenPriceLoadable(SEEK_TOKEN_ID))
	const fiatAmount = useMemo(
		() => availableBalance.toNumber() * (tokenPrice ?? 0),
		[availableBalance, tokenPrice]
	)
	const currency = useSelectedCurrency()

	const seekBalances = useMemo(() => {
		return {
			tokenId: SEEK_TOKEN_ID,
			each: ethAccounts.map((account, index) => {
				const planckBalance = (data as bigint[])?.[index] || 0n
				const accountAvailableBalance = Decimal.fromPlanck(planckBalance, 18, {
					currency: SEEK_TICKER,
				})
				const accountFiatAmount = accountAvailableBalance.toNumber() * (tokenPrice ?? 0)
				return {
					address: account.address,
					total: {
						planck: planckBalance,
					},
					availableBalance: accountAvailableBalance,
					fiatAmount: accountFiatAmount,
					fiatAmountFormatted: accountFiatAmount.toLocaleString(undefined, {
						style: "currency",
						currency,
					}),
				}
			}),
		}
	}, [currency, data, ethAccounts, tokenPrice])

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
