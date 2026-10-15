#!/usr/bin/env node
import { execFileSync } from "node:child_process"
import {
	attach,
	closeTarget,
	instanceId,
	openTarget,
	readInstance,
	repoRoot,
	sleep,
	TALISMAN,
	talismanWorker,
	targets,
	testAccounts,
	walletAccounts,
} from "./lib.mjs"

const results = []
const check = (name, ok, detail) => {
	results.push(ok)
	console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? `: ${detail}` : ""}`)
	return ok
}
const sh = (cmd, args) => {
	try {
		return execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
	} catch {
		return ""
	}
}

const root = repoRoot()
const instance = readInstance()
if (
	!check(
		`instance ${instanceId()} recorded for this checkout`,
		!!instance,
		instance ? "" : "run instance.sh up"
	)
)
	process.exit(1)

const labels = sh("docker", [
	"inspect",
	"-f",
	'{{.State.Status}} {{index .Config.Labels "talisman-web-verify.checkout"}}',
	instance.CONTAINER,
])
check(
	`container ${instance.CONTAINER} runs for this checkout`,
	labels === `running ${root}`,
	labels || "absent: instance.sh up"
)

const serverPid = sh("lsof", ["-t", "-nP", `-iTCP:${instance.APP_PORT}`, "-sTCP:LISTEN"]).split(
	"\n"
)[0]
const serverCwd = serverPid
	? sh("lsof", ["-a", "-p", serverPid, "-d", "cwd", "-Fn"])
			.split("\n")
			.find((line) => line.startsWith("n"))
			?.slice(1)
	: undefined
check(
	`app server on :${instance.APP_PORT} runs from this checkout`,
	serverCwd === `${root}/apps/portal`,
	serverPid ? `pid ${serverPid} in ${serverCwd}` : "nothing listening: instance.sh up"
)

const inContainer = sh("docker", [
	"exec",
	instance.CONTAINER,
	"curl",
	"-s",
	"-o",
	"/dev/null",
	"-w",
	"%{http_code}",
	"--max-time",
	"20",
	"http://localhost:3002/",
])
check(
	"the browser reaches the app at http://localhost:3002",
	inContainer === "200",
	`HTTP ${inContainer}`
)

const cdpUp = await targets().then(
	() => true,
	() => false
)
if (!check(`browser answers CDP on :${instance.CDP_PORT}`, cdpUp)) process.exit(1)

if (instance.WALLET !== "off") {
	const worker = await talismanWorker()
	const version = await worker.evaluate("chrome.runtime.getManifest().version")
	worker.close()
	check("Talisman service worker runs", !!version, `v${version}`)
	const storeVersion = await fetch(
		"https://clients2.google.com/service/update2/crx?response=updatecheck&prodversion=140.0&acceptformat=crx3&x=id%3Dfijngjgcjhjmmpcmkeiomlglpeiijkld%26uc",
		{ signal: AbortSignal.timeout(5000) }
	)
		.then((response) => response.text())
		.then((xml) => xml.match(/<updatecheck [^>]*version="([\d.]+)"/)?.[1])
		.catch(() => undefined)
	if (storeVersion !== version)
		console.log(
			`WARN Talisman v${version} in the image, the Chrome Web Store has ${storeVersion ?? "an unknown version"}: instance.sh build, then up (verify skill, Maintenance)`
		)

	const walletAddresses = new Set((await walletAccounts()).map((account) => account.address))
	const missing = testAccounts().filter((account) => !walletAddresses.has(account.address))
	check(
		"wallet holds every account of the backup",
		missing.length === 0,
		missing.length
			? `missing ${missing.map((a) => a.name).join(", ")}: instance.sh build, then up`
			: ""
	)

	const popup = await openTarget(`${TALISMAN}/popup.html`)
	const page = await attach(popup)
	let text = ""
	for (let attempt = 0; attempt < 20 && !text.includes("\n"); attempt++) {
		await sleep(500)
		text = await page.evaluate("document.body.innerText").catch(() => "")
	}
	page.close()
	await closeTarget(popup.id)
	check(
		"wallet is unlocked",
		text.length > 0 && !text.includes("Unlock the Talisman"),
		text.includes("Unlock the Talisman") ? "run talisman.mjs unlock" : ""
	)
}

const app = await openTarget("http://localhost:3002/")
const appPage = await attach(app)
let appText = ""
let appTitle = ""
for (let attempt = 0; attempt < 120 && appText.trim().length < 20; attempt++) {
	await sleep(500)
	appText = await appPage.evaluate("document.body?.innerText ?? ''").catch(() => "")
	appTitle = await appPage.evaluate("document.title").catch(() => "")
}
appPage.close()
await closeTarget(app.id)
const crashed = appText.includes("Sorry, an error occurred in Talisman")
const isPortal = appTitle.includes("Talisman Portal")
check(
	"the portal renders in the browser",
	appText.trim().length >= 20 && isPortal && !crashed,
	crashed
		? "the error boundary shows: read the page exceptions (verify skill, Gotchas)"
		: !appText.trim()
			? "blank page after 60s"
			: !isPortal
				? `the page titled "${appTitle}" is not the portal: ${appText.trim().split("\n")[0]}`
				: ""
)

process.exit(results.every(Boolean) ? 0 : 1)
