import { useContext } from "react"
import { map, switchMap } from "rxjs"
import { ChainContext } from "@/domains/chains/contexts"
import { bindSuspended } from "@/util/loadable"

import { runtimes$, watchSessionProgressInputs } from "../chain"
import { sessionProgressOf } from "../era-timing"

export const [useRuntimes, chainRuntimes$] = bindSuspended((genesisHash: string) =>
	runtimes$(genesisHash)
)

export const [useSessionProgress] = bindSuspended((genesisHash: string) =>
	chainRuntimes$(genesisHash).pipe(
		switchMap(({ runtime }) =>
			watchSessionProgressInputs(runtime).pipe(
				map(([indexes, slots]) => sessionProgressOf(runtime.lookup, indexes, slots))
			)
		)
	)
)

export const useGenesisHash = () => useContext(ChainContext).genesisHash
