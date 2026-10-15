#!/usr/bin/env node
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize } from "node:path"

const [dir, port] = process.argv.slice(2)
const types = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".wasm": "application/wasm",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".ttf": "font/ttf",
	".txt": "text/plain; charset=utf-8",
	".webmanifest": "application/manifest+json",
}

const isFile = (path) => {
	try {
		return statSync(path).isFile()
	} catch {
		return false
	}
}

const headersFile = join(dir, "_headers")
const pathRules = (existsSync(headersFile) ? readFileSync(headersFile, "utf8") : "")
	.split(/\n\s*\n/)
	.map((block) => block.trim().split("\n"))
	.filter(([pattern]) => pattern?.startsWith("/"))
	.map(([pattern, ...lines]) => ({
		regex: new RegExp(`^${pattern.split("*").map((part) => part.replace(/[.?+^$()|[\]{}\\]/g, "\\$&")).join(".*")}$`),
		headers: lines.map((line) => line.trim().split(/: (.*)/s, 2)).filter(([name]) => name.toLowerCase() !== "cache-control"),
	}))

const ruleHeaders = (path) =>
	pathRules.filter(({ regex }) => regex.test(path)).flatMap(({ headers }) => headers)

createServer((request, response) => {
	const path = normalize(decodeURIComponent(new URL(request.url, "http://localhost").pathname))
	const asked = join(dir, path)
	const file = asked.startsWith(dir) && isFile(asked) ? asked : join(dir, "index.html")
	response.writeHead(200, [
		...ruleHeaders(path),
		["Content-Type", types[extname(file)] ?? "application/octet-stream"],
		["Cache-Control", "no-store"],
	].flat())
	createReadStream(file).pipe(response)
}).listen(Number(port), "localhost")
