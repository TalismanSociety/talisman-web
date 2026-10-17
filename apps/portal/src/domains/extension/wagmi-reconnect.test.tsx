import { render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { useConnection } from "wagmi"

vi.mock("@/domains/chains/chaindata-provider", () => {
	const networks = { "1": { id: "1", platform: "ethereum", rpcs: ["https://rpc.example/eth"] } }
	return { useNetworksById: () => networks }
})

const address = "0x5C9EBa3b10E45BF6db77267B40B95F3f91Fc5f67"
const answer = { eth_accounts: [address], eth_chainId: "0x1" } as Record<string, unknown>

beforeEach(() => {
	localStorage.setItem("wagmi.recentConnectorId", '"injected"')
	localStorage.setItem("wagmi.injected.connected", "true")
	Object.assign(window, {
		ethereum: {
			request: async ({ method }: { method: string }) => {
				await new Promise((resolve) => setTimeout(resolve, 50))
				return answer[method] ?? null
			},
			on: () => {},
			removeListener: () => {},
		},
	})
})

afterEach(() => {
	localStorage.clear()
	Reflect.deleteProperty(window, "ethereum")
})

const Status = () => <p>{useConnection().isConnected ? "connected" : "disconnected"}</p>

it("reconnects the rendered wagmi config when the wallet answers slowly", async () => {
	const { EvmProvider } = await import("./wagmi")

	render(
		<EvmProvider>
			<Status />
		</EvmProvider>
	)

	expect(await screen.findByText("connected", undefined, { timeout: 2000 })).toBeTruthy()
})
