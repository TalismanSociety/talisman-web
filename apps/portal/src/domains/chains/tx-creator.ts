import { firstValueFrom } from "rxjs"

import {
	injectedSubstrateAccounts$,
	pjsSignerOf,
	type TxCreator,
	txCreatorOf,
} from "@/domains/extension/substrate"

import { pjsTxCreator, type SignatureType } from "./pjs-tx-creator"
import { AVAIL_GENESIS_HASH } from "./signed-extensions"

const signatureTypeOf = (type: string | undefined): SignatureType =>
	type === "ed25519" || type === "ecdsa" ? type : type === "ethereum" ? "ecdsa" : "sr25519"

const walletTxCreator = async (address: string): Promise<TxCreator | undefined> => {
	const [signer, accounts] = await Promise.all([
		pjsSignerOf(address),
		firstValueFrom(injectedSubstrateAccounts$),
	])
	if (!signer) return undefined
	const account = accounts.find((injected) => injected.address === address)
	return pjsTxCreator(address, signer, signatureTypeOf(account?.type))
}

export const txCreatorFor = async (genesisHash: string, address: string) =>
	genesisHash === AVAIL_GENESIS_HASH
		? walletTxCreator(address)
		: ((await txCreatorOf(address)) ?? walletTxCreator(address))
