import { firstValueFrom, of, throwError, toArray } from "rxjs"
import { describe, expect, it } from "vitest"
import { toLoadable } from "./loadable"

describe("toLoadable", () => {
	it("emits loading, then the value", async () => {
		const states = await firstValueFrom(toLoadable(of(42)).pipe(toArray()))

		expect(states).toEqual([{ status: "loading" }, { status: "success", data: 42 }])
	})

	it("emits loading, then the error", async () => {
		const error = new Error("rpc down")
		const states = await firstValueFrom(toLoadable(throwError(() => error)).pipe(toArray()))

		expect(states).toEqual([{ status: "loading" }, { status: "error", error }])
	})
})
