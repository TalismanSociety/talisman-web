import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { aliceIn } from "@/domains/extension/substrate.fixtures"
import { useAccountSelector } from "./AccountSelector"
import { renderInPortal } from "./PrivacySettings/testShell"

vi.mock("@/domains/extension/main", () => ({ useHasActiveWalletConnection: () => true }))
vi.mock("@/domains/balances/balances", () => ({ useBalances: () => [] }))
vi.mock("./WalletConnectionSideSheet", () => ({ openWalletConnectionSideSheet: () => undefined }))

const accounts = [
	aliceIn("Talisman", "polkadot:talisman"),
	aliceIn("Polkadot.js", "polkadot:polkadot-js"),
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
		renderInPortal(<Picker />)
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
