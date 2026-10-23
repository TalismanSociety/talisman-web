import { Subscribe } from "@react-rxjs/core"
import {
	createMemoryHistory,
	createRouter,
	Outlet,
	RouterProvider,
	useLocation,
} from "@tanstack/react-router"
import { render, screen, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"

import { routeTree } from "@/routeTree.gen"
import { ThemeProvider, theme } from "@/ui/theme"
import { parseSearch, stringifySearch } from "@/util/search"

vi.mock("@/AppProviders", () => ({
	default: ({ children }: { children: ReactNode }) => children,
}))
vi.mock("@/app-shell/Layout", () => ({ Layout: () => <Outlet /> }))
vi.mock("@/components/legacy/widgets/WalletTotal", () => ({ WalletTotal: () => null }))
vi.mock("@/components/recipes/AccountValueInfo", () => ({ AccountValueInfo: () => null }))
vi.mock("@/components/recipes/PortfolioAddressSearch", () => ({
	PortfolioAddressSearch: () => null,
}))
vi.mock("@/components/widgets/AnimatedFiatNumber", () => ({ AnimatedFiatNumber: () => null }))
vi.mock("@/domains/staking/hooks", () => ({ useTotalStaked: () => 0 }))
vi.mock("@/components/widgets/AccountsManagementMenu", () => ({
	AccountsManagementMenu: () => null,
}))
vi.mock("@/components/widgets/staking/BannerStakeWithTalismanWallet", () => ({
	BannerStakeWithTalismanWallet: () => null,
}))
vi.mock("@/components/widgets/staking/Stakes", () => ({ default: () => null }))
vi.mock("@/components/widgets/staking/providers/StakeProviders", () => ({
	StakeProviders: () => null,
}))
vi.mock("@/domains/accounts/accounts", () => ({ useSelectedAccounts: () => [] }))
vi.mock("@/components/widgets/AccountConnectionGuard", () => ({
	AccountConnectionGuard: ({ children }: { children: ReactNode }) =>
		useLocation().pathname.startsWith("/transport") ? children : null,
}))

const visit = (path: string) => {
	const router = createRouter({
		routeTree,
		history: createMemoryHistory({ initialEntries: [path] }),
		parseSearch,
		stringifySearch,
	})
	render(
		<ThemeProvider theme={theme.greenDark}>
			<Subscribe>
				<RouterProvider router={router} />
			</Subscribe>
		</ThemeProvider>
	)
	return router
}

const focusable = (container: HTMLElement) =>
	[
		...container.querySelectorAll<HTMLElement>(
			"a[href], button, input, select, textarea, [tabindex]"
		),
	]
		.filter((element) => !element.closest("[inert]"))
		.filter((element) => !(element as HTMLButtonElement).disabled)

describe("/transport/swap", () => {
	it("shows the disabled swap form under the Talisman Wallet placeholder", async () => {
		visit("/transport/swap")

		const swapButton = await screen.findByRole("button", { name: "Swap" })
		expect(swapButton).toHaveProperty("disabled", true)
		const tab = screen.getByRole("link", { name: "Cross Chain Swap" })
		expect(tab.getAttribute("href")).toBe("/transport/swap")
		expect(screen.getByText("Swap is no longer available on Portal")).toBeTruthy()
		expect(screen.getByText(/Please use the Swap feature in/).textContent).toBe(
			"Please use the Swap feature in Talisman Wallet instead."
		)

		const download = screen.getByRole("link", { name: "Talisman Wallet" })
		expect(focusable(document.body)).toEqual([tab, download])
		expect(download.getAttribute("href")).toBe("https://talisman.xyz/download/")
		expect(download.getAttribute("target")).toBe("_blank")
		expect(download.getAttribute("rel")).toBe("noopener noreferrer")
		expect(screen.getAllByPlaceholderText("0.00")).toHaveLength(2)
	})

	it.each(["/transport", "/transport/", "/transport/xcm", "/transport/swap/all-routes"])(
		"%s lands on /transport/swap",
		async (path) => {
			const router = visit(path)

			await waitFor(() => expect(router.state.location.pathname).toBe("/transport/swap"))
			expect(await screen.findByText("Select asset")).toBeTruthy()
		}
	)
})

describe("/admin", () => {
	it("lands on /staking", async () => {
		const router = visit("/admin")

		await waitFor(() => expect(router.state.location.pathname).toBe("/staking"))
	})
})
