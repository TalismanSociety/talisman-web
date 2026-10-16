import { useRecoilValue } from "recoil"
import { switchMap } from "rxjs"
import { useChainState } from "@/domains/chains/hooks"
import { bindSuspended } from "@/util/loadable"

import { type AprSource, apr$, aprSourceOf } from "../apr"
import { chainRuntimes$ } from "./useRuntimes"

const [usePoolApr] = bindSuspended((genesisHash: string, source: AprSource) =>
	chainRuntimes$(genesisHash).pipe(switchMap((runtimes) => apr$(runtimes, source)))
)

export const useApr = () => {
	const chain = useRecoilValue(useChainState())
	return usePoolApr(chain.genesisHash, aprSourceOf(chain.id))
}
