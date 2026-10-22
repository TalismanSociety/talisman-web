import { useEffect, useState } from "react"

export const usePoolSelection = ({
	genesisHash: _genesisHash,
	poolIdFromSearch,
	recommendedPoolId,
}: {
	genesisHash: string
	poolIdFromSearch: number | undefined
	recommendedPoolId: number | undefined
}) => {
	const initialPoolId = poolIdFromSearch ?? recommendedPoolId
	const [selectedPoolId, setSelectedPoolId] = useState(initialPoolId)
	useEffect(() => setSelectedPoolId(initialPoolId), [initialPoolId])
	return [selectedPoolId, setSelectedPoolId] as const
}
