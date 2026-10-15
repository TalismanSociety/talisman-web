import { describe, expect, it, vi } from "vitest"

const importWagmiConfig = async () => {
	vi.resetModules()
	const { wagmiConfig } = await import("./wagmi")
	return wagmiConfig
}

describe("wagmi.recentConnectorId", () => {
	it("reads the JSON-encoded connector id", async () => {
		localStorage.setItem("wagmi.recentConnectorId", '"xyz.talisman"')
		const wagmiConfig = await importWagmiConfig()

		expect(await wagmiConfig.storage?.getItem("recentConnectorId")).toBe("xyz.talisman")
	})

	it("writes the connector id JSON-encoded", async () => {
		const wagmiConfig = await importWagmiConfig()

		await wagmiConfig.storage?.setItem("recentConnectorId", "injected")

		expect(localStorage.getItem("wagmi.recentConnectorId")).toBe('"injected"')
	})

	it("moves the legacy EIP-6963 provider id", async () => {
		localStorage.setItem("connected-eip-6963-provider", '"xyz.talisman"')
		const wagmiConfig = await importWagmiConfig()

		expect(localStorage.getItem("connected-eip-6963-provider")).toBeNull()
		expect(await wagmiConfig.storage?.getItem("recentConnectorId")).toBe("xyz.talisman")
	})
})
