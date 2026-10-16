export type IsLoadedScript = (filename: string) => boolean

const BUILD_SCRIPT = /^\/assets\/[\w.-]+\.js$/

const ownScriptOf = (href: string) => {
	if (!URL.canParse(href, location.href)) return undefined
	const url = new URL(href, location.href)
	const own =
		url.origin === location.origin && BUILD_SCRIPT.test(url.pathname) && !url.search && !url.hash
	return own ? url.href : undefined
}

const isServed = (entry: PerformanceEntry) =>
	"responseStatus" in entry && entry.responseStatus === 200

export const watchLoadedScripts = (): IsLoadedScript => {
	const loaded = new Set<string>()
	if (globalThis.PerformanceObserver?.supportedEntryTypes?.includes("resource"))
		new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				const script = isServed(entry) ? ownScriptOf(entry.name) : undefined
				if (script) loaded.add(script)
			}
		}).observe({ type: "resource", buffered: true })
	return (filename) => loaded.has(filename)
}
