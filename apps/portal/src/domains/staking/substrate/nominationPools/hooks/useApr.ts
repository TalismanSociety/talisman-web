import { switchMap } from "rxjs"
import { useChain } from "@/domains/chains/chains"
import { bindSuspended } from "@/util/loadable"

import { type AprSource, apr$, aprSourceOf } from "../apr"
import { chainRuntimes$ } from "./useRuntimes"

const [usePoolApr] = bindSuspended((genesisHash: string, source: AprSource) =>
	chainRuntimes$(genesisHash).pipe(switchMap((runtimes) => apr$(runtimes, source)))
)

export const useApr = () => {
	const chain = useChain()
	return usePoolApr(chain.genesisHash, aprSourceOf(chain.id))
}
