import { cleanup, fireEvent, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderInPortal, stubModalDialogs } from "@/components/widgets/PrivacySettings/testShell"
import { alice, aliceIn } from "@/domains/extension/substrate.fixtures"
import AddStakeDialog from "./AddStakeDialog"
import UnstakeDialog from "./UnstakeDialog"

const { signAndSend, unbondMax, unstakeForm } = vi.hoisted(() => ({
	signAndSend: vi.fn(async () => {}),
	unbondMax: vi.fn(async () => {}),
	unstakeForm: { isLeaving: false },
}))

const amountForm = {
	isReady: true,
	input: { amount: "1", decimalAmount: { planck: 1n }, localizedFiatAmount: "" },
	resulting: { decimalAmount: undefined, localizedFiatAmount: undefined },
	available: { decimalAmount: undefined },
	availableBalance: { decimalAmount: undefined },
	setAmount: vi.fn(),
	error: undefined,
}

vi.mock("@/domains/staking/substrate/nominationPools/hooks", () => ({
	usePoolAddForm: () => amountForm,
	usePoolUnstakeForm: () => ({
		...amountForm,
		...unstakeForm,
		extrinsic: { state: "idle", signAndSend, unbondMax },
	}),
}))
vi.mock("@/domains/staking/substrate/nominationPools/hooks/useRuntimes", () => ({
	useGenesisHash: () => "0x00",
}))
vi.mock("@/domains/staking/substrate/nominationPools/hooks/useUnlockDuration", () => ({
	useLocalizedUnlockDuration: () => "28 days",
}))
vi.mock("@/domains/common/hooks/useTx", () => ({
	useTx: () => ({ state: "idle", signAndSend }),
}))
vi.mock("@/domains/common/hooks/useExtrinsicEffect", () => ({
	useTxInBlockOrErrorEffect: () => {},
}))

const polkadotJsAlice = aliceIn("Polkadot.js", "polkadot:polkadot-js")

describe("nomination pool dialogs", () => {
	beforeEach(() => {
		stubModalDialogs()
		unstakeForm.isLeaving = false
	})

	afterEach(() => {
		cleanup()
		vi.clearAllMocks()
	})

	it("adds stake through the picked wallet account", () => {
		renderInPortal(<AddStakeDialog account={polkadotJsAlice} onDismiss={() => {}} />)

		fireEvent.click(screen.getByRole("button", { name: "Stake" }))

		expect(signAndSend).toHaveBeenCalledWith(polkadotJsAlice)
	})

	it("unstakes through the picked wallet account", () => {
		renderInPortal(<UnstakeDialog account={polkadotJsAlice} onDismiss={() => {}} />)

		fireEvent.click(screen.getByRole("button", { name: "Unstake" }))

		expect(signAndSend).toHaveBeenCalledWith(polkadotJsAlice, alice.address, 1n)
	})

	it("leaves the pool through the picked wallet account", () => {
		unstakeForm.isLeaving = true
		renderInPortal(<UnstakeDialog account={polkadotJsAlice} onDismiss={() => {}} />)

		fireEvent.click(screen.getByRole("button", { name: "Leave pool" }))

		expect(unbondMax).toHaveBeenCalledWith(polkadotJsAlice)
	})
})
