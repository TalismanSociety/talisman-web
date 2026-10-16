import { act, renderHook } from "@testing-library/react"
import { RecoilRoot, useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
import { BehaviorSubject, Subject } from "rxjs"
import { describe, expect, it } from "vitest"
import { atomFromObservable, atomFromSubject } from "./recoil-bridge"

let keys = 0
const uniqueKey = () => `bridge-test-${keys++}`

describe("atomFromSubject", () => {
	it("starts from the subject's current value", () => {
		const subject$ = new BehaviorSubject("talisman")
		const state = atomFromSubject(uniqueKey(), subject$)

		const { result } = renderHook(() => useRecoilValue(state), { wrapper: RecoilRoot })

		expect(result.current).toBe("talisman")
	})

	it("follows the subject", () => {
		const subject$ = new BehaviorSubject<string | undefined>("talisman")
		const state = atomFromSubject(uniqueKey(), subject$)
		const { result } = renderHook(() => useRecoilValue(state), { wrapper: RecoilRoot })

		act(() => subject$.next("polkadot-js"))

		expect(result.current).toBe("polkadot-js")
	})

	it("writes a recoil set into the subject exactly once", () => {
		const subject$ = new BehaviorSubject<string | undefined>("talisman")
		const emitted: Array<string | undefined> = []
		subject$.subscribe((value) => emitted.push(value))
		const state = atomFromSubject(uniqueKey(), subject$)
		const { result } = renderHook(() => useRecoilState(state), { wrapper: RecoilRoot })

		act(() => result.current[1]("polkadot-js"))

		expect(subject$.value).toBe("polkadot-js")
		expect(emitted).toEqual(["talisman", "polkadot-js"])
		expect(result.current[0]).toBe("polkadot-js")
	})

	it("does not echo a subject emission back into the subject", () => {
		const subject$ = new BehaviorSubject(1)
		const emitted: number[] = []
		subject$.subscribe((value) => emitted.push(value))
		const state = atomFromSubject(uniqueKey(), subject$)
		renderHook(() => useRecoilValue(state), { wrapper: RecoilRoot })

		act(() => subject$.next(2))

		expect(emitted).toEqual([1, 2])
	})

	it("resets the subject to the value it held when the atom was created", () => {
		const subject$ = new BehaviorSubject<string | undefined>("5Grw")
		const state = atomFromSubject(uniqueKey(), subject$)
		const { result } = renderHook(
			() => [useRecoilState(state), useResetRecoilState(state)] as const,
			{ wrapper: RecoilRoot }
		)

		act(() => result.current[0][1]("5FHn"))
		act(() => result.current[1]())

		expect(subject$.value).toBe("5Grw")
		expect(result.current[0][0]).toBe("5Grw")
	})
})

describe("atomFromObservable", () => {
	it("holds the default until the source emits, then follows it", () => {
		const source$ = new Subject<string[]>()
		const state = atomFromObservable(uniqueKey(), source$, [] as string[])
		const { result } = renderHook(() => useRecoilValue(state), { wrapper: RecoilRoot })

		expect(result.current).toEqual([])
		act(() => source$.next(["5Grw"]))

		expect(result.current).toEqual(["5Grw"])
	})
})
