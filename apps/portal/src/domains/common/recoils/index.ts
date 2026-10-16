import type { ApiPromise } from "@polkadot/api"
import { selectorFamily } from "recoil"

import { chainReadId$ } from "@/domains/common/chainReadId"
import { atomFromSubject } from "@/domains/common/recoil-bridge"
import { substrateApiState } from "@/domains/common/recoils/api"
import { connectedSubstrateWalletState } from "@/domains/extension/substrate"

export const paymentInfoState = selectorFamily({
	key: "PaymentInfo",
	get:
		<
			TModule extends keyof PickKnownKeys<ApiPromise["tx"]>,
			TSection extends keyof PickKnownKeys<ApiPromise["tx"][TModule]>,
			TParams extends Parameters<ApiPromise["tx"][TModule][TSection]>,
		>([endpoint, module, section, account, ...params]: [
			string,
			TModule,
			TSection,
			string,
			...TParams,
		]) =>
		async ({ get }) => {
			const api = get(substrateApiState(endpoint))
			const extension = get(connectedSubstrateWalletState)

			return await api.tx[module]
				?.[section]?.(...params)
				.paymentInfo(account, { signer: extension?.signer })
		},
	// NOTE: polkadot.js returned codec object includes reference to the registry
	// which shouldn't be freezed
	dangerouslyAllowMutability: true,
})

export const chainReadIdState = atomFromSubject("ChainReadId", chainReadId$)
