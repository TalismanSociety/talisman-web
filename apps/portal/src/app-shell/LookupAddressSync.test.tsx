import { act, render, screen, waitFor } from "@testing-library/react"
import { createMemoryRouter, Outlet, RouterProvider } from "react-router-dom"
import { RecoilRoot, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { describe, expect, it, vi } from "vitest"

import { lookupAccountAddressState } from "@/domains/accounts/recoils"

import { LookupAddressSync } from "./LookupAddressSync"

const { alice, initialEntry } = vi.hoisted(() => {
	const alice = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
	const initialEntry = `/portfolio?lookup-address=${alice}&tab=tokens`
	window.history.replaceState(null, "", initialEntry)
	return { alice, initialEntry }
})

const bob = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"

const renderedLookupAddresses: Array<string | undefined> = []

const LookupAddressControls = () => {
	const lookupAddress = useRecoilValue(lookupAccountAddressState)
	const setLookupAddress = useSetRecoilState(lookupAccountAddressState)
	const resetLookupAddress = useResetRecoilState(lookupAccountAddressState)
	renderedLookupAddresses.push(lookupAddress)

	return (
		<>
			<p>lookup: {lookupAddress ?? "none"}</p>
			<button type="button" onClick={() => setLookupAddress(bob)}>
				set bob
			</button>
			<button type="button" onClick={() => setLookupAddress(undefined)}>
				clear
			</button>
			<button type="button" onClick={() => setLookupAddress("  ")}>
				blank
			</button>
			<button type="button" onClick={resetLookupAddress}>
				reset
			</button>
		</>
	)
}

const renderPortal = (entry = initialEntry) => {
	const router = createMemoryRouter(
		[
			{
				path: "/",
				element: (
					<>
						<LookupAddressSync />
						<Outlet />
					</>
				),
				children: [
					{ path: "portfolio", element: <LookupAddressControls /> },
					{ path: "staking", element: <LookupAddressControls /> },
				],
			},
		],
		{ initialEntries: [entry] }
	)
	render(
		<RecoilRoot>
			<RouterProvider router={router} />
		</RecoilRoot>
	)
	return router
}

const url = (router: ReturnType<typeof renderPortal>) =>
	`${router.state.location.pathname}${router.state.location.search}`

const click = (name: string) => act(() => screen.getByRole("button", { name }).click())

describe("lookup-address search param", () => {
	it("reads the lookup address from the URL on load, without rendering a non-lookup portfolio first", () => {
		renderedLookupAddresses.length = 0
		const router = renderPortal()

		expect(screen.getByText(`lookup: ${alice}`)).toBeDefined()
		expect(renderedLookupAddresses.length).toBeGreaterThan(0)
		expect(renderedLookupAddresses.every((address) => address === alice)).toBe(true)
		expect(url(router)).toBe(initialEntry)
		expect(router.state.historyAction).toBe("POP")
	})

	it("writes a new lookup address with replace, keeping other params", async () => {
		const router = renderPortal()

		click("set bob")

		await waitFor(() => expect(url(router)).toBe(`/portfolio?lookup-address=${bob}&tab=tokens`))
		expect(router.state.historyAction).toBe("REPLACE")
	})

	it("removes the param with replace when the lookup address is cleared or blank, keeping other params", async () => {
		const router = renderPortal()

		click("clear")

		await waitFor(() => expect(url(router)).toBe("/portfolio?tab=tokens"))
		expect(router.state.historyAction).toBe("REPLACE")

		click("set bob")
		await waitFor(() => expect(url(router)).toBe(`/portfolio?tab=tokens&lookup-address=${bob}`))

		click("blank")
		await waitFor(() => expect(url(router)).toBe("/portfolio?tab=tokens"))
	})

	it("resets to the lookup address the page loaded with", async () => {
		const router = renderPortal()

		click("set bob")
		await waitFor(() => expect(url(router)).toBe(`/portfolio?lookup-address=${bob}&tab=tokens`))

		click("reset")

		await waitFor(() => expect(url(router)).toBe(`/portfolio?lookup-address=${alice}&tab=tokens`))
		expect(screen.getByText(`lookup: ${alice}`)).toBeDefined()
	})

	it("keeps the lookup address in the URL across in-app navigation, replacing the new entry", async () => {
		const router = renderPortal()

		await act(() => router.navigate("/staking?chain=polkadot"))

		await waitFor(() => expect(url(router)).toBe(`/staking?chain=polkadot&lookup-address=${alice}`))
		expect(router.state.historyAction).toBe("REPLACE")

		await act(() => router.navigate("/portfolio"))

		await waitFor(() => expect(url(router)).toBe(`/portfolio?lookup-address=${alice}`))
	})

	it("leaves the URL alone on navigation once the lookup address is cleared", async () => {
		const router = renderPortal()

		click("clear")
		await waitFor(() => expect(url(router)).toBe("/portfolio?tab=tokens"))

		await act(() => router.navigate("/staking"))

		expect(url(router)).toBe("/staking")
		expect(router.state.historyAction).toBe("PUSH")
	})
})
