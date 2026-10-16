#!/usr/bin/env node
import { attach, fail, openTarget, targets } from "./lib.mjs"

const PORTAL = "http://localhost:3002"
const KEY = "analytics-consent"
const SEEDS = {
	reject: { analytics: false, errors: false },
	accept: { analytics: true, errors: true },
	unset: null,
}

const mode = process.argv[2] ?? process.env.CONSENT ?? "reject"
if (!Object.hasOwn(SEEDS, mode)) fail(`consent mode must be one of ${Object.keys(SEEDS).join(", ")}, not "${mode}"`, 2)
const seed = SEEDS[mode]

const write =
	seed === null
		? `localStorage.removeItem(${JSON.stringify(KEY)})`
		: `localStorage.setItem(${JSON.stringify(KEY)}, ${JSON.stringify(JSON.stringify(seed))})`

const tab =
	(await targets()).find((target) => target.type === "page" && !target.url.startsWith("chrome-extension://")) ??
	(await openTarget("about:blank"))
const page = await attach(tab)
let stored
try {
	page.on("Fetch.requestPaused", ({ requestId }) =>
		page.send("Fetch.fulfillRequest", {
			requestId,
			responseCode: 200,
			responseHeaders: [{ name: "Content-Type", value: "text/html" }],
			body: "",
		}).catch(() => {})
	)
	const loaded = new Promise((resolve) => page.on("Page.loadEventFired", resolve))
	await page.send("Page.enable")
	await page.send("Fetch.enable", { patterns: [{ urlPattern: `${PORTAL}/*` }] })
	await page.send("Page.navigate", { url: `${PORTAL}/` })
	await loaded
	stored = await page.evaluate(`(${write}, localStorage.getItem(${JSON.stringify(KEY)}))`)
	await page.send("Page.navigate", { url: "about:blank" })
	await page.send("Fetch.disable")
} finally {
	page.close()
}
const expected = seed === null ? null : JSON.stringify(seed)
if (stored !== expected) fail(`${KEY} reads ${stored} after seeding ${mode}, not ${expected}`)
console.log(`consent ${mode}: ${KEY} ${stored ?? "absent"}`)
