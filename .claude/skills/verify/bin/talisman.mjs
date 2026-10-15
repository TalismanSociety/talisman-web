#!/usr/bin/env node
import { readFileSync } from "node:fs"
import { homedir } from "node:os"
import {
	attach,
	BACKUP,
	closeTarget,
	fail,
	openTarget,
	sleep,
	TALISMAN,
	talismanWorker,
	targets,
	testAccounts,
} from "./lib.mjs"

const [command, ...rest] = process.argv.slice(2)
const option = (name, fallback) => {
	const index = rest.indexOf(`--${name}`)
	return index === -1 ? fallback : rest[index + 1]
}
const timeoutMs = Number(option("timeout", "60")) * 1000

const POPUP_PREFIX = `${TALISMAN}/popup.html#/`
const SIGNING_ROUTES = ["substrate-sign", "eth-sign", "eth-send", "sol-sign", "vrf-sign"]

const isRequestPopup = (target) =>
	target.type === "page" && target.url.startsWith(POPUP_PREFIX) && !target.url.endsWith("#/login")

const popupRoute = (target) => target.url.slice(POPUP_PREFIX.length).split("/")[0]

const listPopups = async () => (await targets()).filter(isRequestPopup)

const waitForPopup = async (id) => {
	const deadline = Date.now() + timeoutMs
	while (Date.now() < deadline) {
		const popups = await listPopups()
		const popup = id ? popups.find((p) => p.id === id) : popups[0]
		if (popup) return popup
		await sleep(500)
	}
	return fail(`no Talisman request popup${id ? ` ${id}` : ""} within ${timeoutMs / 1000}s`)
}

const readText = (page) => page.evaluate("document.body.innerText")

const isLocked = (text) => text.includes("Unlock the Talisman")

const tryClick = (page, matcher) =>
	page.evaluate(`(() => {
		const button = [...document.querySelectorAll("button")].find((b) => (${matcher})(b.innerText.trim()));
		if (!button || button.disabled) return null;
		button.click();
		return button.innerText.trim();
	})()`)

const clickButton = async (page, matcher) => {
	const deadline = Date.now() + timeoutMs
	while (Date.now() < deadline) {
		const clicked = await tryClick(page, matcher)
		if (clicked) return clicked
		await sleep(500)
	}
	return fail(`no enabled button matching ${matcher} within ${timeoutMs / 1000}s`)
}

const waitForClose = async (target) => {
	const deadline = Date.now() + timeoutMs
	while (Date.now() < deadline) {
		if (!(await targets()).some((t) => t.id === target.id)) return
		await sleep(500)
	}
	fail("popup still open after the click")
}

const withPopup = async (action, id) => {
	const target = await waitForPopup(id)
	const page = await attach(target)
	const deadline = Date.now() + timeoutMs
	let text = ""
	while (Date.now() < deadline) {
		await sleep(1000)
		text = await readText(page).catch(() => "")
		if (text.trim() && !text.includes("Analysing transaction")) break
	}
	if (isLocked(text)) {
		page.close()
		fail("Talisman is locked: run talisman.mjs unlock, then retry", 3)
	}
	await action(page, text, target)
	page.close()
}

async function unlock() {
	const password = readFileSync(`${homedir()}/.talisman-dev/verify-password`, "utf8").trim()
	const target = await openTarget(`${TALISMAN}/popup.html`)
	const page = await attach(target)
	try {
		for (let attempt = 0; attempt < 40; attempt++) {
			const text = await readText(page).catch(() => "")
			if (text && !isLocked(text) && !text.includes("Unlock")) return console.log("unlocked")
			if (isLocked(text)) break
			await sleep(500)
		}
		await page.evaluate(`document.querySelector("input[name=password]").focus()`)
		await page.send("Input.insertText", { text: password })
		await clickButton(page, `(t) => t === "Unlock"`)
		for (let attempt = 0; attempt < 40; attempt++) {
			await sleep(500)
			if (!isLocked(await readText(page).catch(() => "Unlock the Talisman")))
				return console.log("unlocked")
		}
		fail("still locked after submitting ~/.talisman-dev/verify-password", 3)
	} finally {
		page.close()
		await closeTarget(target.id)
	}
}

const signerLine = (text) => {
	const lines = text.split("\n").map((line) => line.trim())
	const intro = lines.findIndex((line) => line.endsWith("with account") || line === "with")
	return intro === -1 ? undefined : lines[intro + 1]
}

switch (command) {
	case "unlock":
		await unlock()
		break
	case "accounts":
		console.log(JSON.stringify(testAccounts(), null, 2))
		break
	case "list":
		for (const popup of await listPopups()) console.log(`${popup.id} ${popup.url}`)
		break
	case "text":
		await withPopup((_page, text, target) => {
			console.log(`popup ${target.id}`)
			console.log(text)
		})
		break
	case "connect": {
		const wanted = rest.flatMap((arg, index) => (rest[index - 1] === "--account" ? [arg] : []))
		const unknown = wanted.filter((name) => !testAccounts().some((account) => account.name === name))
		if (unknown.length) fail(`not a test account (talisman.mjs accounts): ${unknown.join(", ")}`, 2)
		await withPopup(async (page, _text, target) => {
			if (wanted.length === 0) await tryClick(page, `(t) => t === "Connect All"`)
			else {
				const offered = await page.evaluate(`[...document.querySelectorAll("button")].map((b) => b.innerText.trim())`)
				const missing = wanted.filter((name) => !offered.includes(name))
				if (missing.length) fail(`the popup does not offer ${missing.join(", ")}:\n${offered.join("\n")}`, 2)
				const toggled = await page.evaluate(`(() => {
					const wanted = ${JSON.stringify(wanted)};
					const rows = [...document.querySelectorAll("button")].filter((b) => b.querySelector("svg") && !b.querySelector("button") && /\\bh-24\\b/.test(b.className));
					const flip = rows.filter((b) => wanted.includes(b.innerText.trim()) === b.classList.contains("text-body-secondary"));
					flip.forEach((b) => b.click());
					return flip.map((b) => b.innerText.trim());
				})()`)
				if (toggled.length) await sleep(500)
				const label = `Connect ${wanted.length}`
				console.log(`selected ${wanted.join(", ")}, clicked ${await clickButton(page, `(t) => t === ${JSON.stringify(label)}`)}`)
				await waitForClose(target)
				return
			}
			console.log(`clicked ${await clickButton(page, `(t) => /^Connect \\d+$/.test(t)`)}`)
			await waitForClose(target)
		})
		break
	}
	case "site": {
		const worker = await talismanWorker()
		const host = rest[0] ?? "localhost:3002"
		const { sitesAuthorized } = await worker.evaluate(`chrome.storage.local.get("sitesAuthorized")`)
		worker.close()
		const site = sitesAuthorized?.[host]
		const name = (address) =>
			testAccounts().find((account) => account.address.toLowerCase() === address.toLowerCase())?.name ?? address
		console.log(
			JSON.stringify({
				host,
				substrate: (site?.addresses ?? []).map(name),
				ethereum: (site?.ethAddresses ?? []).map(name),
			})
		)
		break
	}
	case "approve": {
		const popupId = option("popup")
		if (!popupId)
			fail(
				"usage: talisman.mjs approve --signer <name> --popup <id>, with the id talisman.mjs text printed",
				2
			)
		const signer = option("signer")
		if (!testAccounts().some((account) => account.name === signer))
			fail(
				`approve signs only with a test account of ${BACKUP} (talisman.mjs accounts): --signer <name>`,
				2
			)
		await withPopup(async (page, text, target) => {
			const route = popupRoute(target)
			if (!SIGNING_ROUTES.includes(route))
				fail(
					`popup ${target.id} is a "${route}" request, not one of ${SIGNING_ROUTES.join(", ")}: approve only signs, nothing clicked`,
					2
				)
			if (signerLine(text) !== signer)
				fail(`"${signer}" is not the signer, nothing clicked:\n${text}`, 2)
			console.log(text)
			console.log(`clicked ${await clickButton(page, `(t) => t === "Approve" || t === "Sign"`)}`)
			await waitForClose(target)
		}, popupId)
		break
	}
	case "reject":
		await withPopup(async (page, _text, target) => {
			console.log(`clicked ${await clickButton(page, `(t) => t === "Cancel" || t === "Reject"`)}`)
			await waitForClose(target)
		}, option("popup"))
		break
	default:
		fail(
			"usage: talisman.mjs unlock | accounts | list | text | connect [--account <name>]... | site [host] | approve --signer <name> --popup <id> | reject [--popup <id>]"
		)
}
