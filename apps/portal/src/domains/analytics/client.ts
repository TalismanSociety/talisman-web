import type { CaptureResult, PostHog, PostHogConfig } from "posthog-js/no-external"
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map } from "rxjs"
import { type Consent, consent$, currentConsent, decisionHolds, isGranted } from "./consent"
import { type AnalyticsEnvironment, environmentOf, isAnalyticsEnabled } from "./environment"
import { consentKindOf, type EventName, type TrackArgs } from "./events"
import { POSTHOG_API_HOST, POSTHOG_UI_HOST } from "./posthogProject"
import { type RoutePattern, routePatternOfPathname } from "./routePatterns"
import { scrubEvent } from "./scrub"

const POSTHOG_PROJECT_TOKEN = import.meta.env.VITE_POSTHOG_AUTH_TOKEN ?? ""

export const CLIENT_CONFIG = {
	api_host: POSTHOG_API_HOST,
	ui_host: POSTHOG_UI_HOST,
	disable_external_dependency_loading: true,
	advanced_disable_flags: true,
	autocapture: false,
	capture_pageview: false,
	capture_pageleave: false,
	disable_session_recording: true,
	disable_surveys: true,
	disable_product_tours: true,
	disable_conversations: true,
	disable_web_experiments: true,
	capture_heatmaps: false,
	capture_dead_clicks: false,
	capture_performance: false,
	capture_exceptions: false,
	rageclick: false,
	enable_recording_console_log: false,
	advanced_disable_toolbar_metrics: true,
	person_profiles: "never",
	persistence: "localStorage",
	mask_personal_data_properties: true,
	save_campaign_params: false,
	internal_or_test_user_hostname: null,
} as const satisfies Partial<PostHogConfig>

const route$ = new BehaviorSubject<RoutePattern | undefined>(undefined)

let environment: AnalyticsEnvironment | undefined
let client: Promise<PostHog | undefined> | undefined

const enabledEnvironment = () => {
	if (POSTHOG_PROJECT_TOKEN === "") return undefined
	const hostEnvironment = environmentOf(location.hostname)
	return isAnalyticsEnabled(hostEnvironment, import.meta.env.VITE_ANALYTICS_LOCAL)
		? hostEnvironment
		: undefined
}

const isConsented = (eventName: unknown) => {
	const kind = typeof eventName === "string" ? consentKindOf(eventName) : undefined
	return kind !== undefined && isGranted(currentConsent(), kind)
}

const beforeSend =
	(environment: AnalyticsEnvironment) =>
	(event: CaptureResult | null): CaptureResult | null => {
		if (!event || !isConsented(event.event)) return null
		const scrubbed = scrubEvent(event, location.origin)
		return { ...scrubbed, properties: { ...scrubbed.properties, environment } }
	}

type SdkRequest = Parameters<PostHog["_send_request"]>[0]

const consentedRequest = <R extends SdkRequest>(request: R): R | undefined => {
	const { data } = request
	if (!Array.isArray(data)) return isConsented(data?.["event"]) ? request : undefined
	const events = data.filter((event) => isConsented(event.event))
	return events.length > 0 ? { ...request, data: events } : undefined
}

const consentGated =
	<R extends SdkRequest, Rest extends unknown[]>(send: (request: R, ...rest: Rest) => void) =>
	(request: R, ...rest: Rest) => {
		const consented = consentedRequest(request)
		if (consented) send(consented, ...rest)
	}

const gateDispatch = (posthog: PostHog) => {
	posthog._send_request = consentGated(posthog._send_request.bind(posthog))
	const retryQueue = posthog._retryQueue
	if (!retryQueue) throw new Error("PostHog has no retry queue to gate")
	retryQueue.retriableRequest = consentGated(retryQueue.retriableRequest.bind(retryQueue))
}

const createClient = async (environment: AnalyticsEnvironment) => {
	const { PostHog } = await import("posthog-js/no-external")
	const posthog = new PostHog()
	posthog.init(POSTHOG_PROJECT_TOKEN, {
		...CLIENT_CONFIG,
		disable_persistence: !isGranted(currentConsent(), "analytics"),
		before_send: beforeSend(environment),
	})
	gateDispatch(posthog)
	return posthog
}

const loadClient = (environment: AnalyticsEnvironment) => {
	client ??= createClient(environment).catch((error: unknown) => {
		console.error("Analytics is off", error)
		return undefined
	})
	return client
}

const SDK_KEY_PREFIXES = [
	`ph_${POSTHOG_PROJECT_TOKEN}_`,
	`__ph_opt_in_out_${POSTHOG_PROJECT_TOKEN}`,
]

const isSdkKey = (key: string) => SDK_KEY_PREFIXES.some((prefix) => key.startsWith(prefix))

const LEGACY_COOKIE = `ph_${POSTHOG_PROJECT_TOKEN}_posthog`

const removeLegacyCookie = () => {
	const parentDomain = location.hostname.split(".").slice(-2).join(".")
	for (const options of [{ name: LEGACY_COOKIE }, { name: LEGACY_COOKIE, domain: parentDomain }])
		window.cookieStore?.delete(options).catch(() => undefined)
}

const removeSdkStorage = () => {
	for (const storage of [localStorage, sessionStorage])
		for (const key of Object.keys(storage)) if (isSdkKey(key)) storage.removeItem(key)
	removeLegacyCookie()
}

const syncPersistence = (posthog: PostHog | undefined) => {
	if (!posthog) return
	const disabled = !isGranted(currentConsent(), "analytics")
	if (posthog.config.disable_persistence === disabled) return
	posthog.set_config({ disable_persistence: disabled })
	if (disabled) posthog.reset()
}

const unchangedSince = (decision: Consent | null) => (posthog: PostHog | undefined) =>
	decisionHolds(decision) ? posthog : undefined

const analyticsClient = () => {
	startAnalytics()
	const decision = currentConsent()
	return environment && isGranted(decision, "analytics")
		? loadClient(environment).then(unchangedSince(decision))
		: undefined
}

export const track = <E extends EventName>(name: E, ...[props]: TrackArgs<E>) => {
	void analyticsClient()?.then((posthog) => posthog?.capture(name, props))
}

export const trackPageview = (pathname: string) => route$.next(routePatternOfPathname(pathname))

const analyticsGranted$ = consent$.pipe(
	map((consent) => isGranted(consent, "analytics")),
	distinctUntilChanged()
)

export const startAnalytics = () => {
	if (environment) return
	const enabled = enabledEnvironment()
	if (!enabled) return
	environment = enabled

	analyticsGranted$.pipe(filter((granted) => !granted)).subscribe(removeSdkStorage)

	consent$
		.pipe(filter((consent) => client !== undefined || isGranted(consent, "analytics")))
		.subscribe(() => void loadClient(enabled).then(syncPersistence))

	combineLatest([route$, analyticsGranted$]).subscribe(([route, granted]) => {
		if (route && granted) track("$pageview", { route })
	})
}
