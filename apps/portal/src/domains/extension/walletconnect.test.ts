import { describe, expect, it } from "vitest"
import { walletConnectProjectIdOf } from "./walletconnect"

describe("walletConnectProjectIdOf", () => {
	it.each([
		["app.talisman.xyz", "bf8b7e7ceb10eb8c769504ea0b547565"],
		["main.app.talisman.party", "95873e3ae0aa053a36f2eebfe6d8a78f"],
		["abc123.app.talisman.party", "95873e3ae0aa053a36f2eebfe6d8a78f"],
		["main-talisman-portal.talismn.workers.dev", "95873e3ae0aa053a36f2eebfe6d8a78f"],
		["localhost", "95873e3ae0aa053a36f2eebfe6d8a78f"],
		["app.talisman.xyz.evil.com", "95873e3ae0aa053a36f2eebfe6d8a78f"],
	] as const)("%s uses %s", (hostname, projectId) => {
		expect(walletConnectProjectIdOf(hostname)).toBe(projectId)
	})
})
