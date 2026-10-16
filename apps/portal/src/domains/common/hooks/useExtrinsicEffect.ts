import type { EffectCallback } from "react"
import { useEffect } from "react"

import type { TxLoadable } from "@/domains/common/hooks/useTx"

export const useTxInBlockOrErrorEffect = (effect: EffectCallback, txLoadable: TxLoadable) => {
	const inBlock = txLoadable.state === "loading" && txLoadable.contents?.type === "inBestBlock"
	useEffect(() => {
		if (txLoadable.state === "hasError" || inBlock) {
			return effect()
		}
	}, [inBlock, txLoadable.state])
}
