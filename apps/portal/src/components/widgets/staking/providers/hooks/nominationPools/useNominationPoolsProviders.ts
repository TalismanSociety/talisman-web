import { useNominationPoolsEnabledChainsLoadable } from "@/domains/chains/chains"
import { loadableData } from "@/util/loadable"

import type { Provider } from "../types"

const CERE_GENESIS_HASH = "0x81443836a9a24caaa23f1241897d1235717535711d1d3fe24eae4fdc942c092c"

const useNominationPoolsProviders = (): Provider[] => {
	const nominationPools = loadableData(useNominationPoolsEnabledChainsLoadable())

	const allowedNomPools = nominationPools?.filter(
		({ genesisHash }) => genesisHash !== CERE_GENESIS_HASH
	)

	const nominationPoolProviders: Provider[] =
		allowedNomPools?.map((chain) => {
			const { id, nativeToken, genesisHash } = chain
			return {
				balancesTokenIds: [nativeToken?.id ?? ""],
				symbol: nativeToken?.symbol ?? "",
				logo: nativeToken?.logo ?? "",
				chainName: chain.name ?? "",
				chainId: id,
				type: "Nomination pool" as Provider["type"],
				typeId: "nominationPool",
				provider: chain.name,
				actionLink: `?action=stake&type=nomination-pools&chain=${id}`,
				nativeToken,
				genesisHash,
				isDisabled: chain.isDisabled,
			}
		}) ?? []

	return nominationPoolProviders
}

export default useNominationPoolsProviders
