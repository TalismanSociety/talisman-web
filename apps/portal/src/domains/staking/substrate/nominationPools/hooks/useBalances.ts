import { combineLatest, map, of, switchMap } from "rxjs"
import { bindSuspended } from "@/util/loadable"

import { chainTokenOf, watchAccount, watchPoolMember } from "../chain"
import { chainRuntimes$ } from "./useRuntimes"

const ADDRESS_SEPARATOR = ","

export const addressesKey = (addresses: string[]) => addresses.join(ADDRESS_SEPARATOR)

export const splitAddresses = (addresses: string) =>
	addresses === "" ? [] : addresses.split(ADDRESS_SEPARATOR)

export type AccountBalance = { free: bigint; frozen: bigint; transferable: bigint }

const balanceOf = ({ free, frozen }: { free: bigint; frozen: bigint }): AccountBalance => ({
	free,
	frozen,
	transferable: free > frozen ? free - frozen : 0n,
})

export const [useAccountBalances] = bindSuspended((genesisHash: string, addresses: string) =>
	chainRuntimes$(genesisHash).pipe(
		switchMap(({ runtime }) => {
			const list = splitAddresses(addresses)
			return list.length === 0
				? of([] as AccountBalance[])
				: combineLatest(
						list.map((address) =>
							watchAccount(runtime, address).pipe(map(({ data }) => balanceOf(data)))
						)
					)
		})
	)
)

export const [usePoolPoints, poolPoints$] = bindSuspended(
	(genesisHash: string, addresses: string) =>
		chainRuntimes$(genesisHash).pipe(
			switchMap(({ runtime }) => {
				const list = splitAddresses(addresses)
				return list.length === 0
					? of([] as bigint[])
					: combineLatest(
							list.map((address) =>
								watchPoolMember(runtime, address).pipe(map((member) => member?.points ?? 0n))
							)
						)
			})
		)
)

export const [useChainToken, chainToken$] = bindSuspended((genesisHash: string) =>
	chainRuntimes$(genesisHash).pipe(map(({ runtime }) => chainTokenOf(runtime)))
)
