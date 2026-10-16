import type { PostHog, PostHogConfig } from "posthog-js/no-external"
import { afterEach, beforeEach, describe, expect, it, onTestFinished, vi } from "vitest"

import { ERROR_CATEGORIES } from "./errorCategory"
import { consentKindOf } from "./events"
import { ERROR_CLASSES, EXCEPTION_MECHANISMS } from "./exception"
import { watchLoadedScripts } from "./loadedScripts"
import { POSTHOG_API_HOST } from "./posthogProject"
import { ROUTE_PATTERN_VALUES } from "./routePatterns"
import { SDK_FIELDS } from "./scrub"

type SentEvent = {
	event: string
	properties: Record<string, unknown>
	$set?: Record<string, unknown>
	$set_once?: Record<string, unknown>
}

const sdk = vi.hoisted(() => ({
	imports: 0,
	instance: undefined as PostHog | undefined,
	withoutRetryQueue: false,
	captured: [] as string[],
	unscrubbed: [] as { event: string; properties: Record<string, unknown> }[],
}))

vi.mock("posthog-js/no-external", async (importOriginal) => {
	sdk.imports++
	const actual = await importOriginal<typeof import("posthog-js/no-external")>()
	class TestPostHog extends actual.PostHog {
		override init(token: string, config?: Partial<PostHogConfig>, name?: string) {
			sdk.instance = this
			const beforeSend = config?.before_send
			const recordUnscrubbed: typeof beforeSend = (event) => {
				if (event) sdk.unscrubbed.push(structuredClone(event))
				return typeof beforeSend === "function" ? beforeSend(event) : event
			}
			const loaded = super.init(
				token,
				{ ...config, disable_compression: true, before_send: recordUnscrubbed },
				name
			)
			this.on("eventCaptured", ({ event }: { event: string }) => sdk.captured.push(event))
			if (sdk.withoutRetryQueue) this._retryQueue = undefined
			return loaded
		}
	}
	return { ...actual, PostHog: TestPostHog }
})

const TOKEN = "phc_portalTestToken4f9a2c7e1b3d5f8a0c2e4b6d8f1a"
const LOADED_SCRIPT = `${location.origin}/assets/index-Ab12Cd34.js`
const APP_COMMIT = "d42cae12ca014a1d5116ca8ce87dd0c385c437d5"

type ResourceEntry = { name: string; responseStatus?: number }

const resources = {
	buffered: [] as ResourceEntry[],
	observers: [] as ((entries: ResourceEntry[]) => void)[],
	buffer(entry: ResourceEntry) {
		this.buffered.push(entry)
	},
	load(entry: ResourceEntry) {
		this.buffered.push(entry)
		for (const observer of this.observers) observer([entry])
	},
}

const served = (name: string): ResourceEntry => ({ name, responseStatus: 200 })

const FORGED_ASSET = `${location.origin}/assets/AliceStash-Ab12Cd34.js`

class FakePerformanceObserver {
	static supportedEntryTypes = ["resource"]
	constructor(private readonly callback: (list: { getEntries: () => ResourceEntry[] }) => void) {}
	observe({ buffered }: { buffered?: boolean }) {
		const deliver = (entries: ResourceEntry[]) => this.callback({ getEntries: () => entries })
		resources.observers.push(deliver)
		if (buffered) deliver(resources.buffered)
	}
}

vi.stubGlobal("PerformanceObserver", FakePerformanceObserver)

const errorListeners: [string, EventListenerOrEventListenerObject][] = []
const addEventListener = window.addEventListener.bind(window)
vi.spyOn(window, "addEventListener").mockImplementation(
	(type: string, listener: EventListenerOrEventListenerObject, options?: unknown) => {
		if (type === "error" || type === "unhandledrejection") errorListeners.push([type, listener])
		addEventListener(type, listener, options as AddEventListenerOptions)
	}
)

const requests: { url: string; body: unknown }[] = []

const decodeForm = (body: string) =>
	body.startsWith("data=")
		? Buffer.from(decodeURIComponent(body.slice("data=".length)), "base64").toString()
		: body

const beaconReads: Promise<unknown>[] = []
const network = { failNext: false }

vi.stubGlobal(
	"fetch",
	vi.fn(async (url: string, init?: RequestInit) => {
		requests.push({ url: String(url), body: init?.body })
		const status = network.failNext ? 500 : 200
		network.failNext = false
		return new Response("{}", { status })
	})
)
vi.spyOn(XMLHttpRequest.prototype, "open").mockImplementation(
	(_method: string, url: string | URL) => {
		requests.push({ url: String(url), body: undefined })
	}
)
Object.defineProperty(navigator, "sendBeacon", {
	configurable: true,
	value: (url: string, body: Blob) => {
		beaconReads.push(body.text().then((text) => requests.push({ url, body: decodeForm(text) })))
		return true
	},
})

const sdkWrites: string[] = []

const setItem = Storage.prototype.setItem
vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
	if (key.startsWith("ph_") || key.startsWith("__ph")) sdkWrites.push(key)
	setItem.call(this, key, value)
})

const cookie = Object.getOwnPropertyDescriptor(Document.prototype, "cookie")
Object.defineProperty(document, "cookie", {
	configurable: true,
	get: () => cookie?.get?.call(document),
	set: (value: string) => {
		sdkWrites.push(`cookie:${value}`)
		cookie?.set?.call(document, value)
	},
})

const SS58 = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
const DAVE = "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y"

const sentEvents = (): SentEvent[] =>
	requests.flatMap(({ body }) => (typeof body === "string" ? JSON.parse(body).batch : []))

const posthogStorageKeys = () =>
	[localStorage, sessionStorage].flatMap((storage) =>
		Object.keys(storage).filter((key) => key.startsWith("ph_") || key.startsWith("__ph"))
	)

const PAST_FLUSH_MS = 3_500

const flush = async (ms = PAST_FLUSH_MS) => {
	await vi.advanceTimersByTimeAsync(ms)
	await Promise.all(beaconReads)
}

const clientReady = () => vi.waitFor(() => expect(sdk.instance?.__loaded).toBe(true))

const sentEventNames = () => sentEvents().map(({ event }) => event)

const loadDomain = async () => ({
	...(await import("./consent")),
	...(await import("./client")),
})

const navigateTo = (url: string) => history.replaceState(null, "", url)

const expectNothingStored = () => {
	expect(sdkWrites).toEqual([])
	expect(posthogStorageKeys()).toEqual([])
	expect(document.cookie).toBe("")
}

const expectNothingSentOrStored = () => {
	expect(requests).toEqual([])
	expectNothingStored()
}

beforeEach(() => {
	vi.useFakeTimers()
	vi.resetModules()
	vi.stubEnv("VITE_ANALYTICS_LOCAL", "true")
	vi.stubEnv("VITE_POSTHOG_AUTH_TOKEN", TOKEN)
	vi.stubEnv("VITE_APP_COMMIT", APP_COMMIT)
	for (const [type, listener] of errorListeners.splice(0))
		window.removeEventListener(type, listener)
	resources.buffered = []
	resources.observers.length = 0
	resources.buffer(served(LOADED_SCRIPT))
	localStorage.clear()
	sessionStorage.clear()
	requests.length = 0
	beaconReads.length = 0
	network.failNext = false
	sdkWrites.length = 0
	sdk.imports = 0
	sdk.instance = undefined
	sdk.withoutRetryQueue = false
	sdk.captured.length = 0
	sdk.unscrubbed.length = 0
	navigateTo("/")
})

const ROUTES: ReadonlySet<string> = new Set(ROUTE_PATTERN_VALUES)
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const ISO_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
const LABEL = "(?:[a-z0-9-]{1,31}|<address>|<hash>|<id>)"
const HOST = new RegExp(`^(?:${LABEL}\\.)*${LABEL}$|^<ip>$`, "i")
const OTHER_ORIGIN = /^https?:\/\/([^/]+)$/

type Shape = (value: string) => boolean

const matches =
	(pattern: RegExp): Shape =>
	(value) =>
		pattern.test(value)
const oneOf =
	(...values: readonly string[]): Shape =>
	(value) =>
		values.includes(value)
const isRoute: Shape = (value) => ROUTES.has(value)
const isAppUrl: Shape = (value) =>
	value.startsWith(location.origin) && isRoute(value.slice(location.origin.length))
const isHost: Shape = (value) => value === "$direct" || HOST.test(value)
const isReferrer: Shape = (value) =>
	value === "$direct" || isAppUrl(value) || isHost(OTHER_ORIGIN.exec(value)?.[1] ?? "")
const isLoadedScript: Shape = (value) => watchLoadedScripts()(value)

const SDK_SHAPES: Record<string, Shape> = {
	token: oneOf(TOKEN),
	distinct_id: matches(UUID),
	$device_id: matches(UUID),
	$anon_distinct_id: matches(UUID),
	$session_id: matches(UUID),
	$window_id: matches(UUID),
	$pageview_id: matches(UUID),
	$prev_pageview_id: matches(UUID),
	$insert_id: matches(/^[0-9a-z]{16}$/),
	$current_url: isAppUrl,
	$session_entry_url: isAppUrl,
	$initial_current_url: isAppUrl,
	$referrer: isReferrer,
	$session_entry_referrer: isReferrer,
	$initial_referrer: isReferrer,
	$host: isHost,
	$session_entry_host: isHost,
	$initial_host: isHost,
	$referring_domain: isHost,
	$session_entry_referring_domain: isHost,
	$initial_referring_domain: isHost,
	$pathname: isRoute,
	$session_entry_pathname: isRoute,
	$initial_pathname: isRoute,
	$prev_pageview_pathname: isRoute,
	$os: oneOf("Windows", "Mac OS X", "iOS", "Android", "Linux", "Chrome OS", "Windows Phone"),
	$os_version: matches(/^[\d._]+$/),
	$browser: oneOf(
		"Chrome",
		"Chrome iOS",
		"Firefox",
		"Firefox iOS",
		"Safari",
		"Mobile Safari",
		"Microsoft Edge",
		"Opera",
		"Samsung Internet",
		"Brave"
	),
	$browser_version: matches(/^[\d.]+$/),
	$device_type: oneOf("Desktop", "Mobile", "Tablet"),
	$raw_user_agent: oneOf(navigator.userAgent),
	$browser_language: oneOf(navigator.language),
	$browser_language_prefix: oneOf(navigator.language.split("-")[0] ?? ""),
	$timezone: oneOf(Intl.DateTimeFormat().resolvedOptions().timeZone),
	$lib: oneOf("web"),
	$lib_version: matches(/^\d+\.\d+\.\d+$/),
	$lib_custom_api_host: oneOf(POSTHOG_API_HOST),
	$sdk_dist_channel: oneOf("npm"),
	$sdk_debug_extensions_init_method: oneOf("synchronous", "deferred"),
	$initialization_time: matches(ISO_TIME),
	$config_defaults: oneOf("unset"),
	$recording_status: oneOf("disabled"),
	title: oneOf("Talisman Portal"),
	environment: oneOf("production", "preview", "development"),
	app_version: oneOf(APP_COMMIT),
	$exception_level: oneOf("error"),
	exception_type: (value) => ERROR_CLASSES.has(value),
	error_category: oneOf(...ERROR_CATEGORIES),
	mechanism: oneOf(...EXCEPTION_MECHANISMS),
	"$exception_list[].type": (value) => ERROR_CLASSES.has(value),
	"$exception_list[].value": oneOf("", ...ERROR_CATEGORIES),
	"$exception_list[].mechanism.type": oneOf("chained", ...EXCEPTION_MECHANISMS),
	"$exception_list[].mechanism.source": oneOf("cause", "member"),
	"$exception_list[].stacktrace.type": oneOf("raw"),
	"$exception_list[].stacktrace.frames[].platform": oneOf("web:javascript"),
	"$exception_list[].stacktrace.frames[].filename": isLoadedScript,
	"$exception_list[].stacktrace.frames[].function": oneOf("?"),
	"$exception_list[].stacktrace.frames[].chunk_id": matches(UUID),
}

const EVENT_SHAPES: Record<string, Shape> = {
	uuid: matches(UUID),
	event: (value) => consentKindOf(value) !== undefined,
	timestamp: matches(ISO_TIME),
}

const stringsOf = (value: unknown, path: string): [string, string][] => {
	if (typeof value === "string") return [[path, value]]
	if (Array.isArray(value)) return value.flatMap((item) => stringsOf(item, `${path}[]`))
	if (typeof value !== "object" || value === null) return []
	return Object.entries(value).flatMap(([key, child]) =>
		stringsOf(child, path ? `${path}.${key}` : key)
	)
}

type IsCatalogValue = (eventName: string, key: string, value: unknown) => boolean

const unshapedStrings =
	(isCatalogValue: IsCatalogValue) =>
	({ event, properties, $set, $set_once, ...fields }: SentEvent) => [
		...stringsOf(fields, "").filter(([path, value]) => EVENT_SHAPES[path]?.(value) !== true),
		...[properties, $set, $set_once].flatMap((props) =>
			Object.entries(props ?? {})
				.filter(([key, value]) => !isCatalogValue(event, key, value))
				.flatMap(([key, value]) => stringsOf(value, key))
				.filter(([path, value]) => SDK_SHAPES[path]?.(value) !== true)
		),
		...(EVENT_SHAPES["event"]?.(event) ? [] : [["event", event]]),
	]

afterEach(async () => {
	const { isCatalogValue } = await import("./events")
	expect(sentEvents().flatMap(unshapedStrings(isCatalogValue))).toEqual([])
	vi.useRealTimers()
	vi.unstubAllEnvs()
	for (const { url } of requests) {
		expect(url.startsWith(`${POSTHOG_API_HOST}/`)).toBe(true)
		expect(url).not.toContain("posthog.com")
	}
})

describe("analytics consent gating", () => {
	it("loads, sends and stores nothing while the user is undecided", async () => {
		const { startAnalytics, trackPageview, track, captureError } = await loadDomain()
		startAnalytics()
		trackPageview("/staking/providers")
		track("$pageview", { route: "/staking/providers" })
		captureError(new Error("boom"))
		await flush()

		expect(sdk.imports).toBe(0)
		expectNothingSentOrStored()
	})

	it("loads, sends and stores nothing after a reject", async () => {
		const { rejectAll, startAnalytics, trackPageview, track, captureError } = await loadDomain()
		rejectAll()
		startAnalytics()
		trackPageview("/staking/providers")
		track("$pageview", { route: "/staking/providers" })
		captureError(new Error("boom"))
		await flush()

		expect(sdk.imports).toBe(0)
		expectNothingSentOrStored()
	})

	it("sends and stores nothing with errors-only consent while no error is reported", async () => {
		const { setConsent, startAnalytics, trackPageview, track } = await loadDomain()
		setConsent({ analytics: false, errors: true })
		startAnalytics()
		trackPageview("/staking/providers")
		track("Substrate extensions connected", { wallet: "talisman" })
		await clientReady()
		await flush()

		expectNothingSentOrStored()
	})

	it("sends only $exception events with errors-only consent, and stores nothing", async () => {
		const { setConsent, startAnalytics, trackPageview, track, captureError } = await loadDomain()
		setConsent({ analytics: false, errors: true })
		startAnalytics()
		trackPageview("/staking/providers")
		track("$pageview", { route: "/staking/providers" })
		captureError(new Error(`failed for ${SS58} in pool ${DAVE}`))
		await clientReady()
		sdk.instance?.capture("$pageview", { route: "/staking/providers" })
		await flush()

		expect(sentEventNames()).toEqual(["$exception"])
		const body = JSON.stringify(sentEvents())
		for (const leak of ["failed for", SS58, DAVE]) expect(body).not.toContain(leak)
		expectNothingStored()
	})

	it("sends nothing in development without the local flag, whatever the consent", async () => {
		vi.stubEnv("VITE_ANALYTICS_LOCAL", "")
		const { acceptAll, startAnalytics, trackPageview, captureError } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		captureError(new Error("boom"))
		await flush()

		expect(sdk.imports).toBe(0)
		expectNothingSentOrStored()
	})

	it("sends nothing from a build without a project token, whatever the consent", async () => {
		vi.stubEnv("VITE_POSTHOG_AUTH_TOKEN", "")
		const { acceptAll, startAnalytics, trackPageview, captureError } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		captureError(new Error("boom"))
		await flush()

		expect(sdk.imports).toBe(0)
		expectNothingSentOrStored()
	})

	it("drops every event outside the catalog, whatever the consent", async () => {
		const { acceptAll, startAnalytics, captureError } = await loadDomain()
		acceptAll()
		startAnalytics()
		captureError(new Error("boom"))
		await clientReady()
		for (const event of ["$opt_in", "$identify", "$web_vitals", "$pageleave", "$set", "custom"])
			sdk.instance?.capture(event)
		await flush()

		expect(sentEventNames()).toEqual(["$exception"])
	})

	it("sends scrubbed pageviews with analytics consent and persists the anonymous id", async () => {
		const { setConsent, startAnalytics, trackPageview, captureError } = await loadDomain()
		setConsent({ analytics: true, errors: false })
		startAnalytics()
		navigateTo(`/portfolio/${SS58}?account=${DAVE}#history`)
		trackPageview(location.pathname)
		captureError(new Error("boom"))
		await clientReady()
		await flush()

		expect(sentEventNames()).toEqual(["$pageview"])
		const [pageview] = sentEvents()
		expect(pageview?.properties).toMatchObject({
			route: "/portfolio/:rest",
			$current_url: `${location.origin}/portfolio/:rest`,
			$pathname: "/portfolio/:rest",
			environment: "development",
			app_version: APP_COMMIT,
		})

		const stored = posthogStorageKeys().map((key) => localStorage.getItem(key) ?? "")
		expect(
			stored.some((value) => value.includes(String(pageview?.properties["distinct_id"])))
		).toBe(true)
		for (const leak of [SS58, DAVE, "account", "history"])
			expect(JSON.stringify(requests)).not.toContain(leak)
		expect(document.cookie).toBe("")
	})

	it("names the page route the same way as its scrubbed pathname", async () => {
		const { acceptAll, startAnalytics, trackPageview } = await loadDomain()
		acceptAll()
		startAnalytics()
		navigateTo(`/staking/providers?action=stake&type=nomination-pools&account=${SS58}`)
		trackPageview(location.pathname)
		await clientReady()
		await flush()

		expect(sentEvents()).toHaveLength(1)
		expect(sentEvents()[0]?.properties).toMatchObject({
			route: "/staking/providers",
			$pathname: "/staking/providers",
		})
		expect(JSON.stringify(requests)).not.toContain(SS58)
	})

	it("sends a referring site as its host, with an address label redacted", async () => {
		const referrer = vi
			.spyOn(document, "referrer", "get")
			.mockReturnValue(`https://${DAVE}.example.com/vault?account=${DAVE}`)
		onTestFinished(() => referrer.mockRestore())
		const { acceptAll, startAnalytics, trackPageview } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		await clientReady()
		await flush()

		expect(sentEvents()[0]?.properties).toMatchObject({
			$referrer: "https://<address>.example.com",
			$referring_domain: "<address>.example.com",
		})
		expect(JSON.stringify(requests).toLowerCase()).not.toContain(DAVE.toLowerCase())
	})

	it("stops capture and clears persistence when analytics is withdrawn", async () => {
		const { acceptAll, setConsent, startAnalytics, trackPageview, track, captureError } =
			await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		await clientReady()
		await flush()
		expect(sentEventNames()).toEqual(["$pageview"])
		expect(posthogStorageKeys()).not.toEqual([])
		const analyticsId = sentEvents()[0]?.properties["distinct_id"]

		setConsent({ analytics: false, errors: true })
		await flush(0)
		expect(posthogStorageKeys()).toEqual([])

		trackPageview("/staking/positions")
		track("Substrate extensions connected", { wallet: "talisman" })
		captureError(new Error("boom"))
		await flush()

		const [, exception] = sentEvents()
		expect(sentEventNames()).toEqual(["$pageview", "$exception"])
		expect(exception?.properties["distinct_id"]).not.toBe(analyticsId)
		expect(posthogStorageKeys()).toEqual([])
		expect(document.cookie).toBe("")
	})

	it("sends nothing more after a reject that follows consent", async () => {
		const { acceptAll, rejectAll, startAnalytics, trackPageview, track, captureError } =
			await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		await clientReady()
		await flush()
		expect(sentEvents()).toHaveLength(1)

		track("$pageview", { route: "/staking/positions" })
		rejectAll()
		trackPageview("/portfolio")
		captureError(new Error("boom"))
		await flush()

		expect(sentEvents()).toHaveLength(1)
		expect(posthogStorageKeys()).toEqual([])
		expect(document.cookie).toBe("")
	})

	it("starts a new anonymous id when analytics is granted again after a withdrawal", async () => {
		const { acceptAll, rejectAll, startAnalytics, trackPageview } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		await clientReady()
		await flush()
		const firstId = sentEvents()[0]?.properties["distinct_id"]

		rejectAll()
		await flush(0)
		acceptAll()
		trackPageview("/staking/positions")
		await flush()

		expect(sentEvents().map(({ properties }) => properties["route"])).toEqual([
			"/staking/providers",
			"/staking/providers",
			"/staking/positions",
		])
		const [, ...afterRegrant] = sentEvents().map(({ properties }) => properties["distinct_id"])
		expect(afterRegrant).not.toContain(firstId)
	})

	it("captures one pageview for the current route when consent arrives after navigation", async () => {
		const { acceptAll, startAnalytics, trackPageview } = await loadDomain()
		startAnalytics()
		trackPageview("/staking/positions")
		await flush()
		expect(requests).toEqual([])

		acceptAll()
		await clientReady()
		await flush()

		expect(sentEvents().map(({ properties }) => properties["route"])).toEqual([
			"/staking/positions",
		])
	})
})

describe("starting analytics", () => {
	it("starts analytics on the first event when nothing has started it yet", async () => {
		const { acceptAll, track } = await loadDomain()
		acceptAll()
		track("Substrate extensions connected", { wallet: "polkadot-js" })
		await clientReady()
		await flush()

		expect(sentEventNames()).toEqual(["Substrate extensions connected"])
		expect(sentEvents()[0]?.properties).toMatchObject({ wallet: "polkadot-js" })
	})
})

describe("portal events", () => {
	it("sends each portal event with its catalog props only", async () => {
		const { acceptAll, startAnalytics, track } = await loadDomain()
		acceptAll()
		startAnalytics()
		track("EVM extensions connected", { wallet: "xyz.talisman", connections: 1 })
		track("Substrate extensions connected", { wallet: "talisman" })
		track("Report portfolio balances", {
			symbols: ["DOT", "TAO"],
			chains: ["polkadot", "bittensor"],
			total_usd: "100-1k",
			usd_dot: "10-100",
			usd_tao: "100-1k",
		})
		track("Extrinsic in block", {
			chain: "polkadot-asset-hub",
			module: "utility",
			section: "batchAll",
		})
		track("Extrinsic in block", {
			chain: "polkadot-asset-hub",
			module: "nominationPools",
			section: "join",
			parent_module: "utility",
			parent_section: "batchAll",
		})
		track("Write to EVM contract", { chain: "Ethereum", functionName: "stake" })
		await clientReady()
		await flush()

		expect(
			sentEvents().map(({ event, properties }) => [
				event,
				Object.fromEntries(
					Object.entries(properties).filter(
						([key]) =>
							!Object.hasOwn(SDK_FIELDS, key) && key !== "environment" && key !== "app_version"
					)
				),
			])
		).toEqual([
			["EVM extensions connected", { wallet: "xyz.talisman", connections: 1 }],
			["Substrate extensions connected", { wallet: "talisman" }],
			[
				"Report portfolio balances",
				{
					symbols: ["DOT", "TAO"],
					chains: ["polkadot", "bittensor"],
					total_usd: "100-1k",
					usd_dot: "10-100",
					usd_tao: "100-1k",
				},
			],
			[
				"Extrinsic in block",
				{ chain: "polkadot-asset-hub", module: "utility", section: "batchAll" },
			],
			[
				"Extrinsic in block",
				{
					chain: "polkadot-asset-hub",
					module: "nominationPools",
					section: "join",
					parent_module: "utility",
					parent_section: "batchAll",
				},
			],
			["Write to EVM contract", { chain: "Ethereum", functionName: "stake" }],
		])
	})

	it("drops a property the catalog does not list, even when the type is bypassed", async () => {
		const { acceptAll, startAnalytics, track } = await loadDomain()
		acceptAll()
		startAnalytics()
		const untyped = track as (name: string, props: Record<string, unknown>) => void
		untyped("Write to EVM contract", {
			chain: "Ethereum",
			functionName: "stake",
			hash: `0x${"ab12".repeat(16)}`,
			contractAddress: "0x9858EfFD232B4033E47d90003D41EC34EcaEda94",
			args: { amount: "1000" },
		})
		untyped("Report portfolio balances", {
			$set: { portfolioBalances: [{ addressDigest: "ab".repeat(64), usdValue: 12 }] },
		})
		untyped("Report portfolio balances", {
			symbols: ["DOT", "SHADYCOIN"],
			chains: ["polkadot"],
			total_usd: "<10",
			usd_dot: 12,
			tokenId: "polkadot:substrate-native",
			tokenIds: ["1:evm-erc20:0x6B175474E89094C44Da98b954EedeAC495271d0F"],
		})
		await clientReady()
		await flush()

		expect(sentEventNames()).toEqual([
			"Write to EVM contract",
			"Report portfolio balances",
			"Report portfolio balances",
		])
		const body = JSON.stringify(requests)
		for (const leak of [
			"ab12ab12",
			"9858",
			"amount",
			"addressDigest",
			"portfolioBalances",
			"tokenId",
			"substrate-native",
			"6B175474",
			"SHADYCOIN",
			"symbols",
			"usd_dot",
		])
			expect(body).not.toContain(leak)
	})
})

describe("consent withdrawn while the SDK loads", () => {
	it("captures no error raised under errors consent once it is withdrawn", async () => {
		const { acceptAll, setConsent, startAnalytics, captureError } = await loadDomain()
		acceptAll()
		startAnalytics()
		captureError(new Error("raised while loading"))
		setConsent({ analytics: true, errors: false })
		await clientReady()
		await flush()

		expect(sdk.unscrubbed).toEqual([])
		expect(sentEvents()).toEqual([])
	})

	it("sends an error captured again after consent returns while the SDK still loads", async () => {
		const { acceptAll, rejectAll, startAnalytics, captureError } = await loadDomain()
		const error = new Error("raised while loading")
		acceptAll()
		startAnalytics()
		captureError(error)
		rejectAll()
		acceptAll()
		captureError(error, "error_boundary")
		await clientReady()
		await flush()

		expect(sentEvents().map(({ properties }) => properties["mechanism"])).toEqual([
			"error_boundary",
		])
	})

	it("sends an error dropped by a withdrawal when it is captured again after consent returns", async () => {
		const { acceptAll, setConsent, startAnalytics, captureError } = await loadDomain()
		const error = new Error("raised while loading")
		acceptAll()
		startAnalytics()
		captureError(error)
		setConsent({ analytics: true, errors: false })
		await clientReady()
		await flush()
		acceptAll()
		captureError(error)
		await flush()

		expect(sentEventNames()).toEqual(["$exception"])
	})

	it("captures no event tracked under analytics consent once it is withdrawn", async () => {
		const { acceptAll, rejectAll, startAnalytics, track } = await loadDomain()
		acceptAll()
		startAnalytics()
		track("$pageview", { route: "/staking/providers" })
		rejectAll()
		await flush()

		expect(sdk.unscrubbed).toEqual([])
		expect(sentEvents()).toEqual([])
	})

	it("captures nothing from before a withdrawal that is granted again during the load", async () => {
		const { acceptAll, rejectAll, startAnalytics, track } = await loadDomain()
		acceptAll()
		startAnalytics()
		track("Substrate extensions connected", { wallet: "talisman" })
		rejectAll()
		acceptAll()
		await clientReady()
		await flush()

		expect(sdk.unscrubbed).toEqual([])
		expect(sentEvents()).toEqual([])
	})
})

const ORIGIN = location.origin
const IPV4 = "192.168.1.42"
const IPV6 = "2001:db8:85a3::8a2e:370:7334"
const EMAIL = "bob.smith+portal@example.co.uk"
const EVM = "0x9858EfFD232B4033E47d90003D41EC34EcaEda94"
const BARE_EVM = "d8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
const TX_HASH = `0x${"ab12".repeat(16)}`

const THROWN_TEXT = [
	"Stake from Alice to Secret Pool failed",
	`signer ${SS58} evm ${EVM} bare ${BARE_EVM}`,
	`tx ${TX_HASH} for pool ${DAVE}`,
	`RPC ${IPV4}:30333 and [${IPV6}] for ${EMAIL}`,
	`GET https://${IPV4}/portfolio?lookup-address=${SS58} failed`,
	"Guardians Bob rejected the request",
	"kumquat",
]

const MESSAGE = THROWN_TEXT.join("\n")

const NOT_SENT = [
	"Alice",
	"Secret Pool",
	"Guardians Bob",
	"kumquat",
	"Stake from",
	"rejected the request",
	SS58,
	EVM,
	BARE_EVM,
	TX_HASH,
	DAVE,
	IPV4,
	IPV6,
	EMAIL,
	"my pool",
	"evil.example",
	"$exception_message",
	"AliceStash",
	"MySecretPool",
	"Guardian",
	"PoolError",
]

class PoolError extends Error {
	override name = "PoolError"
}

const withStack = (error: Error, stack: string) => Object.assign(error, { stack })

const STACK_WITH_TEXT = [
	`Error: ${MESSAGE}`,
	`    at Alice.stake (https://evil.example/assets/${SS58}.js:1:2)`,
	`    at my pool (${ORIGIN}/assets/index-Ab12Cd34.js:3:4)`,
	`    at ${EMAIL} (https://${IPV4}/assets/x.js:5:6)`,
	`    at send (${ORIGIN}/portfolio?lookup-address=${SS58}:7:8)`,
	`    at submit (${ORIGIN}/assets/index-Ab12Cd34.js:9:10)`,
	`    at MySecretPool (${ORIGIN}/assets/index-Ab12Cd34.js:11:12)`,
].join("\n")

const THROWN: [string, unknown][] = [
	["an Error", new Error(MESSAGE)],
	["an error named with free text", Object.assign(new Error(MESSAGE), { name: "Secret Pool" })],
	["an error named with an email", Object.assign(new Error(MESSAGE), { name: EMAIL })],
	["an error named with an address", Object.assign(new Error(MESSAGE), { name: `E${BARE_EVM}` })],
	["a custom error class", new PoolError(MESSAGE)],
	["a chained cause", new Error(MESSAGE, { cause: new TypeError(MESSAGE, { cause: MESSAGE }) })],
	["a plain object", { name: "Secret Pool", message: MESSAGE }],
	["a string", MESSAGE],
	["a stack whose frames hold text", withStack(new Error(MESSAGE), STACK_WITH_TEXT)],
	["an aggregate", new AggregateError([new Error(MESSAGE)], MESSAGE)],
	["an error named like a class", Object.assign(new Error(MESSAGE), { name: "MySecretPool" })],
	[
		"a forged own-origin stack line in the message",
		new Error(`x\n    at MySecretPool (${ORIGIN}/assets/AliceStash.js:1:1)`),
	],
	[
		"a forged stack line with a hash-shaped script name",
		new Error(`x\n    at MySecretPool (${ORIGIN}/assets/AliceStash-Ab12Cd34.js:1:1)`),
	],
	[
		"a forged stack line with a dotted hash-shaped script name",
		new Error(`x\n    at send (${ORIGIN}/assets/kumquat.Guardians-abcdefgh.js:1:1)`),
	],
	[
		"a forged stack line with a name of eight letters as the hash",
		new Error(`x\n    at send (${ORIGIN}/assets/Alice-Guardian.js:1:1)`),
	],
	[
		"a forged stack line naming a loaded script",
		new Error(`x\n    at MySecretPool (${ORIGIN}/assets/index-Ab12Cd34.js:1:1)`),
	],
	[
		"a forged stack naming an address as the script",
		withStack(new Error("x"), `Error: x\n    at send (${ORIGIN}/assets/${SS58}.js:1:1)`),
	],
]

type SentException = {
	type: string
	value: string
	mechanism: { type: string; handled: boolean }
	stacktrace?: { frames: Record<string, unknown>[] }
}

const sentExceptions = () =>
	sentEvents().flatMap(({ properties }) => properties["$exception_list"] as SentException[])

const startWithErrorsConsent = async () => {
	const domain = await loadDomain()
	domain.setConsent({ analytics: false, errors: true })
	domain.startAnalytics()
	return domain
}

describe("error reporting", () => {
	it.each(THROWN)(
		"sends no text of %s, only its category, class and code positions",
		async (_, thrown) => {
			const { captureError } = await startWithErrorsConsent()
			captureError(thrown)
			await clientReady()
			await flush()

			expect(sentEventNames()).toEqual(["$exception"])
			const body = JSON.stringify(requests)
			for (const text of NOT_SENT) expect(body).not.toContain(text)
			const [root, ...causes] = sentExceptions()
			expect(root?.value).toBe("unknown")
			for (const cause of causes) expect(cause.value).toBe("")
		}
	)

	it("sends the category, class and mechanism as top-level properties", async () => {
		const { captureError } = await startWithErrorsConsent()
		captureError(new TypeError("Failed to fetch"))
		await clientReady()
		await flush()

		const [event] = sentEvents()
		expect(event?.properties).toMatchObject({
			exception_type: "TypeError",
			error_category: "network",
			mechanism: "caught",
			handled: true,
			environment: "development",
			app_version: APP_COMMIT,
		})
		expect(sentExceptions().map(({ type, value }) => [type, value])).toEqual([
			["TypeError", "network"],
		])
	})

	it("keeps only the frames of scripts the page loaded, without function names", async () => {
		const { captureError } = await startWithErrorsConsent()
		captureError(withStack(new Error(MESSAGE), STACK_WITH_TEXT))
		await clientReady()
		await flush()

		const frames = sentExceptions().flatMap(({ stacktrace }) => stacktrace?.frames ?? [])
		const frame = (lineno: number, colno: number) => ({
			platform: "web:javascript",
			filename: LOADED_SCRIPT,
			function: "?",
			lineno,
			colno,
			in_app: true,
		})
		expect(frames).toHaveLength(3)
		expect(frames).toEqual(expect.arrayContaining([frame(3, 4), frame(9, 10), frame(11, 12)]))
	})

	it.each([
		["reported before start, from the resource buffer", "buffer"],
		["loaded after start, as the observer reports it", "load"],
	] as const)("keeps the frame of a chunk %s", async (_, when) => {
		const chunk = `${ORIGIN}/assets/late-Zz99Yy88.js`
		if (when === "buffer") resources.buffer(served(chunk))
		const { captureError } = await startWithErrorsConsent()
		if (when === "load") resources.load(served(chunk))
		captureError(withStack(new Error("x"), `Error: x\n    at send (${chunk}:5:6)`))
		await clientReady()
		await flush()

		expect(sentExceptions()[0]?.stacktrace?.frames).toEqual([
			{
				platform: "web:javascript",
				filename: chunk,
				function: "?",
				lineno: 5,
				colno: 6,
				in_app: true,
			},
		])
	})

	it.each([
		["the server refused", { name: FORGED_ASSET, responseStatus: 404 }],
		["whose status the browser did not expose", { name: FORGED_ASSET, responseStatus: 0 }],
		["with no status", { name: FORGED_ASSET }],
	])(
		"keeps no frame of a script %s, even one the page fetched",
		async (_, entry: ResourceEntry) => {
			resources.buffer(entry)
			const { captureError } = await startWithErrorsConsent()
			resources.load(entry)
			captureError(withStack(new Error("x"), `Error: x\n    at MySecretPool (${FORGED_ASSET}:1:1)`))
			await clientReady()
			await flush()

			expect(sentExceptions()[0]?.stacktrace?.frames ?? []).toEqual([])
			const body = JSON.stringify(requests)
			for (const text of ["AliceStash", "Ab12Cd34", "MySecretPool"])
				expect(body).not.toContain(text)
		}
	)

	it.each([
		["uncaught", "error", "uncaught", false],
		["unhandled_rejection", "unhandledrejection", "unhandled_rejection", false],
	] as const)("reports a %s error with its mechanism", async (_, type, mechanism, handled) => {
		await startWithErrorsConsent()
		await clientReady()
		const error = new Error(MESSAGE)
		window.dispatchEvent(
			type === "error"
				? new ErrorEvent("error", { error, message: MESSAGE, filename: LOADED_SCRIPT })
				: Object.assign(new Event("unhandledrejection"), { reason: error })
		)
		await flush()

		expect(sentEvents()[0]?.properties).toMatchObject({ mechanism, handled })
		expect(sentExceptions()[0]?.mechanism).toMatchObject({ type: mechanism, handled })
		expect(JSON.stringify(requests)).not.toContain("kumquat")
	})

	it("reports nothing uncaught before consent", async () => {
		const { startAnalytics } = await loadDomain()
		startAnalytics()
		window.dispatchEvent(
			new ErrorEvent("error", { error: new Error("boom"), filename: LOADED_SCRIPT })
		)
		window.dispatchEvent(
			Object.assign(new Event("unhandledrejection"), { reason: new Error("boom") })
		)
		await flush()

		expectNothingSentOrStored()
		expect(sdk.imports).toBe(0)
	})

	it.each([
		["an extension's page script", "chrome-extension://abcdefghijklmnop/inpage.js"],
		["another origin", "https://example.com/assets/index-Ab12Cd34.js"],
		["a script whose error the browser muted", ""],
	])("reports nothing uncaught from %s", async (_, filename) => {
		await startWithErrorsConsent()
		await clientReady()
		window.dispatchEvent(new ErrorEvent("error", { error: new Error("boom"), filename }))
		await flush()

		expect(sentEventNames()).toEqual([])
	})

	it.each([
		[
			"a harmless error",
			async () => {
				const { HarmlessError } = await import("@/domains/common/errors")
				return new HarmlessError("Please ignore this message")
			},
		],
		[
			"an RPC socket closed normally",
			async () => new Error("disconnected from wss://rpc.polkadot.io: 1000:: Normal Closure"),
		],
		[
			"an RPC unsubscription",
			async () => new Error("unsubscribed from wss://rpc.polkadot.io: 1006:: Abnormal Closure"),
		],
		[
			"an extension that is gone",
			async () => new Error("Could not establish connection. Receiving end does not exist."),
		],
	])("reports nothing for %s, wherever it is raised", async (_, raise) => {
		const { captureError } = await startWithErrorsConsent()
		await clientReady()
		const error = await raise()
		captureError(error)
		captureError(error, "error_boundary")
		window.dispatchEvent(new ErrorEvent("error", { error, filename: LOADED_SCRIPT }))
		window.dispatchEvent(Object.assign(new Event("unhandledrejection"), { reason: error }))
		await flush()

		expect(sdk.unscrubbed).toEqual([])
		expect(requests).toEqual([])
	})

	it("reports an error once when its caller reports it and rethrows it", async () => {
		const { captureError } = await startWithErrorsConsent()
		await clientReady()
		const error = new TypeError("Failed to fetch")
		captureError(error)
		captureError(error, "error_boundary")
		window.dispatchEvent(Object.assign(new Event("unhandledrejection"), { reason: error }))
		await flush()

		expect(sentEvents().map(({ properties }) => properties["mechanism"])).toEqual(["caught"])
	})

	it("keeps an error reported once its report is sent, when it is rethrown later", async () => {
		const { captureError } = await startWithErrorsConsent()
		await clientReady()
		const error = new TypeError("Failed to fetch")
		captureError(error)
		await flush()
		captureError(error, "error_boundary")
		await flush()

		expect(sentEvents().map(({ properties }) => properties["mechanism"])).toEqual(["caught"])
	})

	it("sends the same error at most three times per window, and at most thirty errors", async () => {
		const { captureError } = await startWithErrorsConsent()
		for (let i = 0; i < 5; i++) captureError(new Error("same"))
		for (let i = 0; i < 40; i++) captureError(new Error(`distinct ${i}`))
		await clientReady()
		await flush()

		expect(sentEventNames()).toHaveLength(30)
		await vi.advanceTimersByTimeAsync(10 * 60_000)
		captureError(new Error("same"))
		await flush()
		expect(sentEventNames()).toHaveLength(31)
	})
})

const sdkOwnKeys = (event: string, properties: Record<string, unknown>) =>
	Object.keys(properties).filter(
		(key) => !Object.hasOwn(SDK_FIELDS, key) && !(event === "$pageview" && key === "route")
	)

describe("the SDK field table", () => {
	it("lists every field the SDK fills in, so a new one is a decision rather than a silent drop", async () => {
		const { acceptAll, startAnalytics, trackPageview, captureError } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		trackPageview("/staking/positions")
		captureError(new Error("outer", { cause: new TypeError("inner") }))
		await clientReady()
		await flush()

		expect(
			sdk.unscrubbed.map(({ event, properties }) => [event, sdkOwnKeys(event, properties)])
		).toEqual([
			["$pageview", []],
			["$pageview", []],
			["$exception", ["$exception_list", "$exception_level", "error_category", "mechanism"]],
		])
	})
})

describe("the before_send consent gate", () => {
	it("keeps a pageview under analytics consent and drops it after a reject", async () => {
		const { acceptAll, rejectAll, startAnalytics } = await loadDomain()
		acceptAll()
		startAnalytics()
		await clientReady()
		const beforeSend = sdk.instance?.config.before_send
		if (typeof beforeSend !== "function") throw new Error("before_send is not set")
		const event = (name: string) =>
			({ uuid: "uuid", event: name, properties: {} }) as Parameters<typeof beforeSend>[0]

		expect(beforeSend(event("$pageview"))?.event).toBe("$pageview")
		expect(beforeSend(event("custom"))).toBeNull()
		rejectAll()
		expect(beforeSend(event("$pageview"))).toBeNull()
	})

	it("drops a pageview and keeps an exception under errors-only consent", async () => {
		const { setConsent, startAnalytics } = await loadDomain()
		setConsent({ analytics: false, errors: true })
		startAnalytics()
		await clientReady()
		const beforeSend = sdk.instance?.config.before_send
		if (typeof beforeSend !== "function") throw new Error("before_send is not set")
		const event = (name: string) =>
			({
				uuid: "uuid",
				event: name,
				properties: { $exception_list: [{ type: "Error", value: "boom" }] },
			}) as Parameters<typeof beforeSend>[0]

		expect(beforeSend(event("$pageview"))).toBeNull()
		expect(beforeSend(event("$exception"))?.event).toBe("$exception")
	})
})

const unloadPage = () => window.dispatchEvent(new Event("pagehide"))

describe("an SDK without its retry queue", () => {
	it("never runs, so nothing is captured or sent", async () => {
		sdk.withoutRetryQueue = true
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)
		const { acceptAll, startAnalytics, trackPageview, captureError } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		captureError(new Error("boom"))
		await clientReady()
		await flush(60_000)
		unloadPage()
		await flush(0)

		expect(sdk.captured).toEqual([])
		expect(requests).toEqual([])
		expect(consoleError).toHaveBeenCalled()
		consoleError.mockRestore()
	})
})

type Domain = Awaited<ReturnType<typeof loadDomain>>

const WITHDRAWALS: [string, (domain: Domain) => void][] = [
	["a reject", ({ rejectAll }) => rejectAll()],
	["errors-only consent", ({ setConsent }) => setConsent({ analytics: false, errors: true })],
]

const captureQueuedEvents = async (domain: Domain) => {
	domain.acceptAll()
	domain.startAnalytics()
	await clientReady()
	const captured: string[] = []
	sdk.instance?.on("eventCaptured", ({ event }: { event: string }) => captured.push(event))
	domain.trackPageview("/staking/providers")
	domain.track("Report portfolio balances", {
		symbols: ["DOT"],
		chains: ["polkadot"],
		total_usd: "<10",
	})
	await flush(0)
	expect(captured).toEqual(["$pageview", "Report portfolio balances"])
}

describe("withdrawing analytics consent with events still queued", () => {
	it.each(WITHDRAWALS)(
		"drops the queued events at the next flush after %s",
		async (_, withdraw) => {
			const domain = await loadDomain()
			await captureQueuedEvents(domain)
			expect(requests).toEqual([])

			withdraw(domain)
			await flush(60_000)

			expect(sentEvents()).toEqual([])
		}
	)

	it.each(WITHDRAWALS)("drops the queued events on page unload after %s", async (_, withdraw) => {
		const domain = await loadDomain()
		await captureQueuedEvents(domain)

		withdraw(domain)
		unloadPage()
		await flush(0)

		expect(sentEvents()).toEqual([])
	})

	it("forwards a queued exception that errors-only consent still allows", async () => {
		const domain = await loadDomain()
		await captureQueuedEvents(domain)
		domain.captureError(new Error("boom"))
		await flush(0)

		domain.setConsent({ analytics: false, errors: true })
		await flush()

		expect(sentEventNames()).toEqual(["$exception"])
	})

	it.each(WITHDRAWALS)("drops failed events retried after %s", async (_, withdraw) => {
		const domain = await loadDomain()
		await captureQueuedEvents(domain)
		network.failNext = true
		await flush()
		expect(sentEventNames()).toEqual(["$pageview", "Report portfolio balances"])
		const sentBeforeWithdrawal = requests.length

		withdraw(domain)
		await flush(60_000)

		expect(requests.slice(sentBeforeWithdrawal)).toEqual([])
	})

	it.each(WITHDRAWALS)("drops failed events beaconed on unload after %s", async (_, withdraw) => {
		const domain = await loadDomain()
		await captureQueuedEvents(domain)
		network.failNext = true
		await flush()
		const sentBeforeWithdrawal = requests.length

		withdraw(domain)
		unloadPage()
		await flush(0)

		expect(requests.slice(sentBeforeWithdrawal)).toEqual([])
	})
})

const CONSENT_KEY = "analytics-consent"
const SDK_KEY = `ph_${TOKEN}_posthog`
const LEGACY_OPT_IN_KEY = `__ph_opt_in_out_${TOKEN}`

const writeConsentInOtherTab = (consent: { analytics: boolean; errors: boolean }) => {
	const newValue = JSON.stringify(consent)
	localStorage.setItem(CONSENT_KEY, newValue)
	window.dispatchEvent(
		new StorageEvent("storage", { key: CONSENT_KEY, newValue, storageArea: localStorage })
	)
}

describe("consent changed in another tab", () => {
	it("a late storage event from another tab cannot override this tab's newer reject", async () => {
		const { acceptAll, rejectAll, startAnalytics, trackPageview, currentConsent } =
			await loadDomain()
		acceptAll()
		startAnalytics()
		await clientReady()

		rejectAll()
		window.dispatchEvent(
			new StorageEvent("storage", {
				key: CONSENT_KEY,
				newValue: JSON.stringify({ analytics: true, errors: true }),
				storageArea: localStorage,
			})
		)
		trackPageview("/staking/positions")
		await flush()

		expect(currentConsent()).toEqual({ analytics: false, errors: false })
		expect(sentEventNames()).toEqual([])
		expect(posthogStorageKeys()).toEqual([])
	})

	it.each([
		["a reject", { analytics: false, errors: false }],
		["errors-only consent", { analytics: false, errors: true }],
	])("stops this tab's pageviews and storage after %s", async (_, withdrawn) => {
		const { acceptAll, startAnalytics, trackPageview } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		await clientReady()
		await flush()
		expect(posthogStorageKeys()).not.toEqual([])

		writeConsentInOtherTab(withdrawn)
		await flush(0)
		sdkWrites.length = 0
		trackPageview("/staking/positions")
		await flush()

		expect(sentEvents().map(({ properties }) => properties["route"])).toEqual([
			"/staking/providers",
		])
		expectNothingStored()
	})
})

describe("SDK storage left by an earlier SDK, another tab or a crash", () => {
	it.each([
		["undecided", undefined],
		["rejected", { analytics: false, errors: false }],
		["errors-only", { analytics: false, errors: true }],
	])("is removed when a page loads %s", async (_, consent) => {
		localStorage.setItem(SDK_KEY, JSON.stringify({ distinct_id: "stale" }))
		localStorage.setItem(LEGACY_OPT_IN_KEY, "1")
		sessionStorage.setItem(`ph_${TOKEN}_window_id`, "stale")
		if (consent) localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
		const { startAnalytics } = await loadDomain()
		startAnalytics()
		await flush()

		expect(posthogStorageKeys()).toEqual([])
		expect(sdk.imports).toBe(0)
	})

	it("expires the cookie the earlier SDK set for this host and its parent domain", async () => {
		const deleted: unknown[] = []
		Object.defineProperty(window, "cookieStore", {
			configurable: true,
			value: {
				delete: async (options: unknown) => {
					deleted.push(options)
				},
			},
		})
		onTestFinished(() => {
			Reflect.deleteProperty(window, "cookieStore")
		})
		const { startAnalytics } = await loadDomain()
		startAnalytics()
		await flush()

		const domain = location.hostname.split(".").slice(-2).join(".")
		expect(deleted).toEqual([
			{ name: `ph_${TOKEN}_posthog` },
			{ name: `ph_${TOKEN}_posthog`, domain },
		])
	})

	it("leaves other keys of the portal alone", async () => {
		localStorage.setItem("selected-currency", '"usd"')
		localStorage.setItem("readonly_accounts", "[]")
		const { startAnalytics } = await loadDomain()
		startAnalytics()
		await flush()

		expect(localStorage.getItem("selected-currency")).toBe('"usd"')
		expect(localStorage.getItem("readonly_accounts")).toBe("[]")
	})
})
