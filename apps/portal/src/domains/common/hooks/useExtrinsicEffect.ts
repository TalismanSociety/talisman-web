import type { EffectCallback } from "react"
import { useEffect } from "react"

import type { ExtrinsicLoadable } from "@/domains/common/hooks/useExtrinsic"
import type { TxLoadable } from "@/domains/common/hooks/useTx"

export const useExtrinsicInBlockOrErrorEffect = (
	effect: EffectCallback,
	extrinsicLoadable: ExtrinsicLoadable
) => {
	useEffect(() => {
		if (
			extrinsicLoadable.state === "hasError" ||
			(extrinsicLoadable.state === "loading" && extrinsicLoadable.contents?.status.isInBlock)
		) {
			return effect()
		}
	}, [extrinsicLoadable.contents?.status?.isInBlock, extrinsicLoadable.state])
}

export const useTxInBlockOrErrorEffect = (effect: EffectCallback, txLoadable: TxLoadable) => {
	const inBlock = txLoadable.state === "loading" && txLoadable.contents?.type === "inBestBlock"
	useEffect(() => {
		if (txLoadable.state === "hasError" || inBlock) {
			return effect()
		}
	}, [inBlock, txLoadable.state])
}
