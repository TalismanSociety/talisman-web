import type { EventGroup } from "../events"
import { p } from "../properties"

export const portfolioEvents = {
	"Report portfolio balances": {
		description: "The connected accounts' balances loaded, once per page load",
		properties: {
			tokens: p.count("Number of token balances worth more than zero"),
			chains: p.count("Number of chains those balances are on"),
		},
	},
} as const satisfies EventGroup
