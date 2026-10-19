import { type Signer, signingAccountFor, type TxCreator } from "@/domains/extension/substrate"

import { pjsTxCreator, type SignatureType } from "./pjs-tx-creator"
import { AVAIL_GENESIS_HASH } from "./signed-extensions"

const signatureTypeOf = (type: string): SignatureType =>
	type === "ed25519" || type === "ecdsa" ? type : type === "ethereum" ? "ecdsa" : "sr25519"

export const txCreatorFor = async (
	genesisHash: string,
	signer: Signer
): Promise<TxCreator | undefined> => {
	const signing = await signingAccountFor(signer)
	if (!signing) return undefined
	const { account, pjsSigner } = signing
	if (genesisHash !== AVAIL_GENESIS_HASH) return account.txCreator
	return pjsSigner && pjsTxCreator(account.address, pjsSigner, signatureTypeOf(account.type))
}
