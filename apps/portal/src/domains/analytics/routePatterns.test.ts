import { describe, expect, it } from "vitest"
import { routePatternOfPathname } from "./routePatterns"

describe("routePatternOfPathname", () => {
	it.each([
		["/", "/"],
		["/staking", "/staking"],
		["/staking/", "/staking"],
		["/staking/providers", "/staking/providers"],
		["/staking/positions/", "/staking/positions"],
		["/portfolio", "/portfolio"],
		["/portfolio/5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "/portfolio/:rest"],
		["/portfolio/assets/0xd8da6bf26964af9d7eed9e03e53415d37aa96045", "/portfolio/:rest"],
		["/transport", "/transport"],
		["/transport/xcm", "/transport/:rest"],
		["/transport/swap", "/transport/swap"],
		["/transport/swap/", "/transport/swap"],
		["/transport/swap/all-routes", "/transport/:rest"],
		["/nfts", "/nfts"],
		["/admin", "/admin"],
		["/crowdloans", "/:unknown"],
		["/staking/providers/extra", "/:unknown"],
		["/5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "/:unknown"],
	])("%s is %s", (pathname, pattern) => {
		expect(routePatternOfPathname(pathname)).toBe(pattern)
	})
})
