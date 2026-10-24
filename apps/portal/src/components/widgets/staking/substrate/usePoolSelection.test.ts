import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { usePoolSelection } from "./usePoolSelection"

const polkadot = { genesisHash: "0x91b1", recommendedPoolId: 12 }
const kusama = { genesisHash: "0xb0a8", recommendedPoolId: 80 }

const renderPoolSelection = (poolIdFromSearch?: number) =>
	renderHook((chain: typeof polkadot) => usePoolSelection({ ...chain, poolIdFromSearch }), {
		initialProps: polkadot,
	})

describe("usePoolSelection", () => {
	it("defaults to the first recommended pool of each chain", () => {
		const { result, rerender } = renderPoolSelection()
		expect(result.current[0]).toBe(12)

		rerender(kusama)
		expect(result.current[0]).toBe(80)
	})

	it("restores the pool picked on a chain after switching away and back", () => {
		const { result, rerender } = renderPoolSelection()
		act(() => result.current[1](34))

		rerender(kusama)
		expect(result.current[0]).toBe(80)

		rerender(polkadot)
		expect(result.current[0]).toBe(34)
	})

	it("prefers the pool id from the URL over the recommended pool", () => {
		const { result, rerender } = renderPoolSelection(7)
		expect(result.current[0]).toBe(7)

		rerender(kusama)
		rerender(polkadot)
		expect(result.current[0]).toBe(7)
	})

	it("lets a pick replace the pool id from the URL", () => {
		const { result, rerender } = renderPoolSelection(7)
		act(() => result.current[1](34))

		rerender(kusama)
		rerender(polkadot)
		expect(result.current[0]).toBe(34)
	})
})
