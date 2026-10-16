import type { MetadataLookup } from "@polkadot-api/metadata-builders"
import type { DispatchError } from "./portal-runtime"

const TOKEN_ERRORS: Record<string, string> = {
	FundsUnavailable: "Funds are unavailable.",
	OnlyProvider: "Account that must exist would die",
	BelowMinimum: "Account cannot exist with the funds that would be given",
	CannotCreate: "Account cannot be created",
	UnknownAsset: "The asset in question is unknown",
	Frozen: "Funds exist but are frozen",
	Unsupported: "Operation is not supported by the asset",
	CannotCreateHold: "Account cannot be created for recording amount on hold",
	NotExpendable: "Account that is desired to remain would die",
	Blocked: "Account cannot receive the assets",
}

const moduleErrorDocs = (lookup: MetadataLookup, pallet: string, error: string) => {
	const errors = lookup.metadata.pallets.find(({ name }) => name === pallet)?.errors
	const entry = errors && lookup(errors.type)
	return entry?.type === "enum" ? entry.innerDocs[error]?.join(" ") : undefined
}

export const dispatchErrorMessage = (lookup: MetadataLookup, { type, value }: DispatchError) => {
	const inner = value as DispatchError | undefined
	if (type === "Module" && inner) {
		const error = (inner.value as DispatchError | undefined)?.type ?? ""
		return moduleErrorDocs(lookup, inner.type, error) || `${inner.type}.${error}`
	}
	if (type === "Token" && inner) return TOKEN_ERRORS[inner.type] ?? inner.type
	return inner ? `${type}.${inner.type}` : type
}
