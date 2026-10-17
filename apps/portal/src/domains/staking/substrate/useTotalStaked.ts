import { bind } from "@react-rxjs/core"
import { useMemo } from "react"
import { combineLatest, map, of } from "rxjs"

import { useSelectedSubstrateAccounts } from "@/domains/accounts/accounts"
import {
	genesisHashesKey,
	useNativeTokenPrices,
	useNominationPoolsEnabledChains,
} from "@/domains/chains/chains"
import { Decimal } from "@/util/Decimal"
import { toLoadable } from "@/util/loadable"

import { addressesKey, chainToken$ } from "./nominationPools/hooks/useBalances"
import { usePoolStakeFiatTotal } from "./nominationPools/hooks/useTotalPoolStaked"
import { validatorPositionsFor$ } from "./validator/hooks/useValidatorStakes"

const GENESIS_SEPARATOR = ","

const validatorStaked$ = (genesisHash: string, addresses: string) =>
	toLoadable(
		combineLatest([validatorPositionsFor$(genesisHash, addresses), chainToken$(genesisHash)]).pipe(
			map(([positions, token]) =>
				Decimal.fromPlanck(
					positions.reduce((total, { active }) => total + active, 0n),
					token.decimals
				).toNumber()
			)
		)
	).pipe(map((loadable) => (loadable.status === "success" ? loadable.data : 0)))

const [useValidatorStakedAmounts] = bind(
	(genesisHashes: string, addresses: string) =>
		genesisHashes === ""
			? of([] as number[])
			: combineLatest(
					genesisHashes
						.split(GENESIS_SEPARATOR)
						.map((genesisHash) => validatorStaked$(genesisHash, addresses))
				),
	[] as number[]
)

export const useTotalStaked = () => {
	const chains = useNominationPoolsEnabledChains()
	const accounts = useSelectedSubstrateAccounts()
	const prices = useNativeTokenPrices(genesisHashesKey(chains.map((chain) => chain.genesisHash)))
	const amounts = useValidatorStakedAmounts(
		chains.map((chain) => chain.genesisHash).join(GENESIS_SEPARATOR),
		addressesKey(accounts.map(({ address }) => address))
	)
	const validatorStakeFiatTotal = useMemo(
		() => amounts.reduce((total, amount, index) => total + amount * (prices[index] ?? 0), 0),
		[amounts, prices]
	)
	return validatorStakeFiatTotal + usePoolStakeFiatTotal()
}
