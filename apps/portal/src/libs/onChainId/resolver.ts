import { bind } from "@react-rxjs/core"
import { OnChainId } from "@talismn/on-chain-id"
import { of } from "rxjs"

import { chainConnectors } from "@/domains/chains/chain-connectors"
import { getCachedQuery$ } from "@/util/getCachedQuery"
import { LOADING, type Loadable, toLoadable } from "@/util/loadable"

const onChainId = new OnChainId({ chainConnectors })

type NameResolutions = Awaited<ReturnType<OnChainId["resolveNames"]>>
type AddressLookups = Awaited<ReturnType<OnChainId["lookupAddresses"]>>

const resolveNsName$ = (name: string) =>
	getCachedQuery$("onChainId.resolveNames", name, () => onChainId.resolveNames([name]))

const lookupAddress$ = (address: string) =>
	getCachedQuery$("onChainId.lookupAddresses", address, () => onChainId.lookupAddresses([address]))

const idle = <T>(): Loadable<T | undefined> => ({ status: "success", data: undefined })

export const [useNsNameResolution] = bind(
	(name: string) => (name === "" ? of(idle<NameResolutions>()) : toLoadable(resolveNsName$(name))),
	LOADING as Loadable<NameResolutions | undefined>
)

export const [useAddressLookup] = bind(
	(address: string) =>
		address === "" ? of(idle<AddressLookups>()) : toLoadable(lookupAddress$(address)),
	LOADING as Loadable<AddressLookups | undefined>
)
