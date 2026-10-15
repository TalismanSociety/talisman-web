export type Search = Record<string, string>

export const parseSearch = (search: string): Search =>
	Object.fromEntries(new URLSearchParams(search))

export const validateSearch = (search: Record<string, unknown>): Search =>
	Object.fromEntries(
		Object.entries(search).flatMap(([key, value]) =>
			value === undefined ? [] : [[key, String(value)]]
		)
	)

export const stringifySearch = (search: Record<string, unknown>) => {
	const params = new URLSearchParams()
	for (const [key, value] of Object.entries(search)) {
		if (value !== undefined) params.set(key, String(value))
	}
	const query = params.toString()
	return query ? `?${query}` : ""
}
