import { Suspense } from "react"
import { useRecoilValue } from "recoil"
import { AnimatedFiatNumber } from "@/components/widgets/AnimatedFiatNumber"
import { selectedCurrencyState } from "@/domains/balances/currency"
import { useSelectedBalances } from "@/domains/balances/hooks"
import { CircularProgressIndicator } from "@/ui/atoms/CircularProgressIndicator"

const TotalSuspense = () => {
	const currency = useRecoilValue(selectedCurrencyState)
	return <AnimatedFiatNumber end={useSelectedBalances().sum.fiat(currency).total} />
}

/** @deprecated */
export const WalletTotal = () => {
	return (
		<Suspense fallback={<CircularProgressIndicator />}>
			<TotalSuspense />
		</Suspense>
	)
}
