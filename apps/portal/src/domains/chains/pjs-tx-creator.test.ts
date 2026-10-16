// @vitest-environment node
import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"
import { AccountId } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { getTxCreatorFromPjs } from "polkadot-api/pjs-signer"
import { describe, expect, it, vi } from "vitest"

import { pjsTxCreator } from "./pjs-tx-creator"

const GUARDIANS = "5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP"
const AVAIL_GENESIS = "0xb91746b45e0346cc2f815a520b9c6cb4d5c0902af848db0a80f85932d2e8276a"
const BLOCK_HASH = "0x66dbe25f60c5f32e27b07966b6f1f1dd7e7fd503947ccf47dec83dffa716dd35"
const JOIN_POOL_2 = "0x010208240013000064a7b3b6e00d02000000240f01"

const mainPayload = {
	appId: 0,
	specVersion: "0x00000038",
	transactionVersion: "0x00000001",
	address: GUARDIANS,
	assetId: null,
	blockHash: BLOCK_HASH,
	blockNumber: "0x0036e7e2",
	era: "0x2400",
	genesisHash: AVAIL_GENESIS,
	metadataHash: null,
	method: JOIN_POOL_2,
	mode: 0,
	nonce: "0x0000000f",
	signedExtensions: [
		"CheckNonZeroSender",
		"CheckSpecVersion",
		"CheckTxVersion",
		"CheckGenesis",
		"CheckMortality",
		"CheckNonce",
		"CheckWeight",
		"ChargeTransactionPayment",
		"CheckAppId",
	],
	tip: "0x00000000000000000000000000000000",
	version: 4,
	withSignedTransaction: true,
}

const metadata = toHex(
	new Uint8Array(
		gunzipSync(
			readFileSync(
				new URL(
					"../staking/substrate/nominationPools/fixtures/avail-metadata.scale.gz",
					import.meta.url
				)
			)
		)
	)
)

const payload = {
	version: 1 as const,
	signer: GUARDIANS,
	callData: JOIN_POOL_2,
	txExtVersion: 0,
	extensions: [
		{ id: "CheckNonZeroSender", extra: "0x", additionalSigned: "0x" },
		{ id: "CheckSpecVersion", extra: "0x", additionalSigned: "0x38000000" },
		{ id: "CheckTxVersion", extra: "0x", additionalSigned: "0x01000000" },
		{ id: "CheckGenesis", extra: "0x", additionalSigned: AVAIL_GENESIS },
		{ id: "CheckMortality", extra: "0x2400", additionalSigned: BLOCK_HASH },
		{ id: "CheckNonce", extra: "0x3c", additionalSigned: "0x" },
		{ id: "CheckWeight", extra: "0x", additionalSigned: "0x" },
		{ id: "ChargeTransactionPayment", extra: "0x00", additionalSigned: "0x" },
		{ id: "CheckAppId", extra: "0x00", additionalSigned: "0x" },
	],
	context: {
		metadata,
		token: { symbol: "AVAIL", decimals: 18 },
		bestBlockHeight: 0x36e7e2,
		bestBlockHash: BLOCK_HASH,
		genesisHash: AVAIL_GENESIS,
	},
}

const SIGNATURE = `0x01${"ab".repeat(64)}` as const

const signer = () => ({
	signPayload: vi.fn(async () => ({ id: 1, signature: SIGNATURE })),
	signRaw: vi.fn(async () => ({ id: 1, signature: SIGNATURE })),
})

const create = (creator: ReturnType<typeof pjsTxCreator>, mocked = false) =>
	creator(payload, {}, {} as never, mocked)

describe("pjsTxCreator on Avail", () => {
	it("hands the wallet the payload main's avail-js-sdk path sends, with the app id", async () => {
		const wallet = signer()
		const tx = await create(pjsTxCreator(GUARDIANS, wallet))

		const { assetId: _assetId, metadataHash: _metadataHash, mode: _mode, ...expected } = mainPayload
		expect(wallet.signPayload).toHaveBeenCalledWith(expected)
		const publicKey = toHex(AccountId().enc(GUARDIANS)).slice(2)
		expect(tx).toBe(`0xf5018400${publicKey}${SIGNATURE.slice(2)}24003c0000${JOIN_POOL_2.slice(2)}`)
	})

	it("uses the wallet's signed transaction when it returns one", async () => {
		const wallet = signer()
		wallet.signPayload.mockResolvedValueOnce({
			id: 1,
			signature: SIGNATURE,
			signedTransaction: "0x1234",
		} as never)
		expect(await create(pjsTxCreator(GUARDIANS, wallet))).toBe("0x1234")
	})

	it("mocks the signature for a fee estimate without asking the wallet", async () => {
		const wallet = signer()
		const tx = await create(pjsTxCreator(GUARDIANS, wallet), true)
		expect(wallet.signPayload).not.toHaveBeenCalled()
		expect(tx).toBe(
			`0xf5018400${toHex(AccountId().enc(GUARDIANS)).slice(2)}01${"00".repeat(64)}24003c0000${JOIN_POOL_2.slice(2)}`
		)
	})

	it("is needed because polkadot-api's own pjs creator refuses CheckAppId", async () => {
		const wallet = signer()
		const creator = getTxCreatorFromPjs(
			GUARDIANS,
			wallet.signPayload as never,
			wallet.signRaw as never
		)
		await expect(create(creator)).rejects.toThrow(
			"PJS does not support this signed-extension: CheckAppId"
		)
	})
})
