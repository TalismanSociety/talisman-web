import { isCatalogValue } from "./events"
import { routePatternOfPathname } from "./routePatterns"

type Properties = Record<string, unknown>

type ScrubbableEvent = {
	event: string
	properties: Properties
	$set?: Properties
	$set_once?: Properties
}

const REDACTIONS: readonly [RegExp, string][] = [
	[/0x[0-9a-f]{41,}/gi, "<hash>"],
	[/0x[0-9a-f]{40}/gi, "<address>"],
	[/[0-9a-f]{64,}/gi, "<hash>"],
	[/(^|[^0-9a-z])[0-9a-f]{40}(?![0-9a-z])/gi, "$1<address>"],
	[/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "<id>"],
	[/[1-9A-HJ-NP-Za-km-z]{40,}/g, "<address>"],
]

const redactTokens = (text: string) =>
	REDACTIONS.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text)

type Policy = "keep" | "metadata" | "url" | "host" | "pathname" | "appTitle"

export const SDK_FIELDS: Readonly<Record<string, Policy>> = {
	token: "keep",
	distinct_id: "keep",
	$device_id: "keep",
	$anon_distinct_id: "keep",
	$session_id: "keep",
	$window_id: "keep",
	$pageview_id: "keep",
	$prev_pageview_id: "keep",
	$insert_id: "keep",
	$current_url: "url",
	$session_entry_url: "url",
	$initial_current_url: "url",
	$referrer: "url",
	$session_entry_referrer: "url",
	$initial_referrer: "url",
	$host: "host",
	$session_entry_host: "host",
	$initial_host: "host",
	$referring_domain: "host",
	$session_entry_referring_domain: "host",
	$initial_referring_domain: "host",
	$pathname: "pathname",
	$session_entry_pathname: "pathname",
	$initial_pathname: "pathname",
	$prev_pageview_pathname: "pathname",
	$os: "metadata",
	$os_name: "metadata",
	$os_version: "metadata",
	$browser: "metadata",
	$browser_type: "metadata",
	$browser_version: "metadata",
	$browser_language: "metadata",
	$browser_language_prefix: "metadata",
	$device: "metadata",
	$device_type: "metadata",
	$device_model: "metadata",
	$raw_user_agent: "metadata",
	$timezone: "metadata",
	$search_engine: "metadata",
	$lib: "metadata",
	$lib_version: "metadata",
	$lib_custom_api_host: "url",
	$sdk_dist_channel: "metadata",
	$sdk_debug_extensions_init_method: "metadata",
	$initialization_time: "metadata",
	$config_defaults: "metadata",
	$recording_status: "metadata",
	title: "appTitle",
	$time: "keep",
	$timezone_offset: "keep",
	$screen_height: "keep",
	$screen_width: "keep",
	$viewport_height: "keep",
	$viewport_width: "keep",
	$configured_session_timeout_ms: "keep",
	$sdk_debug_extensions_init_time_ms: "keep",
	$sdk_debug_retry_queue_size: "keep",
	$lib_rate_limit_remaining_tokens: "keep",
	$is_identified: "keep",
	$process_person_profile: "keep",
	$prev_pageview_duration: "keep",
	$prev_pageview_last_content: "keep",
	$prev_pageview_last_content_percentage: "keep",
	$prev_pageview_last_scroll: "keep",
	$prev_pageview_last_scroll_percentage: "keep",
	$prev_pageview_max_content: "keep",
	$prev_pageview_max_content_percentage: "keep",
	$prev_pageview_max_scroll: "keep",
	$prev_pageview_max_scroll_percentage: "keep",
}

const IP = "<ip>"

const isIpHostname = (hostname: string) =>
	hostname.startsWith("[") || /^\d+(?:\.\d+){3}$/.test(hostname)

const ADDRESS_LABEL_LENGTH = 32

const scrubHostname = (hostname: string) =>
	isIpHostname(hostname)
		? IP
		: redactTokens(hostname)
				.split(".")
				.map((label) => (label.length >= ADDRESS_LABEL_LENGTH ? "<address>" : label))
				.join(".")

const scrubHost = (host: string) =>
	URL.canParse(`http://${host}`)
		? scrubHostname(new URL(`http://${host}`).hostname)
		: redactTokens(host)

const DIRECT = "$direct"

const normalizeUrl = (raw: string, appOrigin: string) => {
	if (raw === DIRECT) return raw
	if (!URL.canParse(raw)) return undefined
	const url = new URL(raw)
	if (url.origin === appOrigin) return url.origin + routePatternOfPathname(url.pathname)
	return `${url.protocol}//${scrubHostname(url.hostname)}`
}

const APP_TITLE = "Talisman Portal"

const STRING_POLICIES: Record<Policy, (value: string, appOrigin: string) => string | undefined> = {
	keep: (value) => value,
	appTitle: (value) => (value === APP_TITLE ? value : undefined),
	host: scrubHost,
	url: normalizeUrl,
	pathname: (value) => (value.startsWith("/") ? routePatternOfPathname(value) : undefined),
	metadata: redactTokens,
}

const scrubValue = (value: unknown, policy: Policy, appOrigin: string): unknown => {
	if (typeof value === "string") return STRING_POLICIES[policy](value, appOrigin)
	return typeof value === "object" && value !== null ? undefined : value
}

const scrubFields = (eventName: string, properties: Properties, appOrigin: string) =>
	Object.fromEntries(
		Object.entries(properties).flatMap(([key, value]) => {
			if (isCatalogValue(eventName, key, value)) return [[key, value]]
			const policy = Object.hasOwn(SDK_FIELDS, key) ? SDK_FIELDS[key] : undefined
			const scrubbed = policy && scrubValue(value, policy, appOrigin)
			return scrubbed === undefined ? [] : [[key, scrubbed]]
		})
	)

export const scrubEvent = <E extends ScrubbableEvent>(event: E, appOrigin: string): E => ({
	...event,
	properties: scrubFields(event.event, event.properties, appOrigin),
	...(event.$set && { $set: scrubFields("$set", event.$set, appOrigin) }),
	...(event.$set_once && { $set_once: scrubFields("$set_once", event.$set_once, appOrigin) }),
})
