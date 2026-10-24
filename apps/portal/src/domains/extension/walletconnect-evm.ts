import type { AppKit } from "@reown/appkit/core"
import {
	ChainNotConfiguredError,
	type Config,
	type Connector,
	connect,
	createConnector,
	ProviderNotFoundError,
} from "@wagmi/core"
import {
	combineLatest,
	concatMap,
	distinctUntilChanged,
	filter,
	firstValueFrom,
	map,
	merge,
	Observable,
	of,
	share,
	startWith,
	switchMap,
	tap,
} from "rxjs"
import { type Address, getAddress, isAddress, SwitchChainError } from "viem"
import { type LiveWalletConnectWallet, walletConnectWallet$ } from "./kheopskit"
import { toEvmWalletConnectNetwork } from "./walletconnect"

export const walletConnectConnectorId = "walletConnect"

type RequestArguments = { method: string; params?: unknown }

type SessionEvent = {
	topic: string
	params: { chainId: string; event: { name: string; data: unknown } }
}

type UniversalProvider = {
	session?: { topic: string; namespaces: Record<string, { accounts?: string[] }> }
	client: {
		on(event: "session_event", listener: (event: SessionEvent) => void): void
		off(event: "session_event", listener: (event: SessionEvent) => void): void
	}
	request(args: RequestArguments, chain: `eip155:${number}`): Promise<unknown>
	setDefaultChain(chain: `eip155:${number}`): void
	on(event: string, listener: () => void): void
	off(event: string, listener: () => void): void
}

type SessionAccount = { chainId: number; address: Address }

type EvmConnection = { chainId: number; accounts: readonly Address[] }

const parseEip155Account = (caip10: string): SessionAccount[] => {
	const [namespace, chainId, address] = caip10.split(":")
	return namespace === "eip155" && address !== undefined && isAddress(address)
		? [{ chainId: Number(chainId), address: getAddress(address) }]
		: []
}

const providerOf = (wallet: LiveWalletConnectWallet | undefined) =>
	wallet?.platforms.includes("ethereum")
		? wallet.appKit.getProvider<UniversalProvider>("eip155")
		: undefined

const sessionAccountsOf = (provider: UniversalProvider) =>
	(provider.session?.namespaces["eip155"]?.accounts ?? []).flatMap(parseEip155Account)

const selectedAccounts = new WeakMap<UniversalProvider, { topic: string; addresses: Address[] }>()

const isEvmAccountSelection = (provider: UniversalProvider, { topic, params }: SessionEvent) =>
	topic === provider.session?.topic &&
	params.event.name === "accountsChanged" &&
	params.chainId.startsWith("eip155:")

const selectAccounts = (provider: UniversalProvider, event: SessionEvent) => {
	if (!isEvmAccountSelection(provider, event)) return
	const { data } = event.params.event
	const addresses = (Array.isArray(data) ? data : [])
		.map((account) => String(account).split(":").at(-1) ?? "")
		.filter((address) => isAddress(address))
		.map((address) => getAddress(address))
	selectedAccounts.set(provider, { topic: event.topic, addresses })
}

const preferSelected = (provider: UniversalProvider, approved: Address[]) => {
	const selection = selectedAccounts.get(provider)
	const selected =
		selection && selection.topic === provider.session?.topic
			? selection.addresses.filter((address) => approved.includes(address))
			: []
	return selected.length > 0 ? selected : approved
}

const chainIdOf = async (provider: UniversalProvider) => {
	const [anyAccount] = sessionAccountsOf(provider)
	if (!anyAccount) throw new ProviderNotFoundError()
	return Number(await provider.request({ method: "eth_chainId" }, `eip155:${anyAccount.chainId}`))
}

const connectionOf = async (provider: UniversalProvider): Promise<EvmConnection | undefined> => {
	const sessionAccounts = sessionAccountsOf(provider)
	if (sessionAccounts.length === 0) return undefined
	const chainId = await chainIdOf(provider)
	const approved = [
		...new Set(
			sessionAccounts.filter((account) => account.chainId === chainId).map(({ address }) => address)
		),
	]
	const accounts = preferSelected(provider, approved)
	return accounts.length > 0 ? { chainId, accounts } : undefined
}

const sameConnection = (a: EvmConnection | undefined, b: EvmConnection | undefined) =>
	a?.chainId === b?.chainId && a?.accounts.join() === b?.accounts.join()

const currentWallet = () => firstValueFrom(walletConnectWallet$)

const requireProvider = async () => {
	const provider = providerOf(await currentWallet())
	if (!provider) throw new ProviderNotFoundError()
	return provider
}

const requireConnection = async () => {
	const connection = await connectionOf(await requireProvider())
	if (!connection) throw new ProviderNotFoundError()
	return connection
}

const eip1193Of = (provider: UniversalProvider) => ({
	request: async (args: RequestArguments) =>
		provider.request(args, `eip155:${await chainIdOf(provider)}`),
})

const announceChange = async (emitter: Connector["emitter"]) => {
	const provider = providerOf(await currentWallet())
	const connection = provider && (await connectionOf(provider))
	if (connection) emitter.emit("change", connection)
}

export const walletConnectEvm = () =>
	createConnector<ReturnType<typeof eip1193Of>>((config) => {
		const onChange = () => {
			announceChange(config.emitter).catch(console.error)
		}

		return {
			id: walletConnectConnectorId,
			name: "WalletConnect",
			type: walletConnectConnectorId,
			async connect({ withCapabilities } = {}) {
				const { chainId, accounts } = await requireConnection()
				return {
					accounts: (withCapabilities
						? accounts.map((address) => ({ address, capabilities: {} }))
						: accounts) as never,
					chainId,
				}
			},
			async disconnect() {
				await (await currentWallet())?.disconnect()
			},
			getAccounts: async () => (await requireConnection()).accounts,
			getChainId: async () => chainIdOf(await requireProvider()),
			getProvider: async () => eip1193Of(await requireProvider()),
			isAuthorized: async () => false,
			async switchChain({ chainId }) {
				const chain = config.chains.find(({ id }) => id === chainId)
				if (!chain) throw new SwitchChainError(new ChainNotConfiguredError())
				const wallet = await currentWallet()
				const provider = await requireProvider()
				if (!sessionAccountsOf(provider).some((account) => account.chainId === chainId))
					throw new SwitchChainError(
						new Error(`${wallet?.name} did not approve ${chain.name} for this session`)
					)
				const appKit = wallet?.appKit as unknown as Pick<AppKit, "switchNetwork">
				await appKit.switchNetwork(toEvmWalletConnectNetwork(chain))
				// AppKit moves the provider's default chain only while eip155 is its active namespace.
				provider.setDefaultChain(`eip155:${chainId}`)
				config.emitter.emit("change", await requireConnection())
				return chain
			},
			onAccountsChanged: onChange,
			onChainChanged: onChange,
			onDisconnect() {
				config.emitter.emit("disconnect")
			},
		}
	})

const sessionEvents = [
	"accountsChanged",
	"chainChanged",
	"session_update",
	"session_delete",
	"disconnect",
] as const

const sessionChanges$ = (provider: UniversalProvider) =>
	new Observable<void>((subscriber) => {
		const next = () => subscriber.next()
		const onSessionEvent = (event: SessionEvent) => {
			selectAccounts(provider, event)
			if (isEvmAccountSelection(provider, event)) subscriber.next()
		}
		for (const event of sessionEvents) provider.on(event, next)
		provider.client.on("session_event", onSessionEvent)
		return () => {
			for (const event of sessionEvents) provider.off(event, next)
			provider.client.off("session_event", onSessionEvent)
		}
	})

const liveConnectionOf$ = (provider: UniversalProvider | undefined) =>
	provider
		? sessionChanges$(provider).pipe(
				startWith(undefined),
				switchMap(() =>
					connectionOf(provider).catch((error) => {
						console.error(error)
						return undefined
					})
				)
			)
		: of(undefined)

const wagmiState$ = (config: Config) =>
	new Observable<Config["state"]>((subscriber) => {
		const unsubscribe = config.subscribe(
			(state) => state,
			(state) => subscriber.next(state)
		)
		subscriber.next(config.state)
		return unsubscribe
	})

const pendingConnects = new WeakMap<Config, Promise<unknown>>()

const connectOnce = (config: Config, connector: Connector) => {
	const pending =
		pendingConnects.get(config) ??
		connect(config, { connector }).finally(() => pendingConnects.delete(config))
	pendingConnects.set(config, pending)
	return pending
}

export const mirrorWalletConnectSession = (config: Config) => {
	const connector = config.connectors.find(({ id }) => id === walletConnectConnectorId)
	if (!connector) return () => undefined

	const connection$ = walletConnectWallet$.pipe(
		map(providerOf),
		distinctUntilChanged(),
		switchMap(liveConnectionOf$),
		distinctUntilChanged(sameConnection),
		share()
	)

	const isMirrored = () => config.state.connections.has(connector.uid)

	const mirror = async (usable: boolean) => {
		if (usable && !isMirrored()) {
			await connectOnce(config, connector)
			await announceChange(connector.emitter)
		}
		if (!usable && isMirrored()) connector.onDisconnect()
	}

	const subscription = merge(
		combineLatest([
			connection$.pipe(map(Boolean), distinctUntilChanged()),
			wagmiState$(config).pipe(map(isMirrored), distinctUntilChanged()),
		]).pipe(
			filter(([usable, mirrored]) => usable !== mirrored),
			concatMap(([usable]) => mirror(usable).catch(console.error))
		),
		connection$.pipe(
			tap((connection) => {
				if (connection) connector.emitter.emit("change", connection)
			})
		)
	).subscribe()

	return () => subscription.unsubscribe()
}
