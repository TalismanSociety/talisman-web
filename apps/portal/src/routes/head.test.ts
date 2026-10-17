import { expect, test } from "vitest"

const routeSources = import.meta.glob("./**/*.tsx", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>

test("only the root route manages head tags and scripts, because the client renders without HeadContent and Scripts", () => {
	const withHead = Object.entries(routeSources)
		.filter(([, source]) => /^\s*(head|scripts)\s*[:(]/m.test(source))
		.map(([file]) => file)

	expect(withHead).toEqual(["./__root.tsx"])
})
