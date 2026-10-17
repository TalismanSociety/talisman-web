import { bind } from "@react-rxjs/core"
import { OnChainId } from "@talismn/on-chain-id"
import { type Observable, of } from "rxjs"

import { chainConnectors } from "@/domains/chains/chain-connectors"
import { getCachedQuery$ } from "@/util/getCachedQuery"
import { type Loadable, toLoadable } from "@/util/loadable"

const onChainId = new OnChainId({ chainConnectors })

type NameResolutions = Awaited<ReturnType<OnChainId["resolveNames"]>>
type AddressLookups = Awaited<ReturnType<OnChainId["lookupAddresses"]>>

const resolveNsName$ = (name: string) =>
	getCachedQuery$("onChainId.resolveNames", name, () => onChainId.resolveNames([name]))

const lookupAddress$ = (address: string) =>
	getCachedQuery$("onChainId.lookupAddresses", address, () => onChainId.lookupAddresses([address]))

const idle = <T>(): Loadable<T | undefined> => ({ status: "success", data: undefined })

export const [useNsNameResolution] = bind(
	(name: string): Observable<Loadable<NameResolutions | undefined>> =>
		name === "" ? of(idle<NameResolutions>()) : toLoadable(resolveNsName$(name))
)

export const [useAddressLookup] = bind(
	(address: string): Observable<Loadable<AddressLookups | undefined>> =>
		address === "" ? of(idle<AddressLookups>()) : toLoadable(lookupAddress$(address))
)
