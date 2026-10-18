import { Subscribe } from "@react-rxjs/core"
import { render } from "@testing-library/react"
import { firstValueFrom, type Observable } from "rxjs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { alice, bob, evm, fakeExtension, load } from "@/domains/extension/fakeInjectedWeb3"

const { toast, capture } = vi.hoisted(() => ({
	toast: { error: vi.fn(), success: vi.fn() },
	capture: vi.fn(),
}))
vi.mock("@/ui/molecules/Toaster", () => ({ toast }))
vi.mock("@/domains/analytics/client", () => ({ track: capture }))

const substrateAddress = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
const evmAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

function current<T>(source$: Observable<T>) {
	return firstValueFrom(source$)
}

describe("accounts", () => {
	let harness: Awaited<ReturnType<typeof load>>

	beforeEach(() => localStorage.clear())

	afterEach(() => {
		harness.dispose()
	})

	it("reads the readonly accounts main stored and keeps their stored shape on write", async () => {
		localStorage.setItem(
			"readonly_accounts",
			JSON.stringify([{ address: substrateAddress, name: "Alice" }, { address: evmAddress }])
		)
		harness = await load()

		expect(await current(harness.readonlyAccounts$)).toEqual([
			{
				address: substrateAddress,
				name: "Alice",
				origin: "local",
				readonly: true,
				partOfPortfolio: false,
				type: undefined,
			},
			{
				address: evmAddress,
				origin: "local",
				readonly: true,
				partOfPortfolio: false,
				type: "ethereum",
			},
		])

		harness.setStoredReadonlyAccounts([{ address: substrateAddress, name: "Alice" }])

		expect(localStorage.getItem("readonly_accounts")).toBe(
			`[{"address":"${substrateAddress}","name":"Alice"}]`
		)
	})

	it("names the wagmi account after the matching injected account", async () => {
		fakeExtension("talisman", [alice, evm])
		harness = await load()
		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(2))

		harness.setWagmiAccounts([evm.address])

		expect(await current(harness.ownAccounts$)).toEqual([
			{ address: evm.address, type: "ethereum", canSignEvm: true, name: "Guardians EVM" },
			{ address: alice.address, name: "Guardians SUB", type: "sr25519", origin: "injected" },
		])
	})

	it("shows the connected accounts by default and only the chosen ones once selected", async () => {
		fakeExtension("talisman", [alice, bob])
		harness = await load()
		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(2))

		expect((await current(harness.selectedAccounts$)).map((x) => x.name)).toEqual([
			"Guardians SUB",
			"Bob",
		])

		harness.selectedAccountAddresses$.next([bob.address])

		expect((await current(harness.selectedAccounts$)).map((x) => x.name)).toEqual(["Bob"])
	})

	it("falls back to the first watched account when nothing is connected", async () => {
		localStorage.setItem(
			"readonly_accounts",
			JSON.stringify([{ address: substrateAddress, name: "Alice" }, { address: evmAddress }])
		)
		harness = await load()

		expect((await current(harness.selectedAccounts$)).map((x) => x.address)).toEqual([
			substrateAddress,
		])
	})

	it("shows the lookup address instead of the connected accounts", async () => {
		fakeExtension("talisman", [alice])
		harness = await load()
		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(1))

		harness.setLookupAccountAddress(` ${evmAddress},`)

		expect(await current(harness.selectedAccounts$)).toEqual([
			{ address: evmAddress, readonly: true, partOfPortfolio: false, type: "ethereum" },
		])
		expect((await current(harness.accounts$)).map((x) => x.address)).toEqual([
			alice.address,
			evmAddress,
		])
		expect((await current(harness.writeableAccounts$)).map((x) => x.address)).toEqual([
			alice.address,
		])
	})

	it("clears the lookup address when the selection changes", async () => {
		harness = await load()
		harness.setLookupAccountAddress(evmAddress)
		const { AccountWatcher } = await import("./AccountWatcher")
		const { render } = await import("@testing-library/react")
		render(<AccountWatcher />)

		harness.selectedAccountAddresses$.next([substrateAddress])

		expect(harness.lookupAccountAddress$.value).toBeUndefined()
	})

	it("keeps the lookup address when the selection is reset to what it already was", async () => {
		harness = await load()
		harness.setLookupAccountAddress(evmAddress)
		const { AccountWatcher } = await import("./AccountWatcher")
		const { render } = await import("@testing-library/react")
		render(<AccountWatcher />)

		harness.resetSelectedAccountAddresses()

		expect(harness.lookupAccountAddress$.value).toBe(evmAddress)
	})

	it("selects the chosen accounts through the writer and the default ones again on reset", async () => {
		fakeExtension("talisman", [alice, bob])
		harness = await load()
		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(2))
		const renders: string[][] = []
		const SelectedNames = () => {
			renders.push(harness.useSelectedAccounts().map((account) => account.name ?? ""))
			return null
		}
		render(
			<Subscribe>
				<SelectedNames />
			</Subscribe>
		)
		await vi.waitFor(() => expect(renders.at(-1)).toEqual(["Guardians SUB", "Bob"]))

		harness.setSelectedAccountAddresses([bob.address])
		await vi.waitFor(() => expect(renders.at(-1)).toEqual(["Bob"]))

		harness.resetSelectedAccountAddresses()
		await vi.waitFor(() => expect(renders.at(-1)).toEqual(["Guardians SUB", "Bob"]))
	})

	it("renders the current selection on the first render of a consumer that mounts after the last one left", async () => {
		fakeExtension("talisman", [alice, bob])
		harness = await load()
		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(2))
		harness.setSelectedAccountAddresses([bob.address])
		const { AccountWatcher } = await import("./AccountWatcher")
		render(<AccountWatcher />)
		const renders: string[][] = []
		const SelectedNames = () => {
			renders.push(harness.useSelectedSubstrateAccounts().map((account) => account.name ?? ""))
			return null
		}

		const first = render(
			<Subscribe>
				<SelectedNames />
			</Subscribe>
		)
		await vi.waitFor(() => expect(renders.at(-1)).toEqual(["Bob"]))
		first.unmount()
		renders.length = 0
		render(
			<Subscribe>
				<SelectedNames />
			</Subscribe>
		)

		expect(renders).toEqual([["Bob"]])
	})
})
