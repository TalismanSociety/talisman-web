import { render } from "@testing-library/react"
import {
	type Config,
	createConfig,
	createConnector,
	getConnection,
	http,
	reconnect,
	signMessage,
	switchChain,
} from "@wagmi/core"
import { mainnet } from "@wagmi/core/chains"
import { firstValueFrom } from "rxjs"
import { getAddress } from "viem"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useConfig } from "wagmi"
import { alice, bob, evm, load } from "./substrate.fixtures"

const { toast } = vi.hoisted(() => ({ toast: { error: vi.fn(), success: vi.fn() } }))
vi.mock("@/ui/molecules/Toaster", () => ({ toast }))
vi.mock("@/domains/analytics/client", () => ({ track: vi.fn() }))
vi.mock("@/domains/chains/chaindata-provider", () => {
	const networks = { "1": { id: "1", platform: "ethereum", rpcs: ["https://rpc.example/eth"] } }
	return { useNetworksById: () => networks }
})

const MAINNET = 1
const MOONBEAM = 1284
const ARBITRUM = 42161

const evmAddress = getAddress(evm.address)
const otherEvmAddress = getAddress("0x8ba1f109551bD432803012645Ac136ddd64DBA72")

const on = (chainId: number, address = evmAddress) => `eip155:${chainId}:${address}` as const

describe("one WalletConnect pairing for Substrate and Ethereum", () => {
	let harness: Awaited<ReturnType<typeof load>>
	let config: Config

	const Probe = () => {
		config = useConfig()
		return null
	}

	const renderPortal = async () => {
		const { EvmProvider } = await import("./wagmi")
		const { ExtensionWatcher } = await import("./main")
		return render(
			<EvmProvider>
				<ExtensionWatcher />
				<Probe />
			</EvmProvider>
		)
	}

	const loadPortal = async () => {
		harness = await load()
		const walletConnect = await import("@/test/walletconnect")
		await renderPortal()
		return walletConnect
	}

	const ownAddresses = async () =>
		(await firstValueFrom(harness.ownAccounts$)).map(({ address }) => address)

	const evmAddresses = () => getConnection(config).addresses ?? []

	const connectionsByConnector = () =>
		[...config.state.connections.values()].map(({ connector, accounts }) => [
			connector.id,
			accounts,
		])

	const installInjectedWallet = (address: string, delay: number) => {
		localStorage.setItem("wagmi.recentConnectorId", '"injected"')
		localStorage.setItem("wagmi.injected.connected", "true")
		const answers: Record<string, unknown> = { eth_accounts: [address], eth_chainId: "0x1" }
		Object.assign(window, {
			ethereum: {
				request: async ({ method }: { method: string }) => {
					await new Promise((resolve) => setTimeout(resolve, delay))
					return answers[method] ?? null
				},
				on: () => undefined,
				removeListener: () => undefined,
			},
		})
	}

	beforeEach(() => localStorage.clear())

	afterEach(() => {
		harness.dispose()
		Reflect.deleteProperty(window, "ethereum")
	})

	it("adds the paired wallet's Substrate and Ethereum accounts, then removes both when the session ends", async () => {
		const { pairWalletConnect, endWalletConnectSession } = await loadPortal()

		pairWalletConnect({
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET), on(MOONBEAM)] },
		})

		await vi.waitFor(async () =>
			expect(await ownAddresses()).toEqual(expect.arrayContaining([bob.address, evmAddress]))
		)
		expect(evmAddresses()).toEqual([evmAddress])
		expect(getConnection(config).chainId).toBe(MAINNET)

		endWalletConnectSession()

		await vi.waitFor(async () => expect(await ownAddresses()).toEqual([]))
		expect(evmAddresses()).toEqual([])
	})

	it("adds no Ethereum connection for a Polkadot-only session", async () => {
		const { pairWalletConnect } = await loadPortal()

		pairWalletConnect({ walletName: "Nova Wallet", addresses: [alice.address] })

		await vi.waitFor(async () => expect(await ownAddresses()).toEqual([alice.address]))
		expect(getConnection(config).status).toBe("disconnected")
	})

	it("counts an Ethereum-only session as no Substrate wallet", async () => {
		const { pairWalletConnect } = await loadPortal()

		pairWalletConnect({
			walletName: "MetaMask",
			addresses: [],
			evm: { accounts: [on(MAINNET)] },
		})

		await vi.waitFor(() => expect(evmAddresses()).toEqual([evmAddress]))
		expect(await firstValueFrom(harness.hasConnectedSubstrateWallet$)).toBe(false)
	})

	it("routes Ethereum requests to the session's current chain", async () => {
		const { pairWalletConnect, walletConnectRequests } = await loadPortal()
		pairWalletConnect({
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET), on(MOONBEAM)] },
		})
		await vi.waitFor(() => expect(evmAddresses()).toHaveLength(1))

		await signMessage(config, { message: "on mainnet" })
		await switchChain(config, { chainId: MOONBEAM })
		await signMessage(config, { message: "on moonbeam" })

		expect(
			walletConnectRequests
				.filter(({ method }) => method === "personal_sign")
				.map(({ chain }) => chain)
		).toEqual([`eip155:${MAINNET}`, `eip155:${MOONBEAM}`])
		expect(getConnection(config).chainId).toBe(MOONBEAM)
	})

	it("exposes only the accounts the session approved on the current chain", async () => {
		const { pairWalletConnect } = await loadPortal()
		pairWalletConnect({
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET), on(MOONBEAM, otherEvmAddress)] },
		})
		await vi.waitFor(() => expect(evmAddresses()).toEqual([evmAddress]))

		await switchChain(config, { chainId: MOONBEAM })

		expect(evmAddresses()).toEqual([otherEvmAddress])
	})

	it("drops the Ethereum connection when the wallet withdraws the current chain's accounts", async () => {
		const { pairWalletConnect, updateEthereumAccounts } = await loadPortal()
		pairWalletConnect({
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET), on(MOONBEAM)] },
		})
		await vi.waitFor(() => expect(evmAddresses()).toEqual([evmAddress]))

		updateEthereumAccounts([on(MOONBEAM)])

		await vi.waitFor(() => expect(connectionsByConnector()).toEqual([]))
		expect(await ownAddresses()).toEqual([bob.address])
	})

	it("connects once when the portal restarts the mirror mid-connect", async () => {
		harness = await load()
		const { pairWalletConnect } = await import("@/test/walletconnect")
		const { walletConnectEvm, mirrorWalletConnectSession } = await import("./walletconnect-evm")
		pairWalletConnect({
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET)] },
		})
		config = createConfig({
			chains: [mainnet],
			connectors: [walletConnectEvm()],
			storage: null,
			transports: { [mainnet.id]: http() },
		})
		const connector = config.connectors[0] as NonNullable<(typeof config.connectors)[0]>
		const connectSession = connector.connect.bind(connector)
		let stopMirror: () => void = () => undefined
		const connects = vi.spyOn(connector, "connect").mockImplementationOnce((parameters) => {
			stopMirror()
			stopMirror = mirrorWalletConnectSession(config)
			return connectSession(parameters)
		})

		stopMirror = mirrorWalletConnectSession(config)

		await vi.waitFor(() => expect(evmAddresses()).toEqual([evmAddress]))
		expect(connects).toHaveBeenCalledTimes(1)
		stopMirror()
	})

	it("keeps the accounts the wallet switched to while wagmi was connecting", async () => {
		harness = await load()
		const { pairWalletConnect, updateEthereumAccounts } = await import("@/test/walletconnect")
		const { walletConnectEvm, mirrorWalletConnectSession } = await import("./walletconnect-evm")
		pairWalletConnect({
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET)] },
		})
		config = createConfig({
			chains: [mainnet],
			connectors: [walletConnectEvm()],
			storage: null,
			transports: { [mainnet.id]: http() },
		})
		const connector = config.connectors[0] as NonNullable<(typeof config.connectors)[0]>
		const connectSession = connector.connect.bind(connector)
		vi.spyOn(connector, "connect").mockImplementationOnce(async (parameters) => {
			const connection = await connectSession(parameters)
			updateEthereumAccounts([on(MAINNET, otherEvmAddress)])
			await new Promise((resolve) => setTimeout(resolve, 20))
			return connection
		})

		const stopMirror = mirrorWalletConnectSession(config)

		await vi.waitFor(() => expect(evmAddresses()).toEqual([otherEvmAddress]))
		stopMirror()
	})

	it("mirrors a session that returns after a restarted mirror dropped the stale connection", async () => {
		harness = await load()
		const { pairWalletConnect, endWalletConnectSession } = await import("@/test/walletconnect")
		const { walletConnectEvm, mirrorWalletConnectSession } = await import("./walletconnect-evm")
		const session = {
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET)] as [ReturnType<typeof on>] },
		}
		pairWalletConnect(session)
		config = createConfig({
			chains: [mainnet],
			connectors: [walletConnectEvm()],
			storage: null,
			transports: { [mainnet.id]: http() },
		})
		const stopFirstMirror = mirrorWalletConnectSession(config)
		await vi.waitFor(() => expect(evmAddresses()).toEqual([evmAddress]))
		stopFirstMirror()
		endWalletConnectSession()
		await vi.waitFor(async () =>
			expect(await firstValueFrom(harness.walletConnectWallet$)).toMatchObject({ platforms: [] })
		)

		const stopMirror = mirrorWalletConnectSession(config)
		expect(evmAddresses()).toEqual([])
		pairWalletConnect(session)

		await vi.waitFor(() => expect(evmAddresses()).toEqual([evmAddress]))
		stopMirror()
	})

	it("leaves an unresponsive session unmirrored without retrying", async () => {
		vi.spyOn(console, "error").mockImplementation(() => undefined)
		const { pairWalletConnect, walletConnectRequests } = await loadPortal()

		pairWalletConnect({
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET)], unresponsive: true },
		})

		await vi.waitFor(() => expect(walletConnectRequests).toHaveLength(1))
		await new Promise((resolve) => setTimeout(resolve, 100))
		expect(walletConnectRequests).toHaveLength(1)
		expect(evmAddresses()).toEqual([])
	})

	it("refuses to switch to a chain the session did not approve", async () => {
		const { pairWalletConnect } = await loadPortal()
		pairWalletConnect({
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET)] },
		})
		await vi.waitFor(() => expect(evmAddresses()).toHaveLength(1))

		await expect(switchChain(config, { chainId: ARBITRUM })).rejects.toThrow(
			"Nova Wallet did not approve Arbitrum One for this session"
		)
		expect(getConnection(config).chainId).toBe(MAINNET)
	})

	it("mirrors a restored session while wagmi reconnects an injected wallet", async () => {
		installInjectedWallet(otherEvmAddress, 50)
		harness = await load()
		const { pairWalletConnect } = await import("@/test/walletconnect")
		pairWalletConnect({
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET)] },
		})

		await renderPortal()

		await vi.waitFor(() =>
			expect(connectionsByConnector()).toEqual([
				["injected", [otherEvmAddress]],
				["walletConnect", [evmAddress]],
			])
		)
	})

	it("keeps the mirror whichever microtask wagmi's reconnect lands on", async () => {
		harness = await load()
		const { pairWalletConnect } = await import("@/test/walletconnect")
		const { walletConnectEvm, mirrorWalletConnectSession } = await import("./walletconnect-evm")
		pairWalletConnect({
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET)] },
		})

		const landings = []
		for (let microtasks = 0; microtasks < 10; microtasks++) {
			const injectedWallet = createConnector(() => ({
				id: "injected",
				name: "Injected",
				type: "injected",
				getProvider: async () => ({}),
				isAuthorized: async () => true,
				connect: async () => {
					for (let i = 0; i < microtasks; i++) await Promise.resolve()
					return { accounts: [otherEvmAddress] as never, chainId: MAINNET }
				},
				disconnect: async () => undefined,
				getAccounts: async () => [otherEvmAddress],
				getChainId: async () => MAINNET,
				onAccountsChanged: () => undefined,
				onChainChanged: () => undefined,
				onDisconnect: () => undefined,
			}))
			config = createConfig({
				chains: [mainnet],
				connectors: [injectedWallet, walletConnectEvm()],
				storage: null,
				transports: { [mainnet.id]: http() },
			})
			const reconnecting = reconnect(config, { connectors: [injectedWallet] })
			const stopMirroring = mirrorWalletConnectSession(config)
			await reconnecting
			await vi.waitFor(() => expect(config.state.connections.size).toBe(2))
			landings.push(connectionsByConnector().map(([id]) => id))
			stopMirroring()
		}

		expect(new Set(landings.map(String))).toEqual(new Set(["injected,walletConnect"]))
	})

	it("stops following the session once the portal swaps its wagmi config", async () => {
		const { pairWalletConnect } = await loadPortal()
		pairWalletConnect({
			walletName: "Nova Wallet",
			addresses: [bob.address],
			evm: { accounts: [on(MAINNET), on(MOONBEAM)] },
		})
		await vi.waitFor(() => expect(evmAddresses()).toHaveLength(1))
		const { wagmiConfig } = await import("./wagmi")
		const { mirrorWalletConnectSession } = await import("./walletconnect-evm")
		expect(wagmiConfig).not.toBe(config)
		const stopMirroring = mirrorWalletConnectSession(wagmiConfig)
		await vi.waitFor(() => expect(getConnection(wagmiConfig).chainId).toBe(MAINNET))
		stopMirroring()

		await switchChain(config, { chainId: MOONBEAM })

		expect(getConnection(config).chainId).toBe(MOONBEAM)
		expect(getConnection(wagmiConfig).chainId).toBe(MAINNET)
	})
})
