import type { EventGroup } from "../events"
import { p } from "../properties"
import { ROUTE_PATTERN_VALUES } from "../routePatterns"

export const pageEvents = {
	$pageview: {
		description: "A page of the portal was shown",
		properties: {
			route: p.enum(ROUTE_PATTERN_VALUES, "Route pattern of the page, with its ids left out"),
		},
	},
} as const satisfies EventGroup
