import { useCallback, useState } from "react"

export const usePoolSelection = ({
	genesisHash,
	poolIdFromSearch,
	recommendedPoolId,
}: {
	genesisHash: string
	poolIdFromSearch: number | undefined
	recommendedPoolId: number | undefined
}) => {
	const [pickedPoolIds, setPickedPoolIds] = useState<Partial<Record<string, number>>>({})

	const selectedPoolId = pickedPoolIds[genesisHash] ?? poolIdFromSearch ?? recommendedPoolId

	const selectPoolId = useCallback(
		(poolId: number) => setPickedPoolIds((picked) => ({ ...picked, [genesisHash]: poolId })),
		[genesisHash]
	)

	return [selectedPoolId, selectPoolId] as const
}
