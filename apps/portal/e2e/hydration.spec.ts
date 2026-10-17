import { expect, type Page, test } from "@playwright/test"

const foreignNodes = {
	none: "",
	"first in head": `new MutationObserver((_, observer) => {
		if (!document.head) return
		document.head.prepend(Object.assign(document.createElement("meta"), { name: "foreign" }))
		observer.disconnect()
	}).observe(document, { childList: true, subtree: true })`,
	"first in body": `new MutationObserver((_, observer) => {
		if (!document.body) return
		document.body.prepend(Object.assign(document.createElement("div"), { id: "foreign" }))
		observer.disconnect()
	}).observe(document, { childList: true, subtree: true })`,
}

const loads = 3

test.setTimeout(180_000)

const hydrationError = /hydrat|Minified React error #4(18|19|2[1-5])/i

const watchHydrationErrors = (page: Page) => {
	const errors: string[] = []
	page.on("console", (message) => {
		if (hydrationError.test(message.text())) errors.push(message.text())
	})
	page.on("pageerror", (error) => {
		if (hydrationError.test(error.message)) errors.push(error.message)
	})
	return errors
}

const primaryColour = (page: Page) =>
	page.evaluate(() =>
		getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()
	)

const expectStyledWithoutHydrationErrors = async (page: Page, errors: string[], label: string) => {
	await expect(page.getByRole("link", { name: "Staking", exact: true })).toBeVisible({
		timeout: 120_000,
	})
	expect(errors, label).toEqual([])
	expect(await primaryColour(page), label).toBe("rgb(213,255,92)")
}

for (const [position, plant] of Object.entries(foreignNodes)) {
	test(`keeps its styles over ${loads} fresh loads with a foreign node ${position}`, async ({
		page,
	}) => {
		const errors = watchHydrationErrors(page)
		if (plant) await page.addInitScript(plant)

		for (let load = 1; load <= loads; load++) {
			await page.goto("/staking/providers")
			await expectStyledWithoutHydrationErrors(page, errors, `load ${load}`)
		}
	})
}
