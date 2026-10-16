import { createV4Tx, withCommonExtensions, withNonce } from "@polkadot-api/signers-common"
import {
	AccountId,
	Bytes,
	compact,
	compactBn,
	decAnyMetadata,
	Option,
	Struct,
	u32,
	unifyMetadata,
} from "@polkadot-api/substrate-bindings"
import { fromHex, toHex } from "@polkadot-api/utils"
import type { SignerPayloadJSON } from "polkadot-api/pjs-signer"

import type { PjsSigner, TxCreator } from "@/domains/extension/substrate"

type PayloadExtension = { id: string; extra: string; additionalSigned: string }

type Hex = `0x${string}`

type PjsPayload = Omit<SignerPayloadJSON, "assetId"> & { assetId?: Hex; appId?: number }

type Mapper = (extension: PayloadExtension, bestBlockHeight: number) => Partial<PjsPayload>

const hex = (value: string) => value as Hex

const toPjsHex = (value: number | bigint, minByteLen: number): Hex => {
	let inner = value.toString(16)
	inner = (inner.length % 2 ? "0" : "") + inner
	return `0x${"00".repeat(Math.max(0, minByteLen - inner.length / 2))}${inner}`
}

const assetTxPayment = Struct({ tip: compact, asset: Option(Bytes(Infinity)) }).dec

const MAPPERS: Record<string, Mapper> = {
	CheckGenesis: ({ additionalSigned }) => ({ genesisHash: hex(additionalSigned) }),
	CheckNonce: ({ extra }) => ({ nonce: toPjsHex(compact.dec(extra), 4) }),
	CheckTxVersion: ({ additionalSigned }) => ({
		transactionVersion: toPjsHex(u32.dec(additionalSigned), 4),
	}),
	ChargeAssetTxPayment: ({ extra }) => {
		const { tip, asset } = assetTxPayment(extra)
		return { ...(asset ? { assetId: hex(toHex(asset)) } : {}), tip: toPjsHex(tip, 16) }
	},
	ChargeTransactionPayment: ({ extra }) => ({ tip: toPjsHex(compactBn.dec(extra), 16) }),
	CheckMortality: ({ extra, additionalSigned }, blockNumber) => ({
		era: hex(extra),
		blockHash: hex(additionalSigned),
		blockNumber: toPjsHex(blockNumber, 4),
	}),
	CheckSpecVersion: ({ additionalSigned }) => ({
		specVersion: toPjsHex(u32.dec(additionalSigned), 4),
	}),
	CheckMetadataHash: ({ extra, additionalSigned }) =>
		fromHex(extra)[0]
			? { mode: 1, metadataHash: hex(toHex(fromHex(additionalSigned).slice(1))) }
			: {},
	CheckAppId: ({ extra }) => ({ appId: Number(compact.dec(extra)) }),
}

const SIGNATURE_TYPES = { ed25519: "Ed25519", sr25519: "Sr25519", ecdsa: "Ecdsa" } as const
const SR_MOCK = `0x${"0".repeat(128)}`
const ECDSA_MOCK = `${SR_MOCK}00`

export type SignatureType = keyof typeof SIGNATURE_TYPES

type Creator = Parameters<typeof withCommonExtensions>[0]

export const pjsTxCreator = (
	address: string,
	signer: PjsSigner,
	type: SignatureType = "sr25519"
): TxCreator => {
	const publicKey = address.startsWith("0x") ? fromHex(address) : AccountId().enc(address)
	const creator: Creator = async (payload, _opts, _bindings, mocked) => {
		const metadata = unifyMetadata(decAnyMetadata(payload.context.metadata))
		if ((payload.txExtVersion ?? 0) !== 0)
			throw new Error("Only txExtVersion 0 is allowed for extrinsic v4")
		if (!metadata.extrinsic.version.includes(4)) throw new Error("Only extrinsic v4 is supported")
		const pjs: Partial<PjsPayload> & { signedExtensions: string[] } = {
			signedExtensions: [],
		}
		const extra: Uint8Array[] = []
		for (const { identifier } of metadata.extrinsic.extensionsByVersion[0] ?? []) {
			const extension = payload.extensions.find(({ id }) => id === identifier)
			if (!extension) throw new Error(`Missing ${identifier} signed-extension`)
			extra.push(fromHex(extension.extra))
			pjs.signedExtensions.push(identifier)
			const mapper = MAPPERS[identifier]
			if (mapper) {
				Object.assign(pjs, mapper(extension, payload.context.bestBlockHeight))
			} else if (extension.extra !== "0x" || extension.additionalSigned !== "0x") {
				throw new Error(`PJS does not support this signed-extension: ${identifier}`)
			}
		}
		const signerPayload = {
			...pjs,
			address,
			method: hex(payload.callData),
			version: 4,
			withSignedTransaction: true,
		} as SignerPayloadJSON
		const signed = mocked
			? { signature: type === "ecdsa" ? ECDSA_MOCK : SR_MOCK }
			: await signer.signPayload(signerPayload)
		const tx = "signedTransaction" in signed ? signed.signedTransaction : undefined
		if (tx) return typeof tx === "string" ? tx : toHex(tx)
		return toHex(
			createV4Tx(
				metadata,
				publicKey,
				fromHex(signed.signature),
				extra,
				fromHex(payload.callData),
				mocked ? SIGNATURE_TYPES[type] : undefined
			)
		)
	}
	const signBytes = (data: Uint8Array) =>
		signer
			.signRaw({ address, data: toHex(data), type: "bytes" })
			.then(({ signature }) => fromHex(signature))
	return Object.assign(withNonce(publicKey)(withCommonExtensions(creator)), {
		publicKey,
		signBytes,
	}) as TxCreator
}
