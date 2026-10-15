import { useNavigate, useSearch } from "@tanstack/react-router"
import { useCallback, useMemo } from "react"

type SearchParamsUpdate = URLSearchParams | ((current: URLSearchParams) => URLSearchParams)

export const useSearchParams = () => {
	const search = useSearch({ from: "__root__" })
	const navigate = useNavigate()
	const searchParams = useMemo(() => new URLSearchParams(search), [search])

	const setSearchParams = useCallback(
		(update: SearchParamsUpdate, options?: { replace?: boolean }) => {
			const next = typeof update === "function" ? update(new URLSearchParams(searchParams)) : update
			return navigate({ to: ".", search: Object.fromEntries(next), replace: options?.replace })
		},
		[navigate, searchParams]
	)

	return [searchParams, setSearchParams] as const
}
