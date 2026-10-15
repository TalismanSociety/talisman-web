#!/usr/bin/env node
import { execFile } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { promisify } from "node:util"
import { attach, fail, sleep, targets, testAccounts } from "./lib.mjs"

const bin = new URL(".", import.meta.url).pathname
const skill = new URL("..", import.meta.url).pathname
const run = promisify(execFile)

export const flows = () => JSON.parse(readFileSync(`${skill}/smoke-flows.json`, "utf8"))

const STEP_TIMEOUT = Number(process.env.SMOKE_STEP_TIMEOUT ?? 90) * 1000
const REQUEST_TIMEOUT = 60_000

const talisman = async (...args) => {
	try {
		return (await run(`${bin}talisman.mjs`, args, { env: process.env })).stdout
	} catch (error) {
		throw new Error(`talisman.mjs ${args[0]}: ${(error.stderr || error.stdout || error.message).trim()}`)
	}
}

const until = async (what, timeout, probe) => {
	const deadline = Date.now() + timeout
	let last
	while (Date.now() < deadline) {
		last = await probe().catch((error) => String(error))
		if (last === true) return
		await sleep(500)
	}
	throw new Error(`${what}: ${last}`)
}

const account = (flow) =>
	testAccounts().find((candidate) => candidate.name === flow.account) ??
	fail(`${flow.name}: "${flow.account}" is not a test account (talisman.mjs accounts)`, 2)

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

const publicKey = (ss58) => {
	if (ss58.startsWith("0x")) return ss58.toLowerCase()
	const value = [...ss58].reduce((sum, char) => sum * 58n + BigInt(BASE58.indexOf(char)), 0n)
	const digits = value === 0n ? "" : value.toString(16)
	const hex = "00".repeat(ss58.match(/^1*/)[0].length) + digits.padStart(Math.ceil(digits.length / 2) * 2, "0")
	const prefixLength = parseInt(hex.slice(0, 2), 16) & 0b0100_0000 ? 2 : 1
	return `0x${hex.slice(prefixLength * 2, prefixLength * 2 + 64)}`
}

const normalize = (entry) => {
	const request = entry.request
	if (entry.kind === "pub(extrinsic.sign)")
		return {
			kind: "substrate",
			signer: publicKey(request.address),
			genesisHash: request.genesisHash,
			method: request.method,
			tip: BigInt(request.tip ?? 0).toString(),
			...(request.appId == null ? {} : { appId: Number(request.appId) }),
			...(request.assetId == null ? {} : { assetId: request.assetId }),
		}
	const [tx] = request.params
	return {
		kind: "ethereum",
		from: tx.from?.toLowerCase(),
		to: tx.to?.toLowerCase(),
		data: tx.data ?? tx.input ?? "0x",
		value: BigInt(tx.value ?? 0).toString(),
		...(tx.chainId === undefined ? {} : { chainId: Number(tx.chainId) }),
	}
}

async function appPage() {
	const page = (await targets()).find((target) => target.type === "page" && target.url.startsWith("http://localhost:3002"))
	return page ?? fail("no portal tab: smoke.sh opens one when it connects the wallet")
}

async function drive(flow, result) {
	const page = await attach(await appPage())
	const script = readFileSync(`${bin}smoke-page.js`, "utf8")
	try {
		await page.send("Page.enable")
		await page.send("Page.bringToFront")
		const { identifier } = await page.send("Page.addScriptToEvaluateOnNewDocument", { source: script })
		await page.send("Page.navigate", { url: `http://localhost:3002${flow.path}` })
		await page.send("Page.removeScriptToEvaluateOnNewDocument", { identifier })
		await until("the page did not load", 60_000, async () =>
			(await page.evaluate(`document.readyState !== "loading" && !!window.__smoke`)) || "loading"
		)
		const act = async (outcome) => {
			if (process.env.SMOKE_DEBUG) console.error(JSON.stringify(outcome))
			if (outcome?.click) {
				const at = { x: outcome.click.x, y: outcome.click.y, button: "left", clickCount: 1 }
				await page.send("Input.dispatchMouseEvent", { type: "mouseMoved", ...at })
				await page.send("Input.dispatchMouseEvent", { type: "mousePressed", ...at })
				await page.send("Input.dispatchMouseEvent", { type: "mouseReleased", ...at })
			} else if (outcome?.type !== undefined) await page.send("Input.insertText", { text: outcome.type })
			return typeof outcome === "object" || outcome
		}
		const step = (args, timeout = STEP_TIMEOUT) => {
			let previous
			return until(`step ${JSON.stringify(args)}`, timeout, async () => {
				const outcome = await page.evaluate(`window.__smokeStep(${JSON.stringify(args)})`)
				const settled = !outcome?.click || JSON.stringify(outcome) === JSON.stringify(previous)
				previous = outcome
				return settled ? act(outcome) : "waiting for the button to hold still"
			})
		}
		const escape = async () => {
			const key = { key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 }
			await page.send("Input.dispatchKeyEvent", { type: "keyDown", ...key })
			await page.send("Input.dispatchKeyEvent", { type: "keyUp", ...key })
		}
		const bothConnected = ["see", "~2 Connected"]
		for (let attempt = 1; account(flow).address.startsWith("0x"); attempt++) {
			await step(["page"])
			if (await step(bothConnected, 20_000).then(() => true, () => false)) break
			if (attempt > 3) throw new Error(`the portal did not reconnect ${flow.account} after 3 attempts`)
			await until("the wallet sheet did not open", STEP_TIMEOUT, async () => {
				if ((await page.evaluate(`window.__smokeStep(["dialog"])`)) === true) return true
				await page.evaluate(`window.__smokeStep(["page"])`)
				await act(await page.evaluate(`window.__smokeStep(["press", "~Connected"])`))
				await sleep(1500)
				return "opening"
			})
			await step(["press", "=Connect"])
			await talisman("connect", "--account", flow.account, "--timeout", "15").catch(() => {})
			await escape()
			await step(["page"])
			await step(bothConnected, 15_000).catch(() => {})
		}
		for (const args of flow.steps) {
			try {
				await step(args)
			} catch (error) {
				result.status = "unavailable"
				result.detail = error.message
				return
			}
			await sleep(300)
		}
		await until("no signing request reached the wallet", REQUEST_TIMEOUT, async () =>
			(await page.evaluate("window.__smoke.requests.length")) > 0 || "waiting"
		)
		const [entry, ...more] = await page.evaluate("window.__smoke.requests")
		result.raw = entry.request
		result.payload = normalize(entry)
		if (more.length) result.detail = `${more.length} more signing request(s) ignored`
		let refusal
		await until("the wallet neither opened a popup nor answered", REQUEST_TIMEOUT, async () => {
			refusal = (await page.evaluate("window.__smoke.requests[0].error")) ?? undefined
			return refusal !== undefined || (await talisman("list")).trim() !== "" || "waiting"
		})
		if (refusal !== undefined) {
			result.status = result.submit ? "error" : "captured"
			result.detail = `the wallet refused without a popup: ${refusal}`
			return
		}
		const text = await talisman("text", "--timeout", "60")
		const [, popup] = text.match(/^popup (\S+)/) ?? []
		result.popup = text.split("\n").slice(1).join("\n")
		if (!result.submit) {
			await talisman("reject", "--popup", popup)
			result.status = "captured"
			return
		}
		if (!flow.account.includes("Guardians")) throw new Error(`refusing to sign with "${flow.account}": not a Guardians account`)
		result.approve = await talisman("approve", "--signer", flow.account, "--popup", popup)
		await until("the dapp did not submit the signed transaction", REQUEST_TIMEOUT, async () => {
			const state = await page.evaluate("({ requests: window.__smoke.requests, submissions: window.__smoke.submissions })")
			const signed = state.requests[0]
			if (signed.error) throw new Error(`the wallet answered ${signed.error}`)
			if (result.payload.kind === "ethereum") {
				if (!signed.response) return "waiting for the transaction hash"
				result.submission = { chainId: result.payload.chainId ?? 1, hash: signed.response }
				return true
			}
			const submission = state.submissions.at(-1)
			if (!submission?.extrinsic) return "waiting for the extrinsic"
			result.submission = submission
			return true
		})
		const signer = result.payload.from ?? result.raw.address
		result.onchain = JSON.parse((await run(`${bin}smoke-chain.mjs`, [JSON.stringify(result.submission), signer], { timeout: 300_000 })).stdout)
		result.status = result.onchain.success ? "submitted" : "failed"
	} finally {
		if (!["captured", "submitted"].includes(result.status)) {
			const { data } = await page.send("Page.captureScreenshot").catch(() => ({}))
			if (data) writeFileSync(screenshotFile, Buffer.from(data, "base64"))
		}
		page.close()
	}
}

const [flowName, outFile, ...flags] = process.argv.slice(2)
if (!flowName || !outFile) fail("usage: smoke.mjs <flow> <out.json> [--submit]", 2)
const flow = flows().find((candidate) => candidate.name === flowName) ?? fail(`no flow ${flowName} in smoke-flows.json`, 2)
const screenshotFile = outFile.replace(/\.json$/, ".png")
const result = { flow: flow.name, instance: process.env.VERIFY_INSTANCE, submit: flags.includes("--submit"), status: "error" }
try {
	await drive(flow, result)
} catch (error) {
	result.status = "error"
	result.detail = error.message
}
writeFileSync(outFile, `${JSON.stringify(result, null, 2)}\n`)
console.log(`${flow.name} ${result.status}${result.detail ? `: ${result.detail}` : ""}`)
