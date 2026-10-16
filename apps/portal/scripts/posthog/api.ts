export type Api = {
	readonly dryRun: boolean
	readonly host: string
	get<T>(path: string): Promise<T>
	post<T>(path: string, body: unknown): Promise<T>
	patch<T>(path: string, body: unknown): Promise<T>
	delete(path: string): Promise<null>
	listAll<T>(path: string): Promise<T[]>
	query<T>(source: unknown): Promise<T>
}

export type Log = (line: string) => void

export class StepFailure extends Error {}

export class HttpError extends Error {
	constructor(
		message: string,
		readonly status: number,
		readonly detail: string
	) {
		super(message)
	}
}

const detailOf = (text: string) => {
	try {
		const body = JSON.parse(text) as { detail?: unknown }
		return typeof body.detail === "string" ? body.detail : text.slice(0, 400)
	} catch {
		return text.slice(0, 400)
	}
}

const indent = (text: string) => text.replace(/^/gm, "    ")

type Page<T> = { results?: T[]; next?: string | null }

export class PosthogApi implements Api {
	#nextFakeId = 100_000

	constructor(
		readonly host: string,
		private readonly projectId: string,
		private readonly apiKey: string,
		readonly dryRun: boolean,
		private readonly verbose: boolean,
		private readonly log: Log
	) {}

	#url(path: string) {
		return path.startsWith("http") ? path : `${this.host}/api/projects/${this.projectId}${path}`
	}

	async #send<T>(method: string, path: string, body?: unknown): Promise<T> {
		const url = this.#url(path)
		const res = await fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: body === undefined ? undefined : JSON.stringify(body),
		})
		const text = await res.text()
		if (!res.ok)
			throw new HttpError(
				`${method} ${url} → HTTP ${res.status}\n${text.slice(0, 2000)}`,
				res.status,
				detailOf(text)
			)
		return (text ? JSON.parse(text) : null) as T
	}

	async #write<T>(method: "POST" | "PATCH" | "DELETE", path: string, body?: unknown): Promise<T> {
		const printBody = () =>
			body !== undefined && this.verbose && this.log(indent(JSON.stringify(body, null, 2)))
		if (this.dryRun) {
			this.log(`  [dry-run] ${method} ${this.#url(path)}`)
			printBody()
			return { id: this.#nextFakeId++, ...(body as object) } as T
		}
		if (this.verbose) this.log(`  ${method} ${this.#url(path)}`)
		printBody()
		return this.#send<T>(method, path, body)
	}

	get<T>(path: string) {
		return this.#send<T>("GET", path)
	}

	post<T>(path: string, body: unknown) {
		return this.#write<T>("POST", path, body)
	}

	patch<T>(path: string, body: unknown) {
		return this.#write<T>("PATCH", path, body)
	}

	delete(path: string) {
		return this.#write<null>("DELETE", path)
	}

	query<T>(source: unknown) {
		return this.#send<T>("POST", "/query/", { query: source, refresh: "force_blocking" })
	}

	async listAll<T>(path: string): Promise<T[]> {
		const results: T[] = []
		let next: string | null | undefined = this.#url(path)
		while (next) {
			const page: Page<T> = await this.get<Page<T>>(next)
			results.push(...(page.results ?? []))
			next = page.next
		}
		return results
	}
}

export const ingest = async (url: string, projectToken: string, batch: readonly unknown[]) => {
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ api_key: projectToken, historical_migration: false, batch }),
	})
	const text = await res.text()
	if (!res.ok)
		throw new HttpError(
			`POST ${url} → HTTP ${res.status}\n${text.slice(0, 500)}`,
			res.status,
			detailOf(text)
		)
}
