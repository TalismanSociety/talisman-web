#!/usr/bin/env node
import { createServer } from "node:http"
import { request as httpsRequest } from "node:https"

const [origin, port] = process.argv.slice(2)
const target = new URL(origin)
const hopByHop = ["connection", "keep-alive", "transfer-encoding", "upgrade"]

createServer((request, response) => {
	const headers = { ...request.headers, host: target.host }
	for (const name of hopByHop) delete headers[name]
	const upstream = httpsRequest(
		{ host: target.hostname, port: target.port || 443, method: request.method, path: request.url, headers },
		(reply) => {
			for (const name of hopByHop) delete reply.headers[name]
			response.writeHead(reply.statusCode, reply.headers)
			reply.pipe(response)
		}
	)
	upstream.on("error", (error) => {
		response.writeHead(502, { "Content-Type": "text/plain" })
		response.end(`${target.origin}: ${error.message}`)
	})
	request.pipe(upstream)
}).listen(Number(port), "localhost")
