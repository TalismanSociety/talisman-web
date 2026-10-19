import { StakePositionErrorBoundary } from "@/components/recipes/StakePosition"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { useSelectedSubstrateAccounts } from "@/domains/accounts/accounts"
import { useChainLoadable } from "@/domains/chains/chains"
import { usePoolStakeLoadable } from "@/domains/staking/substrate/nominationPools/hooks/usePoolStake"
import { loadableData } from "@/util/loadable"

import { StakesLoading } from "../StakesLoading"
import PoolStakeItem from "./PoolStakeItem"

const PoolStakes = () => {
	const { data: pools, state } = usePoolStakeLoadable(useSelectedSubstrateAccounts())
	const chain = loadableData(useChainLoadable())

	if (state === "loading") return <StakesLoading />

	const { name = "", nativeToken: { symbol, logo } = { symbol: "", logo: "" } } = chain || {}

	return (
		<>
			{pools?.map((pool, index) => (
				<ErrorBoundary
					orientation="horizontal"
					key={index}
					renderFallback={() => (
						<StakePositionErrorBoundary
							chain={name}
							assetSymbol={symbol}
							assetLogoSrc={logo}
							account={pool.account}
							provider={pool.poolName ?? ""}
							stakeStatus={pool.status}
						/>
					)}
				>
					<PoolStakeItem item={pool} />
				</ErrorBoundary>
			))}
		</>
	)
}

export default PoolStakes
