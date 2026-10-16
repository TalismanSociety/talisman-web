import type { ApiPromise } from "@polkadot/api"
import type { NetworkId } from "@talismn/chaindata-provider"
import { selector, useRecoilValue } from "recoil"

import { substrateApiState } from "@/domains/common/recoils/api"

import { useNominationPoolsEndpoint } from "./useNominationPoolsEndpoint"

const noBabeApiState = selector<ApiPromise | null>({ key: "NoBabeApi", get: () => null })

export const useBabeApi = (chainId: NetworkId | null | undefined): ApiPromise | null => {
	const endpoint = useNominationPoolsEndpoint(chainId)
	return useRecoilValue(endpoint ? substrateApiState(endpoint) : noBabeApiState)
}
