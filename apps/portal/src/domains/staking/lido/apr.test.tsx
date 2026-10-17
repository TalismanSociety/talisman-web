import { Subscribe } from "@react-rxjs/core"
import { fireEvent, render, screen } from "@testing-library/react"
import { Suspense } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ErrorBoundary } from "@/components/widgets/ErrorBoundary"
import { ThemeProvider, theme } from "@/ui/theme"
import { useLidoApr } from "./apr"

vi.mock("@/domains/analytics/client", () => ({ captureError: vi.fn() }))

const Apr = ({ endpoint }: { endpoint: string }) => (
	<p>{(useLidoApr(endpoint) * 100).toFixed(2)} %</p>
)

const renderApr = (endpoint: string) =>
	render(
		<ThemeProvider theme={theme.greenDark}>
			<Subscribe>
				<ErrorBoundary>
					<Suspense fallback={<p>Loading</p>}>
						<Apr endpoint={endpoint} />
					</Suspense>
				</ErrorBoundary>
			</Subscribe>
		</ThemeProvider>
	)

const keepJsdomQuiet = (event: ErrorEvent) => event.preventDefault()

beforeEach(() => {
	vi.spyOn(console, "error").mockImplementation(() => undefined)
	window.addEventListener("error", keepJsdomQuiet)
})

afterEach(() => {
	window.removeEventListener("error", keepJsdomQuiet)
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
})

describe("lido APR", () => {
	it("reads the 7-day SMA as a fraction and fetches it once per endpoint", async () => {
		const fetch = vi.fn(
			async (_input: RequestInfo | URL) => new Response(JSON.stringify({ data: { smaApr: 3.21 } }))
		)
		vi.stubGlobal("fetch", fetch)

		renderApr("https://a.lido.test")
		renderApr("https://a.lido.test")

		expect((await screen.findAllByText("3.21 %")).length).toBe(2)
		expect(fetch.mock.calls.map(([input]) => String(input))).toEqual([
			"https://a.lido.test/v1/protocol/steth/apr/sma",
		])
	})

	it("shows the error boundary when the API is down, and recovers on one Refresh", async () => {
		const api = { down: true }
		vi.stubGlobal(
			"fetch",
			vi.fn(async () =>
				api.down
					? new Response("down", { status: 503 })
					: new Response(JSON.stringify({ data: { smaApr: 3.21 } }))
			)
		)

		renderApr("https://b.lido.test")

		expect(await screen.findByText("Oops!")).toBeDefined()
		api.down = false
		fireEvent.click(screen.getByRole("button", { name: "Refresh" }))

		expect(await screen.findByText("3.21 %")).toBeDefined()
		expect(screen.queryByText("Oops!")).toBeNull()
	})
})
