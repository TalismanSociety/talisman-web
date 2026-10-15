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
