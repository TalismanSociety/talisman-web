import { SignetSdk } from "@talismn/signet-apps-sdk"
import { catchError, defer, from, map, type Observable, of, shareReplay, switchMap } from "rxjs"

import type { InjectedSubstrateAccount } from "./substrate"

let sdk: SignetSdk | undefined

export const signetSdk = () => {
	sdk ??= new SignetSdk()
	return sdk
}

export const inSignet$ = defer(() => signetSdk().init()).pipe(
	shareReplay({ bufferSize: 1, refCount: false })
)

export const signetAccount$: Observable<InjectedSubstrateAccount | undefined> = inSignet$.pipe(
	switchMap((inSignet) =>
		inSignet
			? from(signetSdk().getAccount()).pipe(
					map((vault) =>
						vault
							? {
									address: vault.vaultAddress,
									genesisHash: vault.chain.genesisHash,
									name: vault.name,
								}
							: undefined
					),
					catchError((error) => {
						console.error("Failed to inject Signet account", error)
						return of(undefined)
					})
				)
			: of(undefined)
	),
	shareReplay({ bufferSize: 1, refCount: true })
)
