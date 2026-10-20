import fs from "node:fs"
import {
	type ChaindataFile,
	ChaindataFileSchema,
	DEFAULT_CHAINDATA_URL,
} from "@talismn/chaindata-provider"

import { PORTAL_NETWORKS } from "../src/domains/chains/portal-networks.ts"
import { bittensorSubnets } from "./chaindata/subnets.ts"
import { trimChaindata } from "./chaindata/trim.ts"

const OUTPUT_PATH = "src/domains/chains/chaindata.json"
const SUBNETS_PATH = "src/domains/staking/subtensor/subnets.json"

const response = await fetch(DEFAULT_CHAINDATA_URL)
if (!response.ok) throw new Error(`Failed to fetch ${DEFAULT_CHAINDATA_URL}: ${response.status}`)

const upstream = (await response.json()) as ChaindataFile
const chaindata = trimChaindata(upstream, PORTAL_NETWORKS)
ChaindataFileSchema.parse(chaindata)

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(chaindata, null, 2)}\n`)

const subnets = bittensorSubnets(upstream, "bittensor")
fs.writeFileSync(SUBNETS_PATH, `${JSON.stringify(subnets, null, 2)}\n`)
console.log(
	`Wrote ${OUTPUT_PATH}: ${chaindata.networks.length} networks, ${chaindata.tokens.length} tokens, ${chaindata.miniMetadatas.length} miniMetadatas; ${SUBNETS_PATH}: ${subnets.length} subnets`
)
