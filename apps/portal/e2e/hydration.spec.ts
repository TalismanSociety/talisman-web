import { expect, type Page, test } from "@playwright/test"

type ForeignNode = {
	parent: "head" | "body"
	tag: string
	attrs: Record<string, string>
	selector: string
}

const foreignNodes: Record<string, ForeignNode | undefined> = {
	"without a foreign node": undefined,
	"with a foreign node first in head": {
		parent: "head",
		tag: "meta",
		attrs: { name: "foreign" },
		selector: 'head > meta[name="foreign"]:first-child',
	},
	"with a foreign node first in body": {
		parent: "body",
		tag: "div",
		attrs: { id: "foreign" },
		selector: "body > div#foreign:first-child",
	},
}

const plantForeignNode = ({ parent, tag, attrs }: ForeignNode) => {
	new MutationObserver((_, observer) => {
		const target = document[parent]
		if (!target) return
		target.prepend(Object.assign(document.createElement(tag), attrs))
		observer.disconnect()
	}).observe(document, { childList: true, subtree: true })
}

const loads = 3

test.setTimeout(loads * 120_000)

const hydrationError =
	/Hydration failed|error while hydrating|finished hydrating|server HTML|Minified React error #4(18|19|2[1-5])/

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

for (const [condition, node] of Object.entries(foreignNodes)) {
	test(`keeps its styles over ${loads} fresh loads ${condition}`, async ({ page }) => {
		const errors = watchHydrationErrors(page)
		if (node) await page.addInitScript(plantForeignNode, node)

		for (let load = 1; load <= loads; load++) {
			await page.goto("/staking/providers")
			await expect(page.getByRole("link", { name: "Staking", exact: true })).toBeVisible({
				timeout: 120_000,
			})
			await expect(page.locator("html"), `load ${load}`).toHaveCount(1)
			if (node) await expect(page.locator(node.selector), `load ${load}`).toHaveCount(1)
			expect(errors, `load ${load}`).toEqual([])
			expect(await primaryColour(page), `load ${load}`).toMatch(/^rgb\(/)
		}
	})
}
