import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router"
import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ThemeProvider, theme } from "@/ui/theme"

import { SiteNav } from "./SiteNav"

vi.mock("@/components/molecules/CurrencySelect", () => ({ CurrencySelect: () => null }))
vi.mock("@/components/molecules/WalletConnectionButton", () => ({
	WalletConnectionButton: () => null,
}))

HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
	this.open = true
}

const renderSiteNav = async () => {
	const router = createRouter({
		routeTree: createRootRoute({ component: SiteNav }),
		history: createMemoryHistory({ initialEntries: ["/staking/providers"] }),
	})
	render(
		<ThemeProvider theme={theme.greenDark}>
			<RouterProvider router={router} />
		</ThemeProvider>
	)
	return screen.findByRole("banner")
}

const navLabels = (container: HTMLElement) =>
	within(container)
		.getAllByRole("link")
		.filter((link) => link.getAttribute("href")?.startsWith("/"))
		.map((link) => [link.textContent?.replace(/\u00a0/g, " ").trim(), link.getAttribute("href")])

describe("SiteNav", () => {
	it("links Swap to /transport between Staking and Portfolio on desktop", async () => {
		const header = await renderSiteNav()

		expect(navLabels(header)).toEqual([
			["TalismanPortal", "/staking"],
			["Staking", "/staking"],
			["Swap", "/transport"],
			["Portfolio", "/portfolio"],
			["Buy/Sell", "/rampbuysell"],
		])
	})

	it("links Swap to /transport between Staking and Portfolio in the mobile drawer", async () => {
		const header = await renderSiteNav()
		fireEvent.click(within(header).getByRole("button"))

		const drawer = await screen.findByRole("dialog")
		expect(navLabels(drawer)).toEqual([
			["Staking", "/staking"],
			["Swap", "/transport"],
			["Portfolio", "/portfolio"],
			["Buy/Sell", "/rampbuysell"],
		])
	})
})
