import { useDeriveState, useQueryState } from "@talismn/react-polkadot-api"
import { useMemo } from "react"
import { useRecoilValueLoadable, waitForAll } from "recoil"

import { StakePositionErrorBoundary } from "@/components/recipes/StakePosition"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { selectedSubstrateAccountsState } from "@/domains/accounts/recoils"
import { useChainState } from "@/domains/chains/hooks"
import { useStakersRewardState } from "@/domains/staking/substrate/validator/recoils"

import ValidatorStakeItem from "./ValidatorStakeItem"

const useStakes = () => {
	const accountsLoadable = useRecoilValueLoadable(selectedSubstrateAccountsState)

	const accounts = accountsLoadable.valueMaybe()

	const addresses = useMemo(() => {
		if (!accounts) return []
		return accounts.map((x) => x.address)
	}, [accounts])

	const { state: loadableState, contents: loadableContents } = useRecoilValueLoadable(
		waitForAll([
			useQueryState("staking", "activeEra", []),
			useDeriveState("staking", "accounts", [addresses, undefined]),
		])
	)

	const [activeEra, stakes] = loadableState === "hasValue" ? loadableContents : []

	const slashingSpansLoadable = useRecoilValueLoadable(
		useQueryState("staking", "slashingSpans.multi", stakes?.map((staking) => staking.stashId) ?? [])
	)

	const stakerRewardsLoadable = useRecoilValueLoadable(
		useStakersRewardState(activeEra?.unwrapOrDefault().index.toNumber() || 0)
	)

	const data = useMemo(() => {
		if (!accounts) return []
		return (
			stakes
				?.map((stake, index) => {
					const reward = stakerRewardsLoadable.valueMaybe()?.[accounts[index]?.address ?? ""]
					return {
						stake,
						account: accounts[index]!,
						reward,
						slashingSpan:
							(slashingSpansLoadable.contents[index]?.unwrapOrDefault().prior.length ?? -1) + 1,
					}
				})
				.filter(
					({ account, stake }) =>
						account !== undefined && !stake.stakingLedger.active.unwrap().isZero()
				) ?? []
		)
	}, [accounts, slashingSpansLoadable.contents, stakerRewardsLoadable, stakes])

	return { data, state: slashingSpansLoadable.state }
}

type ValidatorStakesProps = {
	setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}

const ValidatorStakes = ({ setShouldRenderLoadingSkeleton }: ValidatorStakesProps) => {
	const { data: stakes, state } = useStakes()
	const chainLoadable = useRecoilValueLoadable(useChainState())
	const chain = chainLoadable.valueMaybe()

	if (state === "hasValue" || stakes.length) {
		setShouldRenderLoadingSkeleton(false)
	}

	const { name = "", nativeToken: { symbol, logo } = { symbol: "", logo: "" } } = chain || {}

	return (
		<>
			{stakes.map((props, index) => {
				const { account, reward } = props
				const stakeStatus =
					reward === undefined
						? undefined
						: reward === 0n
							? "not_earning_rewards"
							: "earning_rewards"

				return (
					<ErrorBoundary
						key={index}
						renderFallback={() => (
							<StakePositionErrorBoundary
								chain={name}
								assetSymbol={symbol}
								assetLogoSrc={logo}
								account={account}
								provider="Validator staking"
								stakeStatus={stakeStatus}
							/>
						)}
					>
						<ValidatorStakeItem key={index} {...props} />
					</ErrorBoundary>
				)
			})}
		</>
	)
}

export default ValidatorStakes
