import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { homedir } from "node:os"
import { fileURLToPath } from "node:url"

export const TALISMAN = "chrome-extension://eajedbpaeeicjfopdfclmfjjkhelgcod"

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const fail = (message, code = 1) => {
	process.stderr.write(`${message}\n`)
	process.exit(code)
}

export const repoRoot = () =>
	execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim()

export const instanceId = () => process.env.VERIFY_INSTANCE ?? "dev"

const instanceFile = () =>
	`${repoRoot()}/.tmp/verify/${instanceId() === "dev" ? "instance" : instanceId()}.env`

export function readInstance() {
	let text
	try {
		text = readFileSync(instanceFile(), "utf8")
	} catch {
		return undefined
	}
	return Object.fromEntries(
		text
			.split("\n")
			.filter((line) => line.includes("="))
			.map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)])
	)
}

function cdpPort() {
	const port = process.env.VERIFY_CDP_PORT ?? readInstance()?.CDP_PORT
	if (!port)
		fail(
			`no verify instance for ${repoRoot()}: run .claude/skills/verify/bin/instance.sh up (verify skill, Launch)`
		)
	return port
}

const cdpUrl = () => `http://127.0.0.1:${cdpPort()}`

export async function targets() {
	try {
		return await (await fetch(`${cdpUrl()}/json/list`)).json()
	} catch {
		return fail(`no browser answers CDP on :${cdpPort()}: instance.sh up`)
	}
}

export async function openTarget(url) {
	return (await fetch(`${cdpUrl()}/json/new?${url}`, { method: "PUT" })).json()
}

export async function closeTarget(id) {
	await fetch(`${cdpUrl()}/json/close/${id}`)
}

export async function attach(target) {
	const socket = new WebSocket(target.webSocketDebuggerUrl)
	await new Promise((resolve, reject) => {
		socket.onopen = resolve
		socket.onerror = () => reject(new Error(`CDP socket to ${target.url} failed`))
	})
	let lastId = 0
	const send = (method, params = {}, sessionId = undefined) =>
		new Promise((resolve, reject) => {
			const id = ++lastId
			const onMessage = ({ data }) => {
				const message = JSON.parse(data)
				if (message.id !== id) return
				socket.removeEventListener("message", onMessage)
				socket.removeEventListener("close", onClose)
				if (message.error) reject(new Error(message.error.message))
				else resolve(message.result)
			}
			const onClose = () => reject(new Error(`CDP socket to ${target.url} closed during ${method}`))
			socket.addEventListener("message", onMessage)
			socket.addEventListener("close", onClose, { once: true })
			if (socket.readyState !== WebSocket.OPEN) return onClose()
			socket.send(JSON.stringify({ id, method, params, sessionId }))
		})
	const evaluate = async (expression) => {
		const { result, exceptionDetails } = await send("Runtime.evaluate", {
			expression,
			awaitPromise: true,
			returnByValue: true,
		})
		if (exceptionDetails)
			throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
		return result.value
	}
	const on = (method, listener) =>
		socket.addEventListener("message", ({ data }) => {
			const message = JSON.parse(data)
			if (message.method === method) listener(message.params, message.sessionId)
		})
	const closed = new Promise((resolve) => socket.addEventListener("close", resolve))
	return { send, evaluate, on, closed, close: () => socket.close() }
}

export async function talismanWorker() {
	for (let attempt = 0; attempt < 30; attempt++) {
		const worker = (await targets()).find(
			(t) => t.type === "service_worker" && t.url.startsWith(TALISMAN)
		)
		if (worker) return attach(worker)
		if (attempt === 5) await openTarget(`${TALISMAN}/popup.html`)
		await sleep(1000)
	}
	return fail("no Talisman service worker after 30s: instance.sh down, then up")
}

export const BACKUP = `${homedir()}/.talisman-dev/verify-backup.json`

export const testAccounts = () =>
	JSON.parse(readFileSync(BACKUP, "utf8")).storage.keyring.accounts.map(
		({ name, address, type }) => ({ name, address, type })
	)

export async function walletAccounts() {
	const worker = await talismanWorker()
	const { keyring } = await worker.evaluate(`chrome.storage.local.get("keyring")`)
	worker.close()
	return (keyring?.accounts ?? []).map(({ name, address, type }) => ({ name, address, type }))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(cdpPort())
