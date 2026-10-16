import { bind } from "@react-rxjs/core"
import { useMemo } from "react"
import { useRecoilValue, waitForAll } from "recoil"
import { combineLatest, map, of } from "rxjs"

import { selectedSubstrateAccountsState } from "@/domains/accounts/recoils"
import { nativeTokenPriceState, nominationPoolsEnabledChainsState } from "@/domains/chains/recoils"
import { Decimal } from "@/util/Decimal"
import { toLoadable } from "@/util/loadable"

import { addressesKey, chainToken$, poolPoints$ } from "./useBalances"

const GENESIS_SEPARATOR = ","

const stakedAmount$ = (genesisHash: string, addresses: string) =>
	toLoadable(
		combineLatest([poolPoints$(genesisHash, addresses), chainToken$(genesisHash)]).pipe(
			map(([points, token]) =>
				Decimal.fromPlanck(
					points.reduce((total, value) => total + value, 0n),
					token.decimals
				).toNumber()
			)
		)
	).pipe(map((loadable) => (loadable.status === "success" ? loadable.data : 0)))

const [useStakedAmounts] = bind(
	(genesisHashes: string, addresses: string) =>
		genesisHashes === ""
			? of([] as number[])
			: combineLatest(
					genesisHashes
						.split(GENESIS_SEPARATOR)
						.map((genesisHash) => stakedAmount$(genesisHash, addresses))
				),
	[] as number[]
)

export const usePoolStakeFiatTotal = () => {
	const [chains, accounts] = useRecoilValue(
		waitForAll([nominationPoolsEnabledChainsState, selectedSubstrateAccountsState])
	)
	const prices = useRecoilValue(
		waitForAll(chains.map((chain) => nativeTokenPriceState({ genesisHash: chain.genesisHash })))
	)
	const amounts = useStakedAmounts(
		chains.map((chain) => chain.genesisHash).join(GENESIS_SEPARATOR),
		addressesKey(accounts.map(({ address }) => address))
	)
	return useMemo(
		() => amounts.reduce((total, amount, index) => total + amount * (prices[index] ?? 0), 0),
		[amounts, prices]
	)
}
