import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { SignerAccount } from "@/domains/accounts/accounts"
import { alice } from "@/domains/extension/substrate.fixtures"
import { ThemeProvider, theme } from "@/ui/theme"
import { useAccountSelector } from "./AccountSelector"

vi.mock("@/domains/extension/main", () => ({ useHasActiveWalletConnection: () => true }))
vi.mock("@/domains/balances/balances", () => ({ useBalances: () => [] }))
vi.mock("./WalletConnectionSideSheet", () => ({ openWalletConnectionSideSheet: () => undefined }))

const pairOf = (walletName: string, walletId: string): SignerAccount => ({
	address: alice.address,
	name: alice.name,
	type: "sr25519",
	origin: "injected",
	walletName,
	walletAccountId: `${walletId}::${alice.address}`,
})

const accounts = [
	pairOf("Talisman", "polkadot:talisman"),
	pairOf("Polkadot.js", "polkadot:polkadot-js"),
]

const Picker = () => {
	const [[selected], accountSelector] = useAccountSelector(accounts, 0)
	return (
		<>
			{accountSelector}
			<output>{selected?.walletAccountId}</output>
		</>
	)
}

describe("useAccountSelector", () => {
	it("offers each wallet's copy of an address as its own option and selects the one picked", async () => {
		render(
			<ThemeProvider theme={theme.greenDark}>
				<Picker />
			</ThemeProvider>
		)
		expect(screen.getByRole("status").textContent).toBe(accounts[0]?.walletAccountId)

		fireEvent.click(screen.getByRole("button"))
		const options = await screen.findAllByRole("option")
		expect(options.map((option) => option.textContent)).toEqual([
			"Guardians SUBTalisman · 5Grw…utQY",
			"Guardians SUBPolkadot.js · 5Grw…utQY",
		])
		fireEvent.click(options[1] as HTMLElement)

		await vi.waitFor(() =>
			expect(screen.getByRole("status").textContent).toBe(accounts[1]?.walletAccountId)
		)
	})
})
