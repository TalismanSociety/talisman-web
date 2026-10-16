import { bind } from "@react-rxjs/core"
import { useMemo } from "react"
import { switchMap } from "rxjs"

import type { Account } from "@/domains/accounts/accounts"
import { bindSuspended, LOADING, toLoadable } from "@/util/loadable"

import { type PoolPosition, poolPositions$ } from "../positions"
import { chainRuntimes$, useGenesisHash } from "./useRuntimes"

export type DerivedPool = PoolPosition & { account: Account }

const ADDRESS_SEPARATOR = ","

const [usePoolPositions, poolPositionsFor$] = bindSuspended(
	(genesisHash: string, addresses: string) =>
		chainRuntimes$(genesisHash).pipe(
			switchMap(({ runtime }) =>
				poolPositions$(runtime, addresses === "" ? [] : addresses.split(ADDRESS_SEPARATOR))
			)
		)
)

const [usePoolPositionsLoadable] = bind(
	(genesisHash: string, addresses: string) => toLoadable(poolPositionsFor$(genesisHash, addresses)),
	LOADING
)

const addressesKey = (accounts: Account[]) =>
	accounts.map(({ address }) => address).join(ADDRESS_SEPARATOR)

const withAccounts = (positions: PoolPosition[], accounts: Account[]): DerivedPool[] =>
	positions.flatMap((position) => {
		const account = accounts.find(({ address }) => address === position.address)
		return account ? [{ ...position, account }] : []
	})

export const usePoolStakes = <T extends Account | Account[]>(account: T) => {
	const genesisHash = useGenesisHash()
	const accounts = useMemo(
		() => (Array.isArray(account) ? (account as Account[]) : [account as Account]),
		[account]
	)
	const positions = usePoolPositions(genesisHash, addressesKey(accounts))
	type Return = T extends Account[] ? DerivedPool[] : DerivedPool | undefined
	return useMemo(() => {
		const pools = withAccounts(positions, accounts)
		return (Array.isArray(account) ? pools : pools.at(0)) as Return
	}, [account, accounts, positions])
}

export const usePoolStakeLoadable = (accounts: Account[]) => {
	const genesisHash = useGenesisHash()
	const loadable = usePoolPositionsLoadable(genesisHash, addressesKey(accounts))
	return useMemo(
		() => ({
			state:
				loadable.status === "success"
					? ("hasValue" as const)
					: loadable.status === "error"
						? ("hasError" as const)
						: ("loading" as const),
			data: loadable.status === "success" ? withAccounts(loadable.data, accounts) : [],
		}),
		[accounts, loadable]
	)
}
