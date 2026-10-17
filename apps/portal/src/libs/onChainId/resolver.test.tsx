import { Subscribe } from "@react-rxjs/core"
import { renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { lookupAddresses, resolveNames } = vi.hoisted(() => ({
	lookupAddresses: vi.fn(),
	resolveNames: vi.fn(),
}))

vi.mock("@talismn/on-chain-id", () => ({
	OnChainId: class {
		lookupAddresses = lookupAddresses
		resolveNames = resolveNames
	},
	isPotentialEns: (name: string) => name.endsWith(".eth"),
}))

vi.mock("@/domains/chains/chain-connectors", () => ({ chainConnectors: {} }))

const ALICE = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

const wrapper = ({ children }: { children: ReactNode }) => <Subscribe>{children}</Subscribe>

const load = async () => {
	vi.resetModules()
	return await import("./index")
}

describe("on-chain ids", () => {
	beforeEach(() => {
		localStorage.clear()
		lookupAddresses.mockReset()
		resolveNames.mockReset()
	})

	it("looks an address up once, shows the name and caches it in localStorage", async () => {
		lookupAddresses.mockResolvedValue(new Map([[ALICE, "alice.eth"]]))
		const { useOnChainId } = await load()

		const { result } = renderHook(() => useOnChainId(ALICE), { wrapper })

		expect(result.current[0]).toBeNull()
		await vi.waitFor(() => expect(result.current[0]).toBe("alice.eth"))
		renderHook(() => useOnChainId(ALICE), { wrapper })
		expect(lookupAddresses).toHaveBeenCalledTimes(1)
		expect(lookupAddresses).toHaveBeenCalledWith([ALICE])
		const cached = JSON.parse(localStorage.getItem("talisman-on-chain-ids-cache") ?? "[]")
		expect(cached[0][0]).toBe(ALICE)
		expect(cached[0][1].onChainId).toBe("alice.eth")
	})

	it("answers from the localStorage cache before the lookup resolves", async () => {
		localStorage.setItem(
			"talisman-on-chain-ids-cache",
			JSON.stringify([[ALICE, { onChainId: "cached.eth", updated: Date.now() }]])
		)
		lookupAddresses.mockReturnValue(new Promise(() => undefined))
		const { useOnChainId } = await load()

		const { result } = renderHook(() => useOnChainId(ALICE), { wrapper })

		expect(result.current[0]).toBe("cached.eth")
	})

	it("resolves an ENS name to its address after the debounce, and skips plain addresses", async () => {
		vi.useFakeTimers()
		resolveNames.mockResolvedValue(new Map([["alice.eth", [ALICE, "ens"]]]))
		const { useResolveNsName } = await load()

		const named = renderHook(() => useResolveNsName("alice.eth"), { wrapper })
		const plain = renderHook(() => useResolveNsName(ALICE), { wrapper })
		await vi.advanceTimersByTimeAsync(800)
		vi.useRealTimers()

		await vi.waitFor(() => expect(named.result.current[0]).toBe(ALICE))
		expect(named.result.current[1]).toEqual({
			isNsLookup: true,
			nsLookupType: "ens",
			isNsFetching: false,
		})
		expect(plain.result.current[0]).toBeNull()
		expect(plain.result.current[1].isNsLookup).toBe(false)
		expect(resolveNames).toHaveBeenCalledTimes(1)
	})
})
