import "@/zod-jitless"

import {
	type StakerRewardsRequest,
	type StakerRewardsResponse,
	stakerRewards,
} from "./stakerRewards"

const respond = (response: StakerRewardsResponse) => self.postMessage(response)

self.onmessage = ({ data }: MessageEvent<StakerRewardsRequest>) => {
	stakerRewards(data).then(
		(rewards) => respond({ rewards }),
		(error: unknown) => respond({ error: error instanceof Error ? error.message : String(error) })
	)
}
