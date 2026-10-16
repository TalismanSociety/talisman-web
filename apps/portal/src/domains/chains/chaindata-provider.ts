import { bind } from "@react-rxjs/core"
import { ChaindataProvider, getRemoteChaindata$ } from "@talismn/chaindata-provider"
import { defer, filter, type Observable } from "rxjs"

export const chaindataProvider = new ChaindataProvider({
	chaindata$: defer(() => getRemoteChaindata$(new URL("/chaindata.json", location.origin).href)),
})

const loaded = <T extends object>(source$: Observable<T>) =>
	source$.pipe(filter((value) => Object.keys(value).length > 0))

export const networksById$ = loaded(chaindataProvider.getNetworksMapById$())
export const networksByGenesisHash$ = loaded(chaindataProvider.getNetworksMapByGenesisHash$())
export const tokensById$ = loaded(chaindataProvider.getTokensMapById$())

export const [useNetworksById] = bind(networksById$)
