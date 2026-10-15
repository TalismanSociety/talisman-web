#!/usr/bin/env node
import { createReadStream, statSync } from "node:fs"
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

createServer((request, response) => {
	const path = normalize(decodeURIComponent(new URL(request.url, "http://localhost").pathname))
	const asked = join(dir, path)
	const file = asked.startsWith(dir) && isFile(asked) ? asked : join(dir, "index.html")
	response.writeHead(200, {
		"Content-Type": types[extname(file)] ?? "application/octet-stream",
		"Cache-Control": "no-store",
	})
	createReadStream(file).pipe(response)
}).listen(Number(port), "localhost")
