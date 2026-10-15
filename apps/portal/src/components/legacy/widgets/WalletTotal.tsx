import { Suspense } from "react"
import { useRecoilValue } from "recoil"
import { AnimatedFiatNumber } from "@/components/widgets/AnimatedFiatNumber"
import { selectedBalancesFiatSumState } from "@/domains/balances/recoils"
import { CircularProgressIndicator } from "@/ui/atoms/CircularProgressIndicator"

const TotalSuspense = () => {
	return <AnimatedFiatNumber end={useRecoilValue(selectedBalancesFiatSumState).total} />
}

/** @deprecated */
export const WalletTotal = () => {
	return (
		<Suspense fallback={<CircularProgressIndicator />}>
			<TotalSuspense />
		</Suspense>
	)
}
