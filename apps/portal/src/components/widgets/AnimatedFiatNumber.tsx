import { useMemo } from "react"
import { RedactableBalance } from "@/components/widgets/RedactableBalance"
import { currencyConfig, useSelectedCurrency } from "@/domains/balances/currency"
import { AnimatedNumber } from "@/ui/atoms/AnimatedNumber"

export type AnimatedFiatNumberProps = {
	animate?: boolean
	end: number
	currency?: string
}

export const AnimatedFiatNumber = ({
	animate = true,
	end,
	currency: propsCurrency,
}: AnimatedFiatNumberProps) => {
	const selectedCurrency = useSelectedCurrency()
	const currency = (propsCurrency ?? selectedCurrency) as keyof typeof currencyConfig

	const formatter = useMemo(
		() =>
			(value: number): string =>
				Intl.NumberFormat(undefined, {
					style: "currency",
					currency,
					currencyDisplay: "code",
				})
					.format(value)
					.toLowerCase()
					.replace(currency, currencyConfig[currency]?.symbol ?? currency.toUpperCase()),
		[currency]
	)

	return (
		<RedactableBalance>
			<AnimatedNumber animate={animate} end={end} decimals={2} formatter={formatter} />
		</RedactableBalance>
	)
}
