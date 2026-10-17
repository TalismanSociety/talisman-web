import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import ThemeProvider from "@/App.Theme"
import { ListItem } from "./ListItem"

afterEach(() => {
	vi.restoreAllMocks()
})

describe("ListItem", () => {
	it("keeps its own props off the DOM element", () => {
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)

		render(
			<ThemeProvider>
				<ListItem
					aria-label="Talisman pool"
					headlineContent="Talisman pool"
					trailingContent="Stake"
					revealTrailingContentOnHover
				/>
			</ThemeProvider>
		)

		expect(screen.getByRole("article", { name: "Talisman pool" })).toBeTruthy()
		expect(consoleError.mock.calls.flat().join(" ")).not.toContain("revealTrailingContentOnHover")
	})
})
