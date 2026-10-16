import { OnChainId } from "@talismn/on-chain-id"
import { atom } from "jotai"
import { atomFamily } from "jotai/utils"

import { chainConnectors } from "@/domains/chains/chain-connectors"

const onChainId = new OnChainId({ chainConnectors })

export const resolveNsNameFamily = atomFamily((name?: string) =>
	atom(async () => (name ? await onChainId.resolveNames([name]) : undefined))
)

export const lookupAddressFamily = atomFamily((address?: string) =>
	atom(async () => (address ? await onChainId.lookupAddresses([address]) : undefined))
)
