import { formatDistance } from "date-fns"
import { useRecoilValue } from "recoil"
import { switchMap } from "rxjs"
import { useChainState } from "@/domains/chains/hooks"
import { bindSuspended } from "@/util/loadable"

import { areNominatorsSlashable } from "../chain"
import {
	expectedBlockTimeMs,
	expectedSessionTimeMs,
	fastUnbondDuration,
	nominatorBondingDurationEras,
	stakingEraDurationMs,
} from "../era-timing"
import { chainRuntimes$, useRuntimes, useSessionProgress } from "./useRuntimes"

const ASSET_HUB_CHAIN_IDS = new Set(["kusama-asset-hub", "polkadot-asset-hub"])

const [useAreNominatorsSlashable] = bindSuspended((genesisHash: string) =>
	chainRuntimes$(genesisHash).pipe(
		switchMap(({ runtime }) =>
			fastUnbondDuration(runtime.lookup) === undefined ? [true] : areNominatorsSlashable(runtime)
		)
	)
)

export const useLocalizedUnlockDuration = () => formatDistance(0, useUnlockDuration())

export const useUnlockDuration = () => {
	const chain = useRecoilValue(useChainState())
	const { runtime, babeRuntime } = useRuntimes(chain.genesisHash)
	const sessionProgress = useSessionProgress(chain.genesisHash)
	const slashable = useAreNominatorsSlashable(chain.genesisHash)
	const eras = nominatorBondingDurationEras(runtime.lookup, slashable)

	if (ASSET_HUB_CHAIN_IDS.has(chain.id)) {
		return eras * stakingEraDurationMs(babeRuntime.lookup, runtime.lookup)
	}
	const erasOrSessions = sessionProgress.eraLength * eras
	return sessionProgress.isEpoch
		? erasOrSessions * expectedBlockTimeMs(runtime.lookup)
		: erasOrSessions * expectedSessionTimeMs(runtime.lookup)
}
