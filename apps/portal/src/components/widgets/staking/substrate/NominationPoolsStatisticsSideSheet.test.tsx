import { cleanup, fireEvent, screen } from "@testing-library/react"
import { Suspense } from "react"
import { of } from "rxjs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderInPortal, stubModalDialogs } from "@/components/widgets/PrivacySettings/testShell"
import { alice } from "@/domains/extension/substrate.fixtures"
import type { DerivedPool } from "@/domains/staking/substrate/nominationPools/hooks"
import { Decimal } from "@/util/Decimal"
import NominationPoolsStatisticsSideSheet from "./NominationPoolsStatisticsSideSheet"

const KUSAMA_ASSET_HUB_SUBSCAN = "https://assethub-kusama.subscan.io/"

const { chain, apr, poolLookup } = vi.hoisted(() => ({
	chain: { genesisHash: "0x01", subscanUrl: undefined as string | undefined },
	apr: { state: "loaded" as "loaded" | "failed" | "loading" },
	poolLookup: { fail: false },
}))

const account = { ...alice, origin: "substrate" } as unknown as DerivedPool["account"]

const pool = {
	account,
	poolName: "Talisman Pool 1",
	status: "earning_rewards",
	poolMember: { pool_id: 1, points: 37_000_000_000n },
	unlockings: [],
} as unknown as DerivedPool

vi.mock("@/domains/chains/chains", () => ({
	useChain: () => chain,
	useNativeTokenDecimal: () => ({
		fromPlanck: (planck: bigint) => Decimal.fromPlanck(planck, 12, { currency: "KSM" }),
	}),
}))
vi.mock("@/domains/common/hooks/useTokenAmount", () => ({
	useTokenAmountFromPlanck: (planck: bigint) => ({
		decimalAmount: Decimal.fromPlanck(planck, 12, { currency: "KSM" }),
	}),
}))
vi.mock("@/domains/staking/substrate/nominationPools/hooks", () => ({
	usePoolStakes: () => {
		if (poolLookup.fail) throw new Error("Pool lookup failed")
		return pool
	},
	useApr: () => {
		if (apr.state === "failed") throw new Error("APR unavailable")
		if (apr.state === "loading") throw new Promise(() => {})
		return 0.12
	},
}))
vi.mock("@/domains/staking/substrate/nominationPools/hooks/useBalances", () => ({
	useChainToken: () => ({ decimals: 12, symbol: "KSM" }),
}))
vi.mock("@/domains/staking/substrate/nominationPools/hooks/useEraEta", () => ({
	useEraEtaFormatter: () => () => "about 5 hours",
}))
vi.mock("@/domains/staking/substrate/nominationPools/hooks/useRuntimes", () => ({
	chainRuntimes$: () => of({ runtime: {} }),
}))
vi.mock("@/domains/staking/substrate/nominationPools/chain", () => ({
	chainTokenOf: () => ({ decimals: 12, symbol: "KSM" }),
	ss58PrefixOf: () => 42,
}))

const subscanAnswers = (status: number, body: unknown) =>
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(JSON.stringify(body), { status }))
	)

const renderSheet = () =>
	renderInPortal(
		<Suspense fallback="Positions skeleton">
			<NominationPoolsStatisticsSideSheet pool={pool} onRequestDismiss={() => {}} />
		</Suspense>
	)

const expectOnChainStats = async () => {
	expect(await screen.findByText("Total balance")).toBeTruthy()
	expect(screen.getByText("APR")).toBeTruthy()
	expect(screen.getByText("Current era ends")).toBeTruthy()
	expect(screen.getByText("Unbondings")).toBeTruthy()
}

const expectNoPayouts = () => {
	expect(screen.queryByText("15 days rewards")).toBeNull()
	expect(screen.queryByText("Payouts over last 15 days")).toBeNull()
	expect(screen.queryByText("No payouts found")).toBeNull()
}

describe("nomination pool statistics sheet", () => {
	beforeEach(() => {
		stubModalDialogs()
		vi.stubGlobal("matchMedia", () => ({
			matches: true,
			addEventListener: () => {},
			removeEventListener: () => {},
		}))
		chain.subscanUrl = KUSAMA_ASSET_HUB_SUBSCAN
		apr.state = "loaded"
		poolLookup.fail = false
	})

	afterEach(() => {
		cleanup()
		vi.unstubAllGlobals()
	})

	it("renders on-chain stats without payouts or explorer link when the chain has no Subscan", async () => {
		chain.subscanUrl = undefined
		subscanAnswers(200, {})

		renderSheet()

		await expectOnChainStats()
		expectNoPayouts()
		expect(screen.queryByText("Latest payouts")).toBeNull()
		expect(screen.queryByText(/View all on Subscan/)).toBeNull()
		expect(fetch).not.toHaveBeenCalled()
	})

	it("renders on-chain stats without payouts when Subscan refuses the request", async () => {
		subscanAnswers(400, {
			code: 403,
			message: "Subscan API strictly requires an API key.",
		})

		renderSheet()

		await expectOnChainStats()
		expectNoPayouts()
		expect(
			screen
				.getByText(/View all on Subscan/)
				.closest("a")
				?.getAttribute("href")
		).toBe(`${KUSAMA_ASSET_HUB_SUBSCAN}account/${alice.address}?tab=paidout`)
	})

	it("renders payouts when Subscan answers", async () => {
		subscanAnswers(200, {
			code: 0,
			message: "Success",
			generated_at: 0,
			data: {
				count: 1,
				list: [{ block_timestamp: Math.floor(Date.now() / 1000), amount: "2500000000000" }],
			},
		})

		renderSheet()

		await expectOnChainStats()
		expect(screen.getByText("15 days rewards")).toBeTruthy()
		expect(screen.getByText("Payouts over last 15 days")).toBeTruthy()
		expect(screen.getAllByText("2.5 KSM")).toHaveLength(2)
	})

	it("keeps a failing section inside the sheet", async () => {
		apr.state = "failed"
		subscanAnswers(200, {})

		renderSheet()

		expect(await screen.findByText("Sorry, an error occurred in Talisman.")).toBeTruthy()
		expect(screen.getByText("Statistics")).toBeTruthy()
	})

	it("keeps a refreshing section inside the sheet", async () => {
		apr.state = "failed"
		subscanAnswers(200, {})
		renderSheet()
		await screen.findByText("Sorry, an error occurred in Talisman.")

		apr.state = "loading"
		fireEvent.click(screen.getByRole("button", { name: "Refresh" }))

		expect(await screen.findByText("Statistics")).toBeTruthy()
		expect(screen.queryByText("Positions skeleton")).toBeNull()
	})

	it("keeps a failing pool lookup inside the sheet", async () => {
		poolLookup.fail = true
		subscanAnswers(200, {})

		renderSheet()

		await expectOnChainStats()
	})
})
