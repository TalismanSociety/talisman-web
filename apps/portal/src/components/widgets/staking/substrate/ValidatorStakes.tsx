import { StakePositionErrorBoundary } from "@/components/recipes/StakePosition"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { useSelectedSubstrateAccounts } from "@/domains/accounts/accounts"
import { useChainLoadable } from "@/domains/chains/chains"
import { useValidatorStakeLoadable } from "@/domains/staking/substrate/validator/hooks/useValidatorStakes"
import { loadableData } from "@/util/loadable"

import { StakesLoading } from "../StakesLoading"
import ValidatorStakeItem from "./ValidatorStakeItem"

const ValidatorStakes = () => {
	const { data: stakes, state } = useValidatorStakeLoadable(useSelectedSubstrateAccounts())
	const chain = loadableData(useChainLoadable())

	if (state === "loading") return <StakesLoading />

	const { name = "", nativeToken: { symbol, logo } = { symbol: "", logo: "" } } = chain || {}

	return (
		<>
			{stakes.map((stake, index) => (
				<ErrorBoundary
					key={index}
					renderFallback={() => (
						<StakePositionErrorBoundary
							chain={name}
							assetSymbol={symbol}
							assetLogoSrc={logo}
							account={stake.account}
							provider="Validator staking"
							stakeStatus={stake.status}
						/>
					)}
				>
					<ValidatorStakeItem stake={stake} />
				</ErrorBoundary>
			))}
		</>
	)
}

export default ValidatorStakes
