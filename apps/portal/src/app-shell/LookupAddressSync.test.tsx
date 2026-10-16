import { Subscribe } from "@react-rxjs/core"
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router"
import { act, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
	resetLookupAccountAddress,
	setLookupAccountAddress,
	useLookupAccountAddress,
} from "@/domains/accounts/accounts"
import { parseSearch, stringifySearch, validateSearch } from "@/util/search"

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
	const lookupAddress = useLookupAccountAddress()
	renderedLookupAddresses.push(lookupAddress)

	return (
		<>
			<p>lookup: {lookupAddress ?? "none"}</p>
			<button type="button" onClick={() => setLookupAccountAddress(bob)}>
				set bob
			</button>
			<button type="button" onClick={() => setLookupAccountAddress(undefined)}>
				clear
			</button>
			<button type="button" onClick={() => setLookupAccountAddress("  ")}>
				blank
			</button>
			<button type="button" onClick={resetLookupAccountAddress}>
				reset
			</button>
		</>
	)
}

const renderPortal = async (entry = initialEntry) => {
	const root = createRootRoute({
		validateSearch,
		component: () => (
			<>
				<LookupAddressSync />
				<Outlet />
			</>
		),
	})
	const page = (path: string) =>
		createRoute({ getParentRoute: () => root, path, component: LookupAddressControls })
	const history = createMemoryHistory({ initialEntries: [entry] })
	const actions: string[] = []
	history.subscribe(({ action }) => actions.push(action.type))
	const router = createRouter({
		routeTree: root.addChildren([page("/portfolio"), page("/staking")]),
		history,
		parseSearch,
		stringifySearch,
	})
	render(
		<Subscribe>
			<RouterProvider router={router} />
		</Subscribe>
	)
	await screen.findByText(/^lookup: /)
	return { router, actions }
}

const url = ({ router }: Awaited<ReturnType<typeof renderPortal>>) => router.history.location.href

const click = (name: string) => act(() => screen.getByRole("button", { name }).click())

describe("lookup-address search param", () => {
	beforeEach(() => setLookupAccountAddress(alice))

	it("reads the lookup address from the URL on load, without rendering a non-lookup portfolio first", async () => {
		renderedLookupAddresses.length = 0
		const portal = await renderPortal()

		expect(screen.getByText(`lookup: ${alice}`)).toBeDefined()
		expect(renderedLookupAddresses.length).toBeGreaterThan(0)
		expect(renderedLookupAddresses.every((address) => address === alice)).toBe(true)
		expect(url(portal)).toBe(initialEntry)
		expect(portal.actions).toEqual([])
	})

	it("writes a new lookup address with replace, keeping other params", async () => {
		const portal = await renderPortal()

		click("set bob")

		await waitFor(() => expect(url(portal)).toBe(`/portfolio?lookup-address=${bob}&tab=tokens`))
		expect(portal.actions).toEqual(["REPLACE"])
	})

	it("removes the param with replace when the lookup address is cleared or blank, keeping other params", async () => {
		const portal = await renderPortal()

		click("clear")

		await waitFor(() => expect(url(portal)).toBe("/portfolio?tab=tokens"))
		expect(portal.actions).toEqual(["REPLACE"])

		click("set bob")
		await waitFor(() => expect(url(portal)).toBe(`/portfolio?tab=tokens&lookup-address=${bob}`))

		click("blank")
		await waitFor(() => expect(url(portal)).toBe("/portfolio?tab=tokens"))
	})

	it("resets to the lookup address the page loaded with", async () => {
		const portal = await renderPortal()

		click("set bob")
		await waitFor(() => expect(url(portal)).toBe(`/portfolio?lookup-address=${bob}&tab=tokens`))

		click("reset")

		await waitFor(() => expect(url(portal)).toBe(`/portfolio?lookup-address=${alice}&tab=tokens`))
		expect(screen.getByText(`lookup: ${alice}`)).toBeDefined()
	})

	it("keeps the lookup address in the URL across in-app navigation, replacing the new entry", async () => {
		const portal = await renderPortal()

		act(() => void portal.router.navigate({ to: "/staking", search: { chain: "polkadot" } }))

		await waitFor(() => expect(url(portal)).toBe(`/staking?chain=polkadot&lookup-address=${alice}`))
		expect(portal.actions).toEqual(["PUSH", "REPLACE"])

		act(() => void portal.router.navigate({ to: "/portfolio" }))

		await waitFor(() => expect(url(portal)).toBe(`/portfolio?lookup-address=${alice}`))
	})

	it("leaves the URL alone on navigation once the lookup address is cleared", async () => {
		const portal = await renderPortal()

		click("clear")
		await waitFor(() => expect(url(portal)).toBe("/portfolio?tab=tokens"))

		act(() => void portal.router.navigate({ to: "/staking" }))

		await waitFor(() => expect(portal.router.state.resolvedLocation?.pathname).toBe("/staking"))
		expect(url(portal)).toBe("/staking")
		expect(portal.actions).toEqual(["REPLACE", "PUSH"])
	})
})
