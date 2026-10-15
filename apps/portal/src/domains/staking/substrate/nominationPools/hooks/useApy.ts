import { useApr } from "./useApr"

export const useApy = (compoundingPeriodCount: number = 365) => {
	const apr = useApr()
	return (1 + apr / compoundingPeriodCount) ** compoundingPeriodCount - 1
}
