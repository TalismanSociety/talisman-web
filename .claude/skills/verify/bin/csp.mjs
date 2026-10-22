#!/usr/bin/env node
import { appendFileSync } from "node:fs"
import { attach, fail, targets } from "./lib.mjs"

const [out] = process.argv.slice(2)
if (!out) fail("usage: csp.mjs <out.jsonl>", 2)

const PORTAL = "http://localhost:3002"
const BINDING = "__cspViolation"
const listener = `addEventListener("securitypolicyviolation", (event) => globalThis.${BINDING}?.(JSON.stringify({
	document: event.documentURI,
	directive: event.effectiveDirective,
	blocked: event.blockedURI,
	disposition: event.disposition,
	source: event.sourceFile,
	line: event.lineNumber,
	sample: event.sample,
})), true)`

const startedAt = Date.now()

const record = (entry) => appendFileSync(out, `${JSON.stringify({ at: new Date().toISOString(), ...entry })}\n`)

const mentionsCsp = (text) => /Content[ -]Security[ -]Policy/i.test(text ?? "")

async function watch(target) {
	const page = await attach(target)
	const workers = new Map()
	page.on("Runtime.bindingCalled", ({ name, payload }) => {
		if (name !== BINDING) return
		const violation = JSON.parse(payload)
		if (violation.document?.startsWith(PORTAL)) record({ channel: "event", ...violation })
	})
	page.on("Log.entryAdded", ({ entry }, sessionId) => {
		if (!mentionsCsp(entry.text) || entry.timestamp < startedAt) return
		if (sessionId !== undefined && !workers.has(sessionId)) return
		const context = sessionId === undefined ? "page" : `worker ${workers.get(sessionId)}`
		record({ channel: "console", context, level: entry.level, text: entry.text, url: entry.url })
	})
	page.on("Target.attachedToTarget", ({ sessionId, targetInfo }) => {
		if (!targetInfo.type.endsWith("worker")) return
		workers.set(sessionId, targetInfo.url)
		page.send("Log.enable", {}, sessionId).catch(() => {})
	})
	await page.send("Page.enable")
	await page.send("Runtime.enable")
	await page.send("Runtime.addBinding", { name: BINDING })
	await page.send("Page.addScriptToEvaluateOnNewDocument", { source: listener })
	await page.evaluate(listener)
	await page.send("Log.enable")
	await page.send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: false, flatten: true })
	return page
}

const pages = (await targets()).filter(
	(target) => target.type === "page" && !target.url.startsWith("chrome-extension://") && !target.url.startsWith("devtools://")
)
if (!pages.length) fail("no page tab to watch: open the portal first")

const watched = await Promise.all(pages.map(watch))
process.stdin.on("end", () => process.exit(0)).resume()
process.stdout.write(`ready: watching ${pages.length} tab(s)\n`)
await Promise.race(watched.map((page) => page.closed))
fail("a watched tab closed its CDP socket")
