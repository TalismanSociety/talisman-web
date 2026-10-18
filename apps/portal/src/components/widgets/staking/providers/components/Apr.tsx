import { ChainProvider } from "@/domains/chains/provider"
import { useApr as useDappApr } from "@/domains/staking/dappStaking/hooks/useApr"
import { useApr as useNominationPoolApr } from "@/domains/staking/substrate/nominationPools/hooks/useApr"
import { useHighestApr } from "@/domains/staking/subtensor/hooks/useApr"

import useLidoApr from "../hooks/lido/useApr"
import useGetSeekStakeApr from "../hooks/seek/useGetSeekStakeApr"
import type { StakeProviderTypeId } from "../hooks/types"

const aprFormatter = (apr: number, hasDTaoStaking?: boolean) => {
	if (hasDTaoStaking) {
		return "Variable"
	}

	return apr > 0
		? apr?.toLocaleString(undefined, { style: "percent", maximumFractionDigits: 2 })
		: "--"
}

type AprProps = {
	typeId: StakeProviderTypeId
	genesisHash: `0x${string}`
	setAprValues: (apr: number) => void
	symbol?: string
	apiEndpoint?: string
	hasDTaoStaking?: boolean
}
type AprDisplayProps = Omit<AprProps, "genesisHash">

// This component is used to get around the react rules of conditional hooks
const AprDisplay = ({ typeId, apiEndpoint, hasDTaoStaking, setAprValues }: AprDisplayProps) => {
	const hookMap: Record<StakeProviderTypeId, (arg0?: any) => number> = {
		nominationPool: useNominationPoolApr,
		delegationSubtensor: useHighestApr,
		liquidStakingLido: useLidoApr,
		// @ts-expect-error
		dappStaking: useDappApr,
		seekStaking: useGetSeekStakeApr,
	}

	let aprValue: number = 0
	switch (typeId) {
		case "seekStaking":
			aprValue = hookMap["seekStaking"]()
			break
		case "nominationPool":
			aprValue = hookMap["nominationPool"]()
			break
		case "delegationSubtensor":
			aprValue = hookMap["delegationSubtensor"]()
			break
		case "dappStaking":
			// @ts-expect-error
			aprValue = hookMap["dappStaking"]().totalApr
			break
		case "liquidStakingLido":
			aprValue = hookMap["liquidStakingLido"]({ apiEndpoint })
			break
		default:
			aprValue = 0
	}

	setAprValues(aprValue)

	return <div className="text-lg">{aprFormatter(aprValue ?? 0, hasDTaoStaking)}</div>
}

const Apr = ({
	typeId,
	genesisHash,
	symbol,
	apiEndpoint,
	setAprValues,
	hasDTaoStaking,
}: AprProps) => {
	return (
		<ChainProvider chain={{ genesisHash: genesisHash }}>
			<AprDisplay
				typeId={typeId}
				setAprValues={setAprValues}
				symbol={symbol}
				apiEndpoint={apiEndpoint}
				hasDTaoStaking={hasDTaoStaking}
			/>
		</ChainProvider>
	)
}

export default Apr
