import type { Dispatch, PropsWithChildren, SetStateAction } from "react"
import { createContext, useContext, useLayoutEffect, useState } from "react"
import { StakePosition } from "@/components/recipes/StakePosition"

const PendingLoadsContext = createContext<Dispatch<SetStateAction<number>>>(() => {})

export const StakesLoading = () => {
	const setPendingLoads = useContext(PendingLoadsContext)

	useLayoutEffect(() => {
		setPendingLoads((count) => count + 1)
		return () => setPendingLoads((count) => count - 1)
	}, [setPendingLoads])

	return null
}

export const StakesLoadingSkeleton = ({ children }: PropsWithChildren) => {
	const [pendingLoads, setPendingLoads] = useState(0)

	return (
		<PendingLoadsContext value={setPendingLoads}>
			{children}
			{pendingLoads > 0 && <StakePosition.Skeleton />}
		</PendingLoadsContext>
	)
}
