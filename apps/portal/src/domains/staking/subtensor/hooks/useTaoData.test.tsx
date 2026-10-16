import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCombinedBittensorValidatorsData } from "./useCombinedBittensorValidatorsData"
import { useCombineSubnetData } from "./useCombineSubnetData"

const { getBittensorValidators, getSubnetPools, getValidatorYields } = vi.hoisted(() => ({
	getBittensorValidators: vi.fn(),
	getSubnetPools: vi.fn(),
	getValidatorYields: vi.fn(),
}))

vi.mock("../tda.functions", () => ({ getBittensorValidators, getSubnetPools, getValidatorYields }))
vi.mock("@/hooks/useSearchParams", () => ({
	useSearchParams: () => [new URLSearchParams("netuid=46")],
}))

const wrapper = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
		{children}
	</QueryClientProvider>
)

const YUMA = "5DXdHixxtCvoa6GHKs2Jgrdzc61882Ftx1zN2sYFQuwgL1S1"

describe("useCombinedBittensorValidatorsData", () => {
	beforeEach(() => {
		getBittensorValidators.mockResolvedValue([
			{
				hotkey: YUMA,
				name: "Yuma, a DCG Company",
				global_weighted_stake: "328303810249707",
				global_nominators: 2647,
			},
			{ hotkey: "5Other", name: "Other", global_weighted_stake: "1", global_nominators: 3 },
		])
		getValidatorYields.mockResolvedValue([{ hotkey: YUMA, thirty_day_apy: 0.4428150862607598 }])
	})

	it("joins each validator with its yield on the netuid in the URL", async () => {
		const { result } = renderHook(() => useCombinedBittensorValidatorsData(), { wrapper })

		await waitFor(() =>
			expect(result.current.combinedValidatorsData[0]?.validatorYield).toBeDefined()
		)

		expect(getValidatorYields).toHaveBeenCalledWith({ data: { netuid: 46 } })
		expect(result.current.combinedValidatorsData).toEqual([
			{
				poolId: YUMA,
				name: "Yuma, a DCG Company",
				totalStaked: 328303810249707,
				totalStakers: 2647,
				hasData: true,
				isError: false,
				validatorYield: { hotkey: YUMA, thirty_day_apy: 0.4428150862607598 },
			},
			{
				poolId: "5Other",
				name: "Other",
				totalStaked: 1,
				totalStakers: 3,
				hasData: true,
				isError: false,
				validatorYield: undefined,
			},
		])
	})

	it("asks for the netuid it is given over the URL's", async () => {
		renderHook(() => useCombinedBittensorValidatorsData(0), { wrapper })

		await waitFor(() => expect(getValidatorYields).toHaveBeenCalledWith({ data: { netuid: 0 } }))
	})

	it("reports an error with no validators on a host that answers server functions with the SPA shell", async () => {
		const shell = new Response("<!DOCTYPE html>", { headers: { "Content-Type": "text/html" } })
		getBittensorValidators.mockResolvedValue(shell)
		getValidatorYields.mockResolvedValue(shell)

		const { result } = renderHook(() => useCombinedBittensorValidatorsData(), { wrapper })

		await waitFor(() => expect(result.current.isError).toBe(true))
		expect(result.current.combinedValidatorsData).toEqual([])
	})
})

describe("useCombineSubnetData", () => {
	it("names every chaindata subnet at once, then adds its pool reserves", async () => {
		getSubnetPools.mockResolvedValue([
			{ netuid: 46, total_tao: "23027462881153", total_alpha: "6135710069537335" },
		])
		const { result } = renderHook(() => useCombineSubnetData(), { wrapper })

		expect(result.current.subnetData[46]).toEqual({
			netuid: 46,
			descriptionName: expect.any(String),
			symbol: expect.any(String),
		})

		await waitFor(() => expect(result.current.subnetData[46]?.total_tao).toBe("23027462881153"))
		expect(result.current.subnetData[46]?.total_alpha).toBe("6135710069537335")
		expect(result.current.subnetData[0]).toEqual({
			netuid: 0,
			descriptionName: "Root",
			symbol: "TAO",
		})
		expect(result.current.isError).toBe(false)
	})
})
