import { ApiPromise, WsProvider } from "@polkadot/api"
import * as AvailJsSdk from "avail-js-sdk"
import { selectorFamily } from "recoil"

export const substrateApiState = selectorFamily<ApiPromise, string | undefined>({
	key: "SubstrateApiState",
	// DO NOT USE any atom dependency here, nothing should invalidate an api object once created
	get: (endpoint) => async () => {
		const isAvail = endpoint && /([/.-]avail-)|([/.-]avail\.)/.test(endpoint)

		if (isAvail)
			return await ApiPromise.create({
				provider: new WsProvider(endpoint),
				types: AvailJsSdk.spec.types,
				rpc: AvailJsSdk.spec.rpc,
				signedExtensions: AvailJsSdk.spec.signedExtensions,
				noInitWarn: true,
			})

		return await ApiPromise.create({ provider: new WsProvider(endpoint), noInitWarn: true })
	},
	dangerouslyAllowMutability: true,
	cachePolicy_UNSTABLE: { eviction: "most-recent" },
})
