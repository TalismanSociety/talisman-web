import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { watchLoadedScripts } from "./loadedScripts"

const ORIGIN = location.origin

type Entry = { name: string; responseStatus?: number }

const observers: ((entries: Entry[]) => void)[] = []
let buffered: Entry[] = []

class FakePerformanceObserver {
	static supportedEntryTypes = ["resource"]
	constructor(private readonly callback: (list: { getEntries: () => Entry[] }) => void) {}
	observe(options: { type: string; buffered?: boolean }) {
		expect(options).toEqual({ type: "resource", buffered: true })
		const deliver = (entries: Entry[]) => this.callback({ getEntries: () => entries })
		observers.push(deliver)
		deliver(buffered)
	}
}

const served = (name: string): Entry => ({ name, responseStatus: 200 })

beforeEach(() => {
	vi.stubGlobal("PerformanceObserver", FakePerformanceObserver)
	observers.length = 0
	buffered = []
	document.head.innerHTML = ""
})

afterEach(() => vi.unstubAllGlobals())

describe("watchLoadedScripts", () => {
	it("counts the app's scripts from the resource buffer and those loaded later", () => {
		buffered = [served(`${ORIGIN}/assets/index-XnDWOPtL.js`)]
		const isLoaded = watchLoadedScripts()
		for (const observer of observers) observer([served(`${ORIGIN}/assets/late-Zz99Yy88.js`)])
		expect(isLoaded(`${ORIGIN}/assets/index-XnDWOPtL.js`)).toBe(true)
		expect(isLoaded(`${ORIGIN}/assets/late-Zz99Yy88.js`)).toBe(true)
	})

	const forged = `${ORIGIN}/assets/AliceVault-Ab12Cd34.js`

	it.each([
		["the server refused", { name: forged, responseStatus: 404 }],
		["whose status the browser did not expose", { name: forged, responseStatus: 0 }],
		["with no status at all", { name: forged }],
		["that redirected", { name: forged, responseStatus: 302 }],
	])("ignores a script %s", (_, entry: Entry) => {
		buffered = [entry]
		expect(watchLoadedScripts()(forged)).toBe(false)
	})

	it.each([
		["another origin", "https://evil.example/assets/main-Ab12Cd34.js"],
		["a path outside /assets", `${ORIGIN}/main-Ab12Cd34.js`],
		[
			"an encoded slash, which the Worker redirects to a real chunk",
			`${ORIGIN}/assets/AliceVault%2F..%2Fmain-Ab12Cd34.js`,
		],
		[
			"a build name followed by an encoded path",
			`${ORIGIN}/assets/main-Ab12Cd34.js%2F..%2FAliceVault%2F..%2Fmain-Ab12Cd34.js`,
		],
		["a nested path", `${ORIGIN}/assets/AliceVault/main-Ab12Cd34.js`],
		["a path that only ends like an asset", `${ORIGIN}/AliceVault/assets/main-Ab12Cd34.js`],
		["a stylesheet", `${ORIGIN}/assets/styles-UEXffpz_.css`],
		["a script with a query", `${ORIGIN}/assets/main-Ab12Cd34.js?v=1`],
		["a script with a fragment", `${ORIGIN}/assets/main-Ab12Cd34.js#x`],
		["a page", `${ORIGIN}/staking`],
	])("ignores %s", (_, name) => {
		buffered = [served(name)]
		expect(watchLoadedScripts()(name)).toBe(false)
	})

	it("counts no script element that has no resource entry", () => {
		document.head.insertAdjacentHTML(
			"beforeend",
			'<script type="module" src="/assets/AliceVault-Ab12Cd34.js"></script>'
		)
		expect(watchLoadedScripts()(`${ORIGIN}/assets/AliceVault-Ab12Cd34.js`)).toBe(false)
	})

	it("counts nothing where resource entries are unsupported", () => {
		vi.stubGlobal("PerformanceObserver", undefined)
		expect(watchLoadedScripts()(`${ORIGIN}/assets/index-XnDWOPtL.js`)).toBe(false)
	})
})
