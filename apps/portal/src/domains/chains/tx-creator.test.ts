import { beforeEach, describe, expect, it, vi } from "vitest"

import { txCreatorFor } from "./tx-creator"

const KUSAMA_ASSET_HUB = "0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a"
const AVAIL = "0xb91746b45e0346cc2f815a520b9c6cb4d5c0902af848db0a80f85932d2e8276a"

const { CONNECTED, CONTROLLER, wallet$, kheopskitCreator, pjsTxCreator, signer, of } =
	await vi.hoisted(async () => {
		const { BehaviorSubject, of } = await import("rxjs")
		const signer = { signPayload: vi.fn(), signRaw: vi.fn() }
		return {
			CONNECTED: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
			CONTROLLER: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
			wallet$: new BehaviorSubject<{ extension: { signer: typeof signer } } | undefined>(undefined),
			kheopskitCreator: { from: "kheopskit" },
			pjsTxCreator: vi.fn((address: string, _signer: unknown, type: string) => ({ address, type })),
			signer,
			of,
		}
	})

vi.mock("@/domains/extension/substrate", () => ({
	connectedSubstrateWallet$: wallet$,
	injectedSubstrateAccounts$: of([{ address: CONNECTED, type: "ed25519" }]),
	txCreatorOf: async (address: string) => (address === CONNECTED ? kheopskitCreator : undefined),
}))
vi.mock("./pjs-tx-creator", () => ({ pjsTxCreator }))

describe("txCreatorFor", () => {
	beforeEach(() => {
		pjsTxCreator.mockClear()
		wallet$.next({ extension: { signer } })
	})

	it("signs a connected account through kheopskit", async () => {
		expect(await txCreatorFor(KUSAMA_ASSET_HUB, CONNECTED)).toBe(kheopskitCreator)
		expect(pjsTxCreator).not.toHaveBeenCalled()
	})

	it("hands an address the wallet did not share to the wallet signer, which decides", async () => {
		expect(await txCreatorFor(KUSAMA_ASSET_HUB, CONTROLLER)).toEqual({
			address: CONTROLLER,
			type: "sr25519",
		})
		expect(pjsTxCreator).toHaveBeenCalledWith(CONTROLLER, signer, "sr25519")
	})

	it("signs Avail through the wallet signer with the account's own key type", async () => {
		expect(await txCreatorFor(AVAIL, CONNECTED)).toEqual({ address: CONNECTED, type: "ed25519" })
	})

	it("has no creator without a connected wallet", async () => {
		wallet$.next(undefined)
		expect(await txCreatorFor(KUSAMA_ASSET_HUB, CONTROLLER)).toBeUndefined()
		expect(await txCreatorFor(AVAIL, CONNECTED)).toBeUndefined()
	})
})
