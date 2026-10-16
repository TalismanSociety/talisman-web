import { afterEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"

const recordStringEvaluations = () => {
	const evaluated: unknown[][] = []
	vi.stubGlobal(
		"Function",
		new Proxy(Function, {
			construct: (target, args, newTarget) => {
				evaluated.push(args)
				return Reflect.construct(target, args, newTarget)
			},
			apply: (target, thisArg, args) => {
				evaluated.push(args)
				return Reflect.apply(target, thisArg, args)
			},
		})
	)
	return evaluated
}

afterEach(() => {
	vi.unstubAllGlobals()
	z.config({ jitless: true })
})

describe("staker-rewards worker", () => {
	it("boots without evaluating a string as code", async () => {
		const evaluated = recordStringEvaluations()

		await import("./worker")
		expect(evaluated).toEqual([])

		z.config({ jitless: false })
		z.object({})
		expect(evaluated, "the recorder sees Zod's eval probe once jitless is off").toEqual([[""]])
	})
})
