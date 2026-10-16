import type { ChaindataFile, NetworkId } from "@talismn/chaindata-provider"

import type { BittensorSubnet } from "../../src/domains/staking/subtensor/types.ts"

export const bittensorSubnets = (
	chaindata: ChaindataFile,
	networkId: NetworkId
): BittensorSubnet[] =>
	chaindata.tokens
		.flatMap((token) =>
			token.type === "substrate-dtao" && token.networkId === networkId && !token.hotkey
				? [{ netuid: token.netuid, descriptionName: token.subnetName ?? "", symbol: token.symbol }]
				: []
		)
		.sort((a, b) => a.netuid - b.netuid)
