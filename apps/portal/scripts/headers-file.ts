const CLOUDFLARE_HEADERS_LINE_LIMIT = 2000

export const headerRules = (file: string) =>
	new Map(
		file
			.trim()
			.split(/\n\s*\n/)
			.map((block) => {
				const [path = "", ...lines] = block.trim().split("\n")
				const headers = lines.map((line) => line.trim().split(/: (.*)/s, 2) as [string, string])
				return [path, new Map(headers)] as const
			})
	)

export const withRootHeader = (headers: string, name: string, value: string) => {
	const line = `  ${name}: ${value}`
	if (line.length >= CLOUDFLARE_HEADERS_LINE_LIMIT)
		throw new Error(
			`${name} line is ${line.length} characters, Cloudflare caps _headers lines at ${CLOUDFLARE_HEADERS_LINE_LIMIT}`
		)

	const [rootBlock = "", ...otherBlocks] = headers.split("\n\n")
	if (!rootBlock.startsWith("/*\n")) throw new Error("_headers does not start with the /* block")
	const rootNames = [...(headerRules(rootBlock).get("/*")?.keys() ?? [])]
	if (rootNames.some((rootName) => rootName.toLowerCase() === name.toLowerCase()))
		throw new Error(`The /* block of _headers already sets ${name}`)
	return [`${rootBlock}\n${line}`, ...otherBlocks].join("\n\n")
}
