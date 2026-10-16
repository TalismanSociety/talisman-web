import { expect, it, vi } from "vitest"

it("loads where location is undefined, as on the Worker", async () => {
	vi.stubGlobal("location", undefined)

	await expect(import("./chaindata-provider")).resolves.toHaveProperty("chaindataProvider")
})
