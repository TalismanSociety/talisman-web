import { act, renderHook } from "@testing-library/react"
import { RecoilRoot, useRecoilState } from "recoil"
import { describe, expect, it, vi } from "vitest"

import { connectedSubstrateWalletIdState } from "./substrate"

vi.mock("@/routes", () => ({ default: { navigate: vi.fn(), subscribe: vi.fn() } }))

const renderConnectedWalletId = () =>
	renderHook(() => useRecoilState(connectedSubstrateWalletIdState), { wrapper: RecoilRoot })

describe("connected-substrate-extension", () => {
	it("reads the JSON-encoded wallet id", () => {
		localStorage.setItem("connected-substrate-extension", '"talisman"')

		expect(renderConnectedWalletId().result.current[0]).toBe("talisman")
	})

	it("writes the wallet id JSON-encoded", () => {
		const { result } = renderConnectedWalletId()

		act(() => result.current[1]("polkadot-js"))

		expect(localStorage.getItem("connected-substrate-extension")).toBe('"polkadot-js"')
	})
})
