import { useDappStakingEnabledChains } from "@/domains/chains/chains"

import type { Provider } from "../types"

const useDappProviders = (): Provider[] => {
	const chains = useDappStakingEnabledChains()
	const dappProviders: Provider[] = chains.map((chain) => {
		return {
			balancesTokenIds: [chain.nativeToken?.id ?? ""],
			symbol: chain.nativeToken?.symbol ?? "",
			logo: chain.nativeToken?.logo ?? "",
			chainName: chain.name ?? "",
			chainId: chain.id,
			type: "DApp staking" as Provider["type"],
			typeId: "dappStaking",
			provider: chain.name,
			actionLink: `?action=stake&type=dapp-staking&chain=${chain?.id ?? ""}`,
			nativeToken: chain.nativeToken,
			genesisHash: chain.genesisHash,
		}
	})
	return dappProviders
}

export default useDappProviders
