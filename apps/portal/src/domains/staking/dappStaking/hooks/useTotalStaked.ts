import { bind } from "@react-rxjs/core"
import { isEqual } from "lodash"
import { useRecoilValue, useRecoilValueLoadable, waitForAny } from "recoil"
import { catchError, combineLatest, distinctUntilChanged, map, of, switchMap } from "rxjs"

import { selectedSubstrateAccounts$ } from "@/domains/accounts/accounts"
import { chainConfigs } from "@/domains/chains/config"
import { dappStakingEnabledChainsState, nativeTokenAmountState } from "@/domains/chains/recoils"

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

export const useTotalStaked = () => {
	const chains = useRecoilValue(dappStakingEnabledChainsState)
	const nativeTokenAmounts = useRecoilValueLoadable(
		waitForAny(
			chains.map((chain) =>
				nativeTokenAmountState({ genesisHash: chain.genesisHash, apiEndpoint: chain.rpc! })
			)
		)
	)
	const stakedByChain = useStakedPerAccountByChain()

	if (nativeTokenAmounts.state !== "hasValue" || stakedByChain === undefined) return 0

	return chains
		.map((chain, chainIndex) =>
			(stakedByChain[chain.genesisHash] ?? [])
				.map(
					(staked) =>
						nativeTokenAmounts.contents.at(chainIndex)?.valueMaybe()?.fromPlanck(staked)
							.fiatAmount ?? 0
				)
				.reduce((prev, curr) => prev + curr, 0)
		)
		.reduce((prev, curr) => prev + curr, 0)
}
