import { bind } from "@react-rxjs/core"
import { isEqual } from "lodash"
import { catchError, combineLatest, distinctUntilChanged, map, of, switchMap } from "rxjs"

import { selectedSubstrateAccounts$ } from "@/domains/accounts/accounts"
import {
	genesisHashesKey,
	type NativeTokenAmount,
	useDappStakingEnabledChains,
	useNativeTokenAmountLoadables,
} from "@/domains/chains/chains"
import { chainConfigs } from "@/domains/chains/config"
import { type Loadable, loadableData } from "@/util/loadable"

import { ledgers$, protocolState$ } from "../chain"
import { stakeInPeriod } from "../stake"

const dappStakingGenesisHashes = chainConfigs.flatMap((chain) =>
	"hasDappStaking" in chain ? [chain.genesisHash] : []
)

const stakedPerAccount$ = (genesisHash: string, addresses: string[]) =>
	combineLatest([protocolState$(genesisHash), ledgers$(genesisHash, addresses)]).pipe(
		map(([protocol, ledgers]) =>
			ledgers.map((ledger) => stakeInPeriod(ledger, protocol.period_info.number) ?? 0n)
		),
		catchError(() => of(undefined))
	)

const [useStakedPerAccountByChain] = bind(
	selectedSubstrateAccounts$.pipe(
		map((accounts) => accounts.map((account) => account.address)),
		distinctUntilChanged(isEqual),
		switchMap((addresses) =>
			combineLatest(
				Object.fromEntries(
					dappStakingGenesisHashes.map((genesisHash) => [
						genesisHash,
						stakedPerAccount$(genesisHash, addresses),
					])
				)
			)
		)
	),
	undefined
)

const amountAt = (amounts: Loadable<NativeTokenAmount>[], index: number) => {
	const amount = amounts[index]
	return amount === undefined ? undefined : loadableData(amount)
}

export const useTotalStaked = () => {
	const chains = useDappStakingEnabledChains()
	const nativeTokenAmounts = useNativeTokenAmountLoadables(
		genesisHashesKey(chains.map((chain) => chain.genesisHash))
	)
	const stakedByChain = useStakedPerAccountByChain()

	if (stakedByChain === undefined) return 0

	return chains
		.map((chain, chainIndex) =>
			(stakedByChain[chain.genesisHash] ?? [])
				.map(
					(staked) => amountAt(nativeTokenAmounts, chainIndex)?.fromPlanck(staked).fiatAmount ?? 0
				)
				.reduce((prev, curr) => prev + curr, 0)
		)
		.reduce((prev, curr) => prev + curr, 0)
}
