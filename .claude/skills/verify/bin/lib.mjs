import { readFileSync } from "node:fs"
import { homedir } from "node:os"

export const TALISMAN = "chrome-extension://eajedbpaeeicjfopdfclmfjjkhelgcod"

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const fail = (message, code = 1) => {
	process.stderr.write(`${message}\n`)
	process.exit(code)
}

const CDP = "http://127.0.0.1:9223"

export async function targets() {
	try {
		return await (await fetch(`${CDP}/json/list`)).json()
	} catch {
		return fail(`Chromium does not answer CDP in ${process.env.VERIFY_INSTANCE}: verify up, or rerun the lane`)
	}
}

export async function openTarget(url) {
	return (await fetch(`${CDP}/json/new?${url}`, { method: "PUT" })).json()
}

export async function closeTarget(id) {
	await fetch(`${CDP}/json/close/${id}`)
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
		const target = (await targets()).find(
			(t) => t.type === "service_worker" && t.url.startsWith(TALISMAN)
		)
		if (target) {
			const worker = await attach(target)
			if (await worker.evaluate("!!globalThis.chrome?.storage")) return worker
			worker.close()
		} else if (attempt === 5) await openTarget(`${TALISMAN}/popup.html`)
		await sleep(1000)
	}
	return fail("no Talisman service worker with chrome.storage after 30s: verify down, then up")
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
