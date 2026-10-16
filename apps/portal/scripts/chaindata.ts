import fs from "node:fs"
import {
	type ChaindataFile,
	ChaindataFileSchema,
	DEFAULT_CHAINDATA_URL,
} from "@talismn/chaindata-provider"

import { PORTAL_NETWORKS } from "../src/domains/chains/portal-networks.ts"
import { trimChaindata } from "./chaindata/trim.ts"

const OUTPUT_PATH = "public/chaindata.json"

const response = await fetch(DEFAULT_CHAINDATA_URL)
if (!response.ok) throw new Error(`Failed to fetch ${DEFAULT_CHAINDATA_URL}: ${response.status}`)

const chaindata = trimChaindata((await response.json()) as ChaindataFile, PORTAL_NETWORKS)
ChaindataFileSchema.parse(chaindata)

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(chaindata, null, 2)}\n`)
console.log(
	`Wrote ${OUTPUT_PATH}: ${chaindata.networks.length} networks, ${chaindata.tokens.length} tokens, ${chaindata.miniMetadatas.length} miniMetadatas`
)
