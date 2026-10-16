import { addMilliseconds, formatDistanceToNow } from "date-fns"
import { useCallback } from "react"

import { eraEtaMs } from "../era-timing"
import { useGenesisHash, useRuntimes, useSessionProgress } from "./useRuntimes"

export const useEraEtaFormatter = () => {
	const genesisHash = useGenesisHash()
	const { babeRuntime } = useRuntimes(genesisHash)
	const sessionProgress = useSessionProgress(genesisHash)

	return useCallback(
		(erasOrSessions: number) =>
			formatDistanceToNow(
				addMilliseconds(new Date(), eraEtaMs(erasOrSessions, sessionProgress, babeRuntime.lookup))
			),
		[babeRuntime.lookup, sessionProgress]
	)
}
