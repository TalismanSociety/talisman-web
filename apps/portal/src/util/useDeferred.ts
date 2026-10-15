import type { DependencyList } from "react"
import { useMemo } from "react"

const useDeferred = <T>(deps: DependencyList = []) => {
	const resolver = useMemo<{ resolve?: (value: T) => unknown; reject?: (value: any) => unknown }>(
		() => ({ resolve: undefined, reject: undefined }),
		deps
	)

	const promise = useMemo(
		async () =>
			await new Promise<T>((resolve, reject) => {
				resolver.resolve = resolve
				resolver.reject = reject
			}),
		[resolver]
	)

	return { promise, resolve: resolver.resolve!, reject: resolver.reject! }
}

export default useDeferred
