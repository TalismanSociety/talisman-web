// @vitest-environment node
import { renderToString } from "react-dom/server"
import { expect, it, vi } from "vitest"

const appProvidersLoaded = vi.hoisted(() => vi.fn())

vi.mock("@/AppProviders", () => {
	appProvidersLoaded()
	return { default: () => null }
})

it("renders the shell on the server without loading the app providers", async () => {
	const { Route } = await import("./__root")
	const RootComponent = Route.options.component
	if (!RootComponent) throw new Error("root route has no component")

	expect(renderToString(<RootComponent />)).toBe("")
	await vi.dynamicImportSettled()
	expect(appProvidersLoaded).not.toHaveBeenCalled()
})
