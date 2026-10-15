import { ChainConnectorDot, ChainConnectorEth } from "@talismn/chain-connectors"

import { chaindataProvider } from "./chaindata-provider"

export const chainConnectors = {
	substrate: new ChainConnectorDot(chaindataProvider),
	evm: new ChainConnectorEth(chaindataProvider),
}
