import { firstValueFrom, Observable } from "rxjs"

import { getChainRuntime$ } from "@/domains/chains/chain-runtime"

import { eraInputs, stakerInputs, validatorLegacyClaimedRewards } from "./chain"
import { exposedValidators, stakerRewardsOf } from "./rewards"

export type StakerRewardsRequest = { genesisHash: string; stashes: string[]; activeEra: number }

export type StakerRewards = Record<string, bigint>

export type StakerRewardsResponse = { rewards: StakerRewards } | { error: string }

const rewardEras = (activeEra: number) => [activeEra - 1, activeEra].filter((era) => era >= 0)

export const stakerRewards = async ({
	genesisHash,
	stashes,
	activeEra,
}: StakerRewardsRequest): Promise<StakerRewards> => {
	const runtime = await firstValueFrom(getChainRuntime$(genesisHash))
	try {
		const [eras, stakers] = await Promise.all([
			Promise.all(rewardEras(activeEra).map((era) => eraInputs(runtime, era))),
			stakerInputs(runtime, stashes, activeEra - 1),
		])
		const validators = new Set(
			stashes.flatMap((stash) => eras.flatMap((inputs) => exposedValidators(inputs, stash)))
		)
		const legacyClaimed = await validatorLegacyClaimedRewards(runtime, [...validators])
		return Object.fromEntries(
			stakers.map((staker) => [staker.stash, stakerRewardsOf(eras, staker, legacyClaimed)])
		)
	} finally {
		runtime.client.destroy()
	}
}

export const stakerRewardsInWorker$ = (request: StakerRewardsRequest) =>
	new Observable<StakerRewards>((subscriber) => {
		const worker = new Worker(new URL("./worker", import.meta.url), { type: "module" })
		worker.onmessage = ({ data }: MessageEvent<StakerRewardsResponse>) => {
			if ("error" in data) subscriber.error(new Error(data.error))
			else {
				subscriber.next(data.rewards)
				subscriber.complete()
			}
		}
		worker.onerror = (event) => subscriber.error(event.error ?? new Error(event.message))
		worker.postMessage(request)
		return () => worker.terminate()
	})
