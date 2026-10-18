import type { FileRoutesByFullPath } from "@/routeTree.gen"

type AppFullPath = keyof FileRoutesByFullPath

const ROUTE_PATTERNS = {
	"/": "/",
	"/admin": "/admin",
	"/nfts": "/nfts",
	"/portfolio/": "/portfolio",
	"/portfolio/$": "/portfolio/:rest",
	"/staking": "/staking",
	"/staking/": "/staking",
	"/staking/positions": "/staking/positions",
	"/staking/providers": "/staking/providers",
	"/transport/": "/transport",
	"/transport/$": "/transport/:rest",
	"/transport/swap": "/transport/swap",
} as const satisfies Record<AppFullPath, string>

const UNKNOWN_ROUTE = "/:unknown"

export type RoutePattern = (typeof ROUTE_PATTERNS)[AppFullPath] | typeof UNKNOWN_ROUTE

export const ROUTE_PATTERN_VALUES: readonly RoutePattern[] = [
	...new Set(Object.values(ROUTE_PATTERNS)),
	UNKNOWN_ROUTE,
]

const withoutTrailingSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path)

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const segmentSource = (segment: string) => {
	if (segment === "$") return ".+"
	if (segment.startsWith("$")) return "[^/]+"
	return escapeRegExp(segment)
}

const isSplat = (fullPath: string) => fullPath.endsWith("/$")

const MATCHERS = Object.entries(ROUTE_PATTERNS)
	.sort(([a], [b]) => Number(isSplat(a)) - Number(isSplat(b)))
	.map(([fullPath, pattern]) => ({
		regExp: new RegExp(
			`^${withoutTrailingSlash(fullPath).split("/").map(segmentSource).join("/")}$`
		),
		pattern,
	}))

export const routePatternOfPathname = (pathname: string): RoutePattern => {
	const path = withoutTrailingSlash(pathname)
	return MATCHERS.find(({ regExp }) => regExp.test(path))?.pattern ?? UNKNOWN_ROUTE
}
