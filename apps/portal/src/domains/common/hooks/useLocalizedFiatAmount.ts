import { useMemo } from "react"
import { useSelectedCurrency } from "@/domains/balances/currency"
import { useNativeTokenPrice } from "@/domains/chains/chains"
import type { Decimal } from "@/util/Decimal"

/**
 * TODO: this only works with native token for now
 * refactor this to take a token object instead
 */
export const useNativeTokenLocalizedFiatAmount = (tokenAmount: Decimal | undefined) => {
	const currency = useSelectedCurrency()
	const price = useNativeTokenPrice()

	return useMemo(
		() =>
			tokenAmount
				? (tokenAmount.toNumber() * price).toLocaleString(undefined, {
						style: "currency",
						currency,
					})
				: undefined,
		[currency, price, tokenAmount]
	)
}
