#!/usr/bin/env node
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"

const CDP = "http://localhost:9223"
const backup = JSON.parse(readFileSync(process.argv[2], "utf8"))
if (!backup.isTalismanBackup) throw new Error(`${process.argv[2]} is not a Talisman backup`)
backup.storage.settings = { ...backup.storage.settings, autoLockMinutes: 0 }

const unpackedExtensionId = (path) =>
	[...createHash("sha256").update(path).digest("hex").slice(0, 32)]
		.map((digit) => String.fromCharCode(97 + Number.parseInt(digit, 16)))
		.join("")
const EXTENSION = `chrome-extension://${unpackedExtensionId("/opt/talisman")}`

const targets = async () => (await fetch(`${CDP}/json/list`)).json()
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForWorker() {
	for (let attempt = 0; attempt < 60; attempt++) {
		const worker = (await targets()).find(
			(t) => t.type === "service_worker" && t.url.startsWith(EXTENSION)
		)
		if (worker) return worker
		if (attempt === 10)
			await fetch(`${CDP}/json/new?${EXTENSION}/dashboard.html`, { method: "PUT" })
		await sleep(1000)
	}
	throw new Error("no extension service worker after 60s")
}

async function evaluate(expression) {
	const socket = new WebSocket((await waitForWorker()).webSocketDebuggerUrl)
	await new Promise((resolve, reject) => {
		socket.onopen = resolve
		socket.onerror = reject
	})
	const reply = new Promise((resolve) => {
		socket.onmessage = ({ data }) => {
			const message = JSON.parse(data)
			if (message.id === 1) resolve(message)
		}
	})
	socket.send(
		JSON.stringify({
			id: 1,
			method: "Runtime.evaluate",
			params: { expression, awaitPromise: true, returnByValue: true },
		})
	)
	const { result, error } = await reply
	socket.close()
	if (error) throw new Error(error.message)
	if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description)
	return result.result.value
}

async function waitForFirstRun() {
	let previous
	for (let attempt = 0; attempt < 60; attempt++) {
		const stored = await evaluate(
			`globalThis.chrome?.storage ? chrome.storage.local.get(null).then((stored) => Object.keys(stored).sort().join()) : ""`
		)
		if (stored.split(",").includes("app") && stored === previous) return
		previous = stored
		await sleep(1000)
	}
	throw new Error("Talisman's first run did not settle within 60s")
}

await waitForFirstRun()
const keys = JSON.stringify(Object.keys(backup.storage))
await evaluate(`chrome.storage.local.set(${JSON.stringify(backup.storage)})
  .then(() => chrome.storage.local.get(null))
  .then((stored) => chrome.storage.local.remove(Object.keys(stored).filter((key) => !${keys}.includes(key))))`)
await sleep(5000)
const app = await evaluate(`chrome.storage.local.get("app").then(({ app }) => app)`)
if (app?.onboarded !== "TRUE") throw new Error("wallet not onboarded after the restore")

for (const target of await targets())
	if (target.type === "page" && target.url.startsWith(EXTENSION))
		await fetch(`${CDP}/json/close/${target.id}`)
console.log(`restored the backup of ${new Date(backup.timestamp).toISOString()}`)
