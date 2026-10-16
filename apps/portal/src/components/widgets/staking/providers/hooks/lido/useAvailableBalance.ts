import { useMemo } from "react"
import { useRecoilValue } from "recoil"

import { selectedCurrencyState } from "@/domains/balances/currency"
import { useSelectedBalances } from "@/domains/balances/hooks"
import { Decimal } from "@/util/Decimal"

const useAvailableBalance = (symbol: string) => {
	const balances = useSelectedBalances()
	const currency = useRecoilValue(selectedCurrencyState)
	const nativeBalance = balances.find((x) => x.token?.symbol.toLowerCase() === symbol.toLowerCase())
	return useMemo(
		() => ({
			availableBalance: Decimal.fromPlanck(
				nativeBalance.sum.planck.transferable ?? 0n,
				nativeBalance.each.at(0)?.decimals ?? 0,
				{
					currency: symbol,
				}
			),
			fiatAmount: nativeBalance.sum.fiat(currency).total,
		}),
		[currency, symbol, nativeBalance.each, nativeBalance.sum]
	)
}

export default useAvailableBalance
