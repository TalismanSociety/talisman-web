import { act, renderHook } from "@testing-library/react"
import { RecoilRoot, useRecoilState } from "recoil"
import { describe, expect, it, vi } from "vitest"

import { readOnlyAccountsState } from "./recoils"

vi.mock("@/routes", () => ({ default: { navigate: vi.fn(), subscribe: vi.fn() } }))

const substrateAddress = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
const evmAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

const renderReadonlyAccounts = () =>
	renderHook(() => useRecoilState(readOnlyAccountsState), { wrapper: RecoilRoot })

describe("readonly_accounts", () => {
	it("reads the JSON-encoded accounts", () => {
		localStorage.setItem(
			"readonly_accounts",
			JSON.stringify([{ address: substrateAddress, name: "Alice" }, { address: evmAddress }])
		)

		expect(renderReadonlyAccounts().result.current[0]).toEqual([
			{
				address: substrateAddress,
				name: "Alice",
				origin: "local",
				readonly: true,
				partOfPortfolio: false,
				type: undefined,
			},
			{
				address: evmAddress,
				origin: "local",
				readonly: true,
				partOfPortfolio: false,
				type: "ethereum",
			},
		])
	})

	it("writes the accounts JSON-encoded", () => {
		const { result } = renderReadonlyAccounts()

		act(() => result.current[1]([{ address: substrateAddress, name: "Alice" }]))

		expect(localStorage.getItem("readonly_accounts")).toBe(
			`[{"address":"${substrateAddress}","name":"Alice"}]`
		)
	})
})
