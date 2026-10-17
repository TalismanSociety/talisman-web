import { Subscribe } from "@react-rxjs/core"
import { act, renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const wrapper = ({ children }: { children: ReactNode }) => <Subscribe>{children}</Subscribe>

const loadCurrency = async () => {
	vi.resetModules()
	return await import("./currency")
}

describe("selected-currency", () => {
	beforeEach(() => localStorage.clear())

	it("reads a JSON-encoded currency main stored", async () => {
		localStorage.setItem("selected-currency", '"eur"')
		const { useSelectedCurrency } = await loadCurrency()

		expect(renderHook(() => useSelectedCurrency(), { wrapper }).result.current).toBe("eur")
	})

	it("writes the currency JSON-encoded and renders it", async () => {
		const { setSelectedCurrency, useSelectedCurrency } = await loadCurrency()
		const { result } = renderHook(() => useSelectedCurrency(), { wrapper })

		act(() => setSelectedCurrency("gbp"))

		expect(result.current).toBe("gbp")
		expect(localStorage.getItem("selected-currency")).toBe('"gbp"')
	})

	it("falls back to usd for an unknown value and leaves the stored value alone", async () => {
		localStorage.setItem("selected-currency", '"xyz"')
		const { useSelectedCurrency } = await loadCurrency()

		expect(renderHook(() => useSelectedCurrency(), { wrapper }).result.current).toBe("usd")
		expect(localStorage.getItem("selected-currency")).toBe('"xyz"')
	})

	it("defaults to usd and writes nothing when the key is absent", async () => {
		const { useSelectedCurrency } = await loadCurrency()

		expect(renderHook(() => useSelectedCurrency(), { wrapper }).result.current).toBe("usd")
		expect(localStorage.getItem("selected-currency")).toBeNull()
	})
})
