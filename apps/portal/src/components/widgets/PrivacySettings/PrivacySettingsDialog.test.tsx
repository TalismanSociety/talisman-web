import { act, fireEvent, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import {
	click,
	renderInPortal,
	STORAGE_KEY,
	settle,
	storedConsent,
	stubModalDialogs,
} from "./testShell"

const switchNamed = (name: string) => screen.getByRole<HTMLInputElement>("switch", { name })

const isChecked = (name: string) => switchNamed(name).checked

const renderDialog = async () => {
	const { PrivacySettingsDialog } = await import("./PrivacySettingsDialog")
	const { openPrivacySettings } = await import("./privacySettingsOpen")
	renderInPortal(<PrivacySettingsDialog />)
	const open = async () => {
		act(() => openPrivacySettings())
		await settle()
		return screen.getByRole("dialog")
	}
	const dialog = await open()
	return { open, dialog }
}

const footerClose = () => screen.getByRole("button", { name: "Close" })

beforeEach(() => {
	vi.resetModules()
	localStorage.clear()
	stubModalDialogs()
})

describe("PrivacySettingsDialog", () => {
	it("opens from undecided with both choices off and Essential locked on", async () => {
		await renderDialog()

		expect(screen.getByRole("heading", { name: "Privacy settings" })).toBeTruthy()
		expect(isChecked("Analytics")).toBe(false)
		expect(isChecked("Error reporting")).toBe(false)
		expect(isChecked("Essential")).toBe(true)
		expect(switchNamed("Essential").disabled).toBe(true)
		expect(switchNamed("Analytics").getAttribute("aria-describedby")).toBeTruthy()
		expect(storedConsent()).toBeNull()
	})

	it("saves only the categories switched on", async () => {
		await renderDialog()

		fireEvent.click(switchNamed("Error reporting"))
		await click("Save")

		expect(storedConsent()).toEqual({ analytics: false, errors: true })
		expect(screen.queryByRole("dialog")).toBeNull()
	})

	it("saves both choices off when nothing is switched on", async () => {
		await renderDialog()

		await click("Save")

		expect(storedConsent()).toEqual({ analytics: false, errors: false })
		expect(screen.queryByRole("dialog")).toBeNull()
	})

	it("ends with Close and Save", async () => {
		const { dialog } = await renderDialog()

		const buttons = within(dialog)
			.getAllByRole("button")
			.map((button) => button.textContent)
		expect(buttons.slice(-2)).toEqual(["Close", "Save"])
	})

	it("Close discards the draft and keeps the stored choice", async () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: false, errors: true }))
		const { open } = await renderDialog()
		fireEvent.click(switchNamed("Analytics"))

		fireEvent.click(footerClose())
		await settle()

		expect(screen.queryByRole("dialog")).toBeNull()
		expect(storedConsent()).toEqual({ analytics: false, errors: true })
		await open()
		expect(isChecked("Analytics")).toBe(false)
	})

	it("reopens on the stored choice", async () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: true, errors: false }))
		await renderDialog()

		expect(isChecked("Analytics")).toBe(true)
		expect(isChecked("Error reporting")).toBe(false)
	})

	it("reopens on the choice made in the previous opening", async () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: true, errors: true }))
		const { open } = await renderDialog()
		fireEvent.click(switchNamed("Analytics"))
		await click("Save")

		await open()

		expect(storedConsent()).toEqual({ analytics: false, errors: true })
		expect(isChecked("Analytics")).toBe(false)
		expect(isChecked("Error reporting")).toBe(true)
	})

	it("links to the privacy policy in a new tab", async () => {
		await renderDialog()

		const link = screen.getByRole("link", { name: "Privacy policy" })
		expect(link.getAttribute("href")).toBe(
			"https://docs.talisman.xyz/talisman/about/privacy-policy"
		)
		expect(link.getAttribute("target")).toBe("_blank")
	})
})
