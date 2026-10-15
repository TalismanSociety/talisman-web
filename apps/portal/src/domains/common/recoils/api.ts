import { ApiPromise, WsProvider } from "@polkadot/api"
import * as AvailJsSdk from "avail-js-sdk"
import { selectorFamily } from "recoil"

// TODO: Convert this into a facade for the `@/domains/common/atoms/apiPromiseAtom.ts` atom.
//
// That atom is superior to this one because:
// a) It uses jotai (our preferred state management tool) instead of recoil.
// b) It proxies websocket requests through to Talisman Wallet,
//    so that users can maintain the one websocket connection per chain across both Talisman Wallet and Talisman Portal.
// For Talisman Wallet users, this means there will be zero websocket overhead when browsing Talisman Portal.
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
