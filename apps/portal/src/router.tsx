import { createRouter, type ErrorComponentProps, type RouterHistory } from "@tanstack/react-router"

import { parseSearch, stringifySearch } from "@/util/search"

import { routeTree } from "./routeTree.gen"

const rethrowToTheAppErrorBoundary = ({ error }: ErrorComponentProps): never => {
	throw error
}

const leaveScrollingToTheBrowser = () => false

const keepNativeScrollRestoration = () => {
	history.scrollRestoration = "auto"
	addEventListener("pageshow", () => {
		history.scrollRestoration = "auto"
	})
}

const writeEachNavigationToTheBrowserAtOnce = (routerHistory: RouterHistory) =>
	routerHistory.subscribe(routerHistory.flush)

export function getRouter() {
	const router = createRouter({
		routeTree,
		parseSearch,
		stringifySearch,
		notFoundMode: "root",
		defaultErrorComponent: rethrowToTheAppErrorBoundary,
		scrollRestoration: leaveScrollingToTheBrowser,
	})

	if (!router.isServer) {
		keepNativeScrollRestoration()
		writeEachNavigationToTheBrowserAtOnce(router.history)
	}

	return router
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
