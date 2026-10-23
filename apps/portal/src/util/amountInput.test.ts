import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { isAmountInput, useAmountInputState } from "./amountInput"
import { Decimal } from "./Decimal"

describe("isAmountInput", () => {
	it("accepts an empty input", () => {
		expect(isAmountInput("", 10)).toBe(true)
	})

	it("accepts partial amounts typed one character at a time", () => {
		expect(isAmountInput("1", 10)).toBe(true)
		expect(isAmountInput("1.", 10)).toBe(true)
		expect(isAmountInput(".", 10)).toBe(true)
		expect(isAmountInput(".5", 10)).toBe(true)
		expect(isAmountInput("0.25", 10)).toBe(true)
	})

	it("accepts a pasted amount", () => {
		expect(isAmountInput("1234.5678", 10)).toBe(true)
	})

	it("accepts exactly the token's decimals and rejects one more", () => {
		expect(isAmountInput("1.0123456789", 10)).toBe(true)
		expect(isAmountInput("1.01234567891", 10)).toBe(false)
	})

	it("accepts a 15 digit integer part and rejects 16 digits", () => {
		expect(isAmountInput("123456789012345", 10)).toBe(true)
		expect(isAmountInput("1234567890123456", 10)).toBe(false)
		expect(isAmountInput("1234567890123456.5", 10)).toBe(false)
	})

	it("accepts the Max amount of a balance", () => {
		const tenDecimalsMax = Decimal.fromPlanck(123456789012345678901n, 10).toString()
		const eighteenDecimalsMax = Decimal.fromPlanck(1234567890123456789012n, 18).toString()

		expect(isAmountInput(tenDecimalsMax, 10)).toBe(true)
		expect(isAmountInput(eighteenDecimalsMax, 18)).toBe(true)
	})

	it("rejects digits typed after a Max amount that already uses every decimal", () => {
		const max = Decimal.fromPlanck(1234567890123456789012n, 18).toString()

		expect(isAmountInput(`${max}3`, 18)).toBe(false)
	})

	it("rejects non numeric input", () => {
		expect(isAmountInput("1e5", 10)).toBe(false)
		expect(isAmountInput("-1", 10)).toBe(false)
		expect(isAmountInput("1.2.3", 10)).toBe(false)
		expect(isAmountInput(" 1", 10)).toBe(false)
		expect(isAmountInput("abc", 10)).toBe(false)
	})
})

describe("useAmountInputState", () => {
	it("keeps the previous amount when the next one is rejected", () => {
		const { result } = renderHook(() => useAmountInputState(2))

		act(() => result.current[1]("1.25"))
		expect(result.current[0]).toBe("1.25")

		act(() => result.current[1]("1.255"))
		expect(result.current[0]).toBe("1.25")

		act(() => result.current[1]("1.2"))
		expect(result.current[0]).toBe("1.2")
	})
})
