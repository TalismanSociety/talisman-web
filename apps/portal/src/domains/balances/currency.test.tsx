import { act, renderHook } from "@testing-library/react"
import { RecoilRoot, useRecoilState } from "recoil"
import { describe, expect, it } from "vitest"

import { selectedCurrencyState } from "./currency"

const renderSelectedCurrency = () =>
	renderHook(() => useRecoilState(selectedCurrencyState), { wrapper: RecoilRoot })

describe("selected-currency", () => {
	it("reads a JSON-encoded currency", () => {
		localStorage.setItem("selected-currency", '"eur"')

		expect(renderSelectedCurrency().result.current[0]).toBe("eur")
	})

	it("writes the currency JSON-encoded", () => {
		const { result } = renderSelectedCurrency()

		act(() => result.current[1]("gbp"))

		expect(localStorage.getItem("selected-currency")).toBe('"gbp"')
	})

	it("falls back to usd for an unknown value", () => {
		localStorage.setItem("selected-currency", '"xyz"')

		expect(renderSelectedCurrency().result.current[0]).toBe("usd")
	})
})
