import { bind } from "@react-rxjs/core"
import { useContext } from "react"
import { combineLatest, map, switchMap } from "rxjs"

import { ChainContext } from "@/domains/chains/contexts"
import { assertChain } from "@/domains/chains/utils"

import { contractStakes$, minimumStakeAmount$, protocolState$ } from "../chain"
import { registeredDapps$ } from "../dapps"
import { smartContractOf, stakeInPeriod } from "../stake"

const [useDappsWithStakeOf] = bind(
	(genesisHash: string, dappStakingApi: string, priorityDapp: string | undefined) =>
		registeredDapps$(dappStakingApi, priorityDapp).pipe(
			switchMap((dapps) =>
				combineLatest([
					contractStakes$(
						genesisHash,
						dapps.map((dapp) => smartContractOf(dapp.address))
					),
					protocolState$(genesisHash),
				]).pipe(
					map(([stakes, protocol]) =>
						dapps.map((dapp, index) => {
							const stake = stakes[index]
							return {
								...dapp,
								staked:
									stake === undefined
										? 0n
										: (stakeInPeriod(stake, protocol.period_info.number) ?? 0n),
							}
						})
					)
				)
			)
		)
)

export const useDappsWithStake = () => {
	const chain = useContext(ChainContext)
	assertChain(chain, { hasDappStaking: true })
	return useDappsWithStakeOf(chain.genesisHash, chain.dappStakingApi, chain.priorityDapp)
}

const [useMinimumStakeAmountOf] = bind(minimumStakeAmount$)

export const useMinimumStakeAmount = () =>
	useMinimumStakeAmountOf(useContext(ChainContext).genesisHash)
