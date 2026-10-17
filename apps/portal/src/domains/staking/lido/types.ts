import type { Chain } from "wagmi/chains"

export type LidoSuite = {
	chain: Chain
	token: { address: `0x${string}`; symbol: string }
	withdrawalQueue: `0x${string}`
	apiEndpoint: string
}
