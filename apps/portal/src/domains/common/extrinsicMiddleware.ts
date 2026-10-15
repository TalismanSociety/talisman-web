import type { SubmittableExtrinsic } from "@polkadot/api/types"
import type { GenericCall } from "@polkadot/types"
import type { ISubmittableResult } from "@polkadot/types/types"
import type { Vec } from "@polkadot/types-codec"
import { startTransition } from "react"
import type { CallbackInterface } from "recoil"

import { track } from "@/domains/analytics/client"
import { callOf, palletOf, substrateChainOf } from "@/domains/analytics/events/transactions"
import { chainReadIdState } from "@/domains/common/recoils"

type Tag = "analytics"

export type ExtrinsicMiddleware = (
	chainId: string,
	extrinsic:
		| SubmittableExtrinsic<"promise", ISubmittableResult>
		| SubmittableExtrinsic<"rxjs", ISubmittableResult>,
	result: ISubmittableResult,
	callbackInterface: CallbackInterface,
	options?: {
		blacklist?: Tag[]
	}
) => unknown

const combineMiddleware =
	(...middleware: ExtrinsicMiddleware[]): ExtrinsicMiddleware =>
	(...parameters) =>
		middleware.forEach((middleware) => {
			middleware(...parameters)
		})

const analyticsMiddleware: ExtrinsicMiddleware = (chainId, extrinsic, result, _, options) => {
	if (options?.blacklist?.includes("analytics")) {
		return
	}

	if (result.status.isInBlock && result.dispatchError === undefined) {
		const chain = substrateChainOf(chainId)
		const rootCall = {
			module: palletOf(extrinsic.method.section),
			section: callOf(extrinsic.method.method),
		}

		track("Extrinsic in block", { chain, ...rootCall })

		if (extrinsic.method.section === "utility" && extrinsic.method.method.includes("batch")) {
			;(extrinsic.args as Array<Vec<GenericCall>>).forEach((calls) => {
				calls.forEach((call) => {
					track("Extrinsic in block", {
						chain,
						module: palletOf(call.section),
						section: callOf(call.method),
						parent_module: rootCall.module,
						parent_section: rootCall.section,
					})
				})
			})
		}
	}
}

const chainIdReadMiddleware: ExtrinsicMiddleware = (_, __, result, { set }) => {
	if (result.isFinalized) {
		startTransition(() => set(chainReadIdState, (id) => id + 1))
	}
}

export const extrinsicMiddleware = combineMiddleware(chainIdReadMiddleware, analyticsMiddleware)
