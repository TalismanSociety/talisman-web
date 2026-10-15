import type { PostHog, PostHogConfig } from "posthog-js/no-external"
import { afterEach, beforeEach, describe, expect, it, onTestFinished, vi } from "vitest"
import { consentKindOf } from "./events"
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
			stringsOf(props ?? {}, "").filter(
				([path, value]) => !isCatalogValue(event, path, value) && SDK_SHAPES[path]?.(value) !== true
			)
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
		const { startAnalytics, trackPageview, track } = await loadDomain()
		startAnalytics()
		trackPageview("/staking/providers")
		track("$pageview", { route: "/staking/providers" })
		await flush()

		expect(sdk.imports).toBe(0)
		expectNothingSentOrStored()
	})

	it("loads, sends and stores nothing after a reject", async () => {
		const { rejectAll, startAnalytics, trackPageview, track } = await loadDomain()
		rejectAll()
		startAnalytics()
		trackPageview("/staking/providers")
		track("$pageview", { route: "/staking/providers" })
		await flush()

		expect(sdk.imports).toBe(0)
		expectNothingSentOrStored()
	})

	it("loads, sends and stores nothing with errors-only consent", async () => {
		const { setConsent, startAnalytics, trackPageview, track } = await loadDomain()
		setConsent({ analytics: false, errors: true })
		startAnalytics()
		trackPageview("/staking/providers")
		track("Substrate extensions connected", { wallet: "talisman" })
		await flush()

		expect(sdk.imports).toBe(0)
		expectNothingSentOrStored()
	})

	it("sends nothing in development without the local flag, whatever the consent", async () => {
		vi.stubEnv("VITE_ANALYTICS_LOCAL", "")
		const { acceptAll, startAnalytics, trackPageview } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		await flush()

		expect(sdk.imports).toBe(0)
		expectNothingSentOrStored()
	})

	it("sends nothing from a build without a project token, whatever the consent", async () => {
		vi.stubEnv("VITE_POSTHOG_AUTH_TOKEN", "")
		const { acceptAll, startAnalytics, trackPageview } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		await flush()

		expect(sdk.imports).toBe(0)
		expectNothingSentOrStored()
	})

	it("drops every event outside the catalog, whatever the consent", async () => {
		const { acceptAll, startAnalytics, track } = await loadDomain()
		acceptAll()
		startAnalytics()
		track("Substrate extensions connected", { wallet: "talisman" })
		await clientReady()
		for (const event of [
			"$exception",
			"$opt_in",
			"$identify",
			"$web_vitals",
			"$pageleave",
			"$set",
			"custom",
		])
			sdk.instance?.capture(event)
		await flush()

		expect(sentEventNames()).toEqual(["Substrate extensions connected"])
	})

	it("sends scrubbed pageviews with analytics consent and persists the anonymous id", async () => {
		const { setConsent, startAnalytics, trackPageview } = await loadDomain()
		setConsent({ analytics: true, errors: false })
		startAnalytics()
		navigateTo(`/portfolio/${SS58}?account=${DAVE}#history`)
		trackPageview(location.pathname)
		await clientReady()
		await flush()

		expect(sentEventNames()).toEqual(["$pageview"])
		const [pageview] = sentEvents()
		expect(pageview?.properties).toMatchObject({
			route: "/portfolio/:rest",
			$current_url: `${location.origin}/portfolio/:rest`,
			$pathname: "/portfolio/:rest",
			environment: "development",
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
		const { acceptAll, setConsent, startAnalytics, trackPageview, track } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		await clientReady()
		await flush()
		expect(sentEventNames()).toEqual(["$pageview"])
		expect(posthogStorageKeys()).not.toEqual([])

		setConsent({ analytics: false, errors: true })
		await flush(0)
		expect(posthogStorageKeys()).toEqual([])

		trackPageview("/staking/positions")
		track("Substrate extensions connected", { wallet: "talisman" })
		await flush()

		expect(sentEventNames()).toEqual(["$pageview"])
		expect(posthogStorageKeys()).toEqual([])
		expect(document.cookie).toBe("")
	})

	it("sends nothing more after a reject that follows consent", async () => {
		const { acceptAll, rejectAll, startAnalytics, trackPageview, track } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		await clientReady()
		await flush()
		expect(sentEvents()).toHaveLength(1)

		track("$pageview", { route: "/staking/positions" })
		rejectAll()
		trackPageview("/portfolio")
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
		track("Report portfolio balances", { tokens: 12, chains: 3 })
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
						([key]) => !Object.hasOwn(SDK_FIELDS, key) && key !== "environment"
					)
				),
			])
		).toEqual([
			["EVM extensions connected", { wallet: "xyz.talisman", connections: 1 }],
			["Substrate extensions connected", { wallet: "talisman" }],
			["Report portfolio balances", { tokens: 12, chains: 3 }],
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
		await clientReady()
		await flush()

		expect(sentEventNames()).toEqual(["Write to EVM contract", "Report portfolio balances"])
		const body = JSON.stringify(requests)
		for (const leak of ["ab12ab12", "9858", "amount", "addressDigest", "portfolioBalances"])
			expect(body).not.toContain(leak)
	})
})

describe("consent withdrawn while the SDK loads", () => {
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

const sdkOwnKeys = (event: string, properties: Record<string, unknown>) =>
	Object.keys(properties).filter(
		(key) => !Object.hasOwn(SDK_FIELDS, key) && !(event === "$pageview" && key === "route")
	)

describe("the SDK field table", () => {
	it("lists every field the SDK fills in, so a new one is a decision rather than a silent drop", async () => {
		const { acceptAll, startAnalytics, trackPageview } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
		trackPageview("/staking/positions")
		await clientReady()
		await flush()

		expect(
			sdk.unscrubbed.map(({ event, properties }) => [event, sdkOwnKeys(event, properties)])
		).toEqual([
			["$pageview", []],
			["$pageview", []],
		])
	})
})

describe("the before_send consent gate", () => {
	it("drops a catalog event without analytics consent and an event outside the catalog with it", async () => {
		const { acceptAll, rejectAll, startAnalytics } = await loadDomain()
		acceptAll()
		startAnalytics()
		await clientReady()
		const beforeSend = sdk.instance?.config.before_send
		if (typeof beforeSend !== "function") throw new Error("before_send is not set")
		const event = (name: string) =>
			({ uuid: "uuid", event: name, properties: {} }) as Parameters<typeof beforeSend>[0]

		expect(beforeSend(event("$pageview"))?.event).toBe("$pageview")
		expect(beforeSend(event("$exception"))).toBeNull()
		rejectAll()
		expect(beforeSend(event("$pageview"))).toBeNull()
	})
})

const unloadPage = () => window.dispatchEvent(new Event("pagehide"))

describe("an SDK without its retry queue", () => {
	it("never runs, so nothing is captured or sent", async () => {
		sdk.withoutRetryQueue = true
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)
		const { acceptAll, startAnalytics, trackPageview } = await loadDomain()
		acceptAll()
		startAnalytics()
		trackPageview("/staking/providers")
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
	domain.track("Report portfolio balances", { tokens: 2, chains: 1 })
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
