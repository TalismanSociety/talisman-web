import { readFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

const envFile = process.env.CLOUDFLARE_ENV_FILE ?? join(homedir(), ".talisman-dev", "cloudflare.env")
const env = Object.fromEntries(
  readFileSync(envFile, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(/=(.*)/s, 2)),
)

const buildId = process.argv[2]
if (!buildId) throw new Error("usage: yarn cloudflare:build-log <build uuid>")

const url = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/builds/builds/${buildId}/logs`

let cursor
do {
  const response = await fetch(cursor ? `${url}?cursor=${cursor}` : url, {
    headers: { Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}` },
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`)
  const { result } = await response.json()
  for (const [time, line] of result.lines ?? []) console.log(`${new Date(time).toISOString()} ${line}`)
  cursor = result.truncated ? result.cursor : undefined
} while (cursor)
