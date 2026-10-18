import { useNominationPoolsEnabledChainsLoadable } from "@/domains/chains/chains"
import { loadableData } from "@/util/loadable"

import type { Provider } from "../types"

const useNominationPoolsProviders = (): Provider[] => {
	const nominationPools = loadableData(useNominationPoolsEnabledChainsLoadable())

	const nominationPoolProviders: Provider[] =
		nominationPools?.map((chain) => {
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
