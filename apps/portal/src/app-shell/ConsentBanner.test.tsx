import { fireEvent, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import {
	click,
	renderInPortal,
	STORAGE_KEY,
	settle,
	storedConsent,
	stubModalDialogs,
} from "@/components/widgets/PrivacySettings/testShell"

const banner = () =>
	screen.queryByRole("region", { name: "We use cookies to help improve your experience." })

const bannerSection = (container: HTMLElement) =>
	container.querySelector<HTMLElement>("section[aria-labelledby]")

const renderShell = async () => {
	const { ConsentBanner } = await import("./ConsentBanner")
	const { PrivacySettingsDialog } = await import(
		"@/components/widgets/PrivacySettings/PrivacySettingsDialog"
	)
	return renderInPortal(
		<>
			<ConsentBanner />
			<PrivacySettingsDialog />
		</>
	)
}

beforeEach(() => {
	vi.resetModules()
	localStorage.clear()
	stubModalDialogs()
})

describe("ConsentBanner", () => {
	it("tells an undecided visitor what the cookies are for and offers Reject, Settings and Accept", async () => {
		await renderShell()

		const region = banner()
		expect(region).not.toBeNull()
		const buttons = Array.from(
			(region as HTMLElement).querySelectorAll("button"),
			(button) => button.textContent
		)
		expect(buttons).toEqual(["Reject", "Settings", "Accept"])
	})

	it.each([
		["Accept", { analytics: true, errors: true }],
		["Reject", { analytics: false, errors: false }],
	])("%s stores its choice and hides the banner", async (action, expected) => {
		await renderShell()

		await click(action)

		expect(storedConsent()).toEqual(expected)
		expect(banner()).toBeNull()
	})

	it("Save in Settings with both switches off rejects everything and hides the banner", async () => {
		await renderShell()

		await click("Settings")
		await click("Save")

		expect(storedConsent()).toEqual({ analytics: false, errors: false })
		expect(banner()).toBeNull()
	})

	it("Settings opens the dialog in place of the banner, and closing it undecided brings the banner back", async () => {
		const { container } = await renderShell()

		await click("Settings")

		expect(screen.getByRole("dialog")).toBeTruthy()
		expect(screen.getByRole("heading", { name: "Privacy settings" })).toBeTruthy()
		expect(bannerSection(container)?.hasAttribute("hidden")).toBe(true)

		fireEvent.click(screen.getByRole("button", { name: "Close" }))
		await settle()

		expect(screen.queryByRole("dialog")).toBeNull()
		expect(bannerSection(container)?.hasAttribute("hidden")).toBe(false)
		expect(banner()).not.toBeNull()
		expect(storedConsent()).toBeNull()
	})

	it("stays hidden once a choice is stored", async () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: false, errors: true }))
		await renderShell()

		expect(banner()).toBeNull()
	})
})
