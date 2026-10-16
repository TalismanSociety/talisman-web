import { fireEvent, render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { RecoilRoot } from "recoil"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ThemeProvider, theme } from "@/ui/theme"
import { ErrorBoundary } from "./ErrorBoundary"

const { captureError } = vi.hoisted(() => ({ captureError: vi.fn() }))

vi.mock("@/domains/analytics/client", () => ({ captureError }))

const thrown = new Error("Stake from Alice failed")
const child = { throws: true }

const Child = () => {
	if (child.throws) throw thrown
	return <p>Staked</p>
}

const renderBoundary = (boundary: ReactNode) =>
	render(
		<ThemeProvider theme={theme.greenDark}>
			<RecoilRoot>{boundary}</RecoilRoot>
		</ThemeProvider>
	)

const keepJsdomQuiet = (event: ErrorEvent) => event.preventDefault()

beforeEach(() => {
	child.throws = true
	captureError.mockClear()
	vi.spyOn(console, "error").mockImplementation(() => undefined)
	window.addEventListener("error", keepJsdomQuiet)
})

afterEach(() => {
	window.removeEventListener("error", keepJsdomQuiet)
	vi.restoreAllMocks()
})

describe("ErrorBoundary", () => {
	it("shows the portal's error message and reports the error once, as caught by a boundary", () => {
		renderBoundary(
			<ErrorBoundary>
				<Child />
			</ErrorBoundary>
		)

		expect(screen.getByText("Oops!")).not.toBeNull()
		expect(screen.getByText("Sorry, an error occurred in Talisman.")).not.toBeNull()
		expect(screen.getByRole("button", { name: "Show error" })).not.toBeNull()
		expect(screen.queryByText("Staked")).toBeNull()
		expect(captureError.mock.calls).toEqual([[thrown, "error_boundary"]])
	})

	it("renders its children again on Refresh", () => {
		renderBoundary(
			<ErrorBoundary>
				<Child />
			</ErrorBoundary>
		)
		child.throws = false
		fireEvent.click(screen.getByRole("button", { name: "Refresh" }))

		expect(screen.getByText("Staked")).not.toBeNull()
		expect(screen.queryByText("Oops!")).toBeNull()
		expect(captureError).toHaveBeenCalledOnce()
	})

	it("hands the message to renderFallback", () => {
		renderBoundary(
			<ErrorBoundary
				renderFallback={(fallback) => <section aria-label="Stake">{fallback}</section>}
			>
				<Child />
			</ErrorBoundary>
		)

		expect(screen.getByRole("region", { name: "Stake" }).textContent).toContain("Oops!")
	})

	it("renders its children and reports nothing while they render", () => {
		child.throws = false
		renderBoundary(
			<ErrorBoundary>
				<Child />
			</ErrorBoundary>
		)

		expect(screen.getByText("Staked")).not.toBeNull()
		expect(captureError).not.toHaveBeenCalled()
	})
})
