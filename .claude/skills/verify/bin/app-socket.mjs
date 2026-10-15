#!/usr/bin/env node
import { chmodSync, rmSync } from "node:fs"
import { connect, createServer } from "node:net"

const [socketPath, port] = process.argv.slice(2)

rmSync(socketPath, { force: true })
createServer((client) => {
	const upstream = connect(Number(port), "localhost")
	const close = () => {
		client.destroy()
		upstream.destroy()
	}
	client.on("error", close)
	upstream.on("error", close)
	client.pipe(upstream).pipe(client)
}).listen(socketPath, () => chmodSync(socketPath, 0o666))
