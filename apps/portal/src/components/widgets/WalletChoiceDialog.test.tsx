import { cleanup, fireEvent, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { alice, type load, loadWithAliceInTwoWallets } from "@/domains/extension/substrate.fixtures"
import { renderInPortal, stubModalDialogs } from "./PrivacySettings/testShell"

const { toast, capture } = vi.hoisted(() => ({
	toast: { error: vi.fn(), success: vi.fn() },
	capture: vi.fn(),
}))
vi.mock("@/ui/molecules/Toaster", () => ({ toast }))
vi.mock("@/domains/analytics/client", () => ({ track: capture }))

describe("WalletChoiceDialog", () => {
	let harness: Awaited<ReturnType<typeof load>>

	beforeEach(() => {
		localStorage.clear()
		stubModalDialogs()
	})

	afterEach(() => {
		cleanup()
		harness.dispose()
	})

	const signAliceHeldByTwoWallets = async () => {
		const loaded = await loadWithAliceInTwoWallets()
		harness = loaded.harness
		const { talisman, polkadotJs } = loaded
		const { WalletChoiceDialog } = await import("./WalletChoiceDialog")
		renderInPortal(<WalletChoiceDialog />)
		const signed = harness
			.signingAccountFor({ address: alice.address })
			.then((signing) =>
				signing?.pjsSigner?.signRaw({ address: alice.address, data: "0x00", type: "bytes" })
			)
		const dialog = await screen.findByRole("dialog")
		return { talisman, polkadotJs, signed, dialog }
	}

	it("lists each wallet that holds the address and signs through the one the user picks", async () => {
		const { talisman, polkadotJs, signed } = await signAliceHeldByTwoWallets()

		expect(screen.getByRole("heading", { name: "Choose the signing wallet" })).toBeTruthy()
		expect(
			screen.getAllByRole("button", { name: /Guardians SUB/ }).map((x) => x.textContent)
		).toEqual(["TalismanGuardians SUB", "Polkadot.jsGuardians SUB"])
		fireEvent.click(screen.getByRole("button", { name: /Polkadot\.js/ }))
		await signed

		expect(polkadotJs.signRawCalls()).toHaveLength(1)
		expect(talisman.signRawCalls()).toEqual([])
		expect(screen.queryByRole("dialog")).toBeNull()
	})

	it("cancels the signing when the user dismisses the dialog", async () => {
		const { talisman, polkadotJs, signed, dialog } = await signAliceHeldByTwoWallets()

		fireEvent(dialog, new Event("cancel"))

		await expect(signed).rejects.toThrow("Cancelled")
		expect(talisman.signRawCalls()).toEqual([])
		expect(polkadotJs.signRawCalls()).toEqual([])
		await vi.waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
	})
})
