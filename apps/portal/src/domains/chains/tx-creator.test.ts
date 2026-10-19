import { beforeEach, describe, expect, it, vi } from "vitest"

import { txCreatorFor } from "./tx-creator"

const KUSAMA_ASSET_HUB = "0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a"
const AVAIL = "0xb91746b45e0346cc2f815a520b9c6cb4d5c0902af848db0a80f85932d2e8276a"

const { CONNECTED, signing, kheopskitCreator, pjsTxCreator, signer } = vi.hoisted(() => {
	const signer = { signPayload: vi.fn(), signRaw: vi.fn() }
	const kheopskitCreator = { from: "kheopskit" }
	return {
		CONNECTED: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
		signing: {
			current: undefined as
				| {
						account: { address: string; type: string; txCreator: typeof kheopskitCreator }
						pjsSigner: typeof signer | undefined
				  }
				| undefined,
		},
		kheopskitCreator,
		pjsTxCreator: vi.fn((address: string, _signer: unknown, type: string) => ({ address, type })),
		signer,
	}
})

vi.mock("@/domains/extension/substrate", () => ({
	signingAccountFor: async () => signing.current,
}))
vi.mock("./pjs-tx-creator", () => ({ pjsTxCreator }))

describe("txCreatorFor", () => {
	beforeEach(() => {
		pjsTxCreator.mockClear()
		signing.current = {
			account: { address: CONNECTED, type: "ed25519", txCreator: kheopskitCreator },
			pjsSigner: signer,
		}
	})

	it("signs through the kheopskit account the signer resolves to", async () => {
		expect(await txCreatorFor(KUSAMA_ASSET_HUB, CONNECTED)).toBe(kheopskitCreator)
		expect(pjsTxCreator).not.toHaveBeenCalled()
	})

	it("signs Avail through the wallet signer with the account's own key type", async () => {
		expect(await txCreatorFor(AVAIL, CONNECTED)).toEqual({ address: CONNECTED, type: "ed25519" })
		expect(pjsTxCreator).toHaveBeenCalledWith(CONNECTED, signer, "ed25519")
	})

	it("has no Avail creator when the wallet has no pjs signer", async () => {
		signing.current = {
			account: { address: CONNECTED, type: "sr25519", txCreator: kheopskitCreator },
			pjsSigner: undefined,
		}
		expect(await txCreatorFor(AVAIL, CONNECTED)).toBeUndefined()
	})

	it("has no creator when no connected wallet can sign", async () => {
		signing.current = undefined
		expect(await txCreatorFor(KUSAMA_ASSET_HUB, CONNECTED)).toBeUndefined()
		expect(await txCreatorFor(AVAIL, CONNECTED)).toBeUndefined()
	})
})
