import { firstValueFrom } from "rxjs"

import {
	connectedSubstrateWallet$,
	injectedSubstrateAccounts$,
	type TxCreator,
	txCreatorOf,
} from "@/domains/extension/substrate"

import { pjsTxCreator, type SignatureType } from "./pjs-tx-creator"
import { AVAIL_GENESIS_HASH } from "./signed-extensions"

const signatureTypeOf = (type: string | undefined): SignatureType =>
	type === "ed25519" || type === "ecdsa" ? type : type === "ethereum" ? "ecdsa" : "sr25519"

const availTxCreator = async (address: string): Promise<TxCreator | undefined> => {
	const [wallet, accounts] = await Promise.all([
		firstValueFrom(connectedSubstrateWallet$),
		firstValueFrom(injectedSubstrateAccounts$),
	])
	const account = accounts.find((injected) => injected.address === address)
	if (!wallet || !account) return undefined
	return pjsTxCreator(address, wallet.signer, signatureTypeOf(account.type))
}

export const txCreatorFor = (genesisHash: string, address: string) =>
	genesisHash === AVAIL_GENESIS_HASH ? availTxCreator(address) : txCreatorOf(address)
