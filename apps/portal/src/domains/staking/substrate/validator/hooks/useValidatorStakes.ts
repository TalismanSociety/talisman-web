import { bind } from "@react-rxjs/core"
import { useMemo } from "react"
import { distinctUntilChanged, map, of, switchMap } from "rxjs"

import type { StakeStatus } from "@/components/recipes/StakeStatusIndicator"
import type { Account } from "@/domains/accounts/accounts"
import { bindSuspended, LOADING, toLoadable } from "@/util/loadable"

import { watchActiveEra } from "../../nominationPools/chain"
import { addressesKey, splitAddresses } from "../../nominationPools/hooks/useBalances"
import { chainRuntimes$, useGenesisHash } from "../../nominationPools/hooks/useRuntimes"
import { type ValidatorPosition, validatorPositions$ } from "../positions"
import { type StakerRewards, stakerRewardsInWorker$ } from "../stakerRewards"

export type ValidatorStake = ValidatorPosition & {
	account: Account
	reward: bigint | undefined
	status: StakeStatus | undefined
}

export const [, validatorPositionsFor$] = bindSuspended((genesisHash: string, addresses: string) =>
	chainRuntimes$(genesisHash).pipe(
		switchMap(({ runtime }) => validatorPositions$(runtime, splitAddresses(addresses)))
	)
)

const [usePositionsLoadable] = bind(
	(genesisHash: string, addresses: string) =>
		toLoadable(validatorPositionsFor$(genesisHash, addresses)),
	LOADING
)

const [useStakerRewards] = bind(
	(genesisHash: string, stashes: string) =>
		stashes === ""
			? of(LOADING)
			: toLoadable(
					chainRuntimes$(genesisHash).pipe(
						switchMap(({ runtime }) => watchActiveEra(runtime)),
						map((activeEra) => activeEra?.index ?? 0),
						distinctUntilChanged(),
						switchMap((activeEra) =>
							stakerRewardsInWorker$({ genesisHash, stashes: splitAddresses(stashes), activeEra })
						)
					)
				),
	LOADING
)

const statusOf = (reward: bigint | undefined): StakeStatus | undefined =>
	reward === undefined ? undefined : reward === 0n ? "not_earning_rewards" : "earning_rewards"

const withAccounts = (
	positions: ValidatorPosition[],
	accounts: Account[],
	rewards: StakerRewards | undefined
): ValidatorStake[] =>
	positions.flatMap((position) => {
		const account = accounts.find(({ address }) => address === position.address)
		const reward = rewards?.[position.address]
		return account ? [{ ...position, account, reward, status: statusOf(reward) }] : []
	})

export const useValidatorStakeLoadable = (accounts: Account[]) => {
	const genesisHash = useGenesisHash()
	const positions = usePositionsLoadable(
		genesisHash,
		addressesKey(accounts.map(({ address }) => address))
	)
	const stashes = positions.status === "success" ? positions.data.map(({ address }) => address) : []
	const rewards = useStakerRewards(genesisHash, addressesKey(stashes))
	return useMemo(
		() => ({
			state:
				positions.status === "success"
					? ("hasValue" as const)
					: positions.status === "error"
						? ("hasError" as const)
						: ("loading" as const),
			data:
				positions.status === "success"
					? withAccounts(
							positions.data,
							accounts,
							rewards.status === "success" ? rewards.data : undefined
						)
					: [],
		}),
		[accounts, positions, rewards]
	)
}
