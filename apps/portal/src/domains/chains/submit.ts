import type { MetadataLookup } from "@polkadot-api/metadata-builders"
import {
	type HexString,
	InvalidTxError,
	type TxEvent,
	type TxEventsPayload,
	type TxFinalized,
	type TxInBestBlock,
} from "polkadot-api"
import { filter, firstValueFrom, type Observable, tap } from "rxjs"
import { dispatchErrorMessage } from "./dispatch-errors"
import type { DispatchError } from "./portal-runtime"

export type TxResult = {
	txHash: HexString
	blockNumber: number
	txIndex: number
	events: TxEventsPayload["events"]
}

const TRANSACTION_VALIDITY_ERRORS: Record<string, Record<string, string>> = {
	Invalid: {
		Call: "The call of the transaction is not expected",
		Payment: "Inability to pay some fees (e.g. account balance too low)",
		Future: "Transaction will be valid in the future",
		Stale: "Transaction is outdated",
		BadProof: "Invalid transaction proof",
		AncientBirthBlock: "The transaction birth block is ancient",
		ExhaustsResources: "The transaction would exhaust the resources of the current block",
		BadMandatory: "A mandatory dispatch failed",
		MandatoryValidation: "A mandatory dispatch was included in a transaction",
		BadSigner: "The sending address is disabled or known to be invalid",
	},
	Unknown: {
		CannotLookup: "Could not look up information required to validate the transaction",
		NoUnsignedValidator: "No validator found for the given unsigned transaction",
	},
}

const validityReason = ({ value }: DispatchError) =>
	(value as DispatchError | undefined)?.type ?? ""

export class TxInvalidError extends Error {
	override name = "TxInvalidError"

	constructor(readonly validity: DispatchError) {
		const reason = validityReason(validity)
		super(
			TRANSACTION_VALIDITY_ERRORS[validity.type]?.[reason] ??
				`${validity.type} transaction: ${reason}`
		)
	}

	get reason() {
		return validityReason(this.validity)
	}
}

export class TxFailedError extends Error {
	override name = "TxFailedError"

	constructor(
		message: string,
		readonly txHash: HexString
	) {
		super(message)
	}
}

export type SubmitWatch = {
	onEvent?: (event: TxEvent) => void
	onInBestBlock?: (event: TxInBestBlock) => void
}

const isFinalized = (event: TxEvent): event is TxFinalized => event.type === "finalized"

export const watchTx = async (
	events$: Observable<TxEvent>,
	lookup: MetadataLookup,
	{ onEvent, onInBestBlock }: SubmitWatch = {}
): Promise<TxResult> => {
	const event = await firstValueFrom(
		events$.pipe(
			tap((event) => {
				onEvent?.(event)
				if (event.type === "inBestBlock") onInBestBlock?.(event)
			}),
			filter(isFinalized)
		)
	).catch((error) => {
		throw error instanceof InvalidTxError ? new TxInvalidError(error.error) : error
	})
	if (!event.ok)
		throw new TxFailedError(dispatchErrorMessage(lookup, event.dispatchError), event.txHash)
	return {
		txHash: event.txHash,
		blockNumber: event.block.number,
		txIndex: event.block.index,
		events: event.events,
	}
}
