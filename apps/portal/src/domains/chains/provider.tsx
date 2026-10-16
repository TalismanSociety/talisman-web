import type { PropsWithChildren } from "react"

import type { ChainConfig } from "./config"
import { ChainContext } from "./contexts"

export const ChainProvider = (props: PropsWithChildren<{ chain: ChainConfig }>) => (
	<ChainContext.Provider value={props.chain}>{props.children}</ChainContext.Provider>
)
