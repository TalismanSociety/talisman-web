import { getCachedQuery$ } from "@/util/getCachedQuery"
import { bindSuspended } from "@/util/loadable"

const fetchLidoApr = async (apiEndpoint: string): Promise<number> => {
	const response = await fetch(new URL("v1/protocol/steth/apr/sma", apiEndpoint))
	const body = await response.json()
	return body.data.smaApr / 100
}

export const lidoApr$ = (apiEndpoint: string) =>
	getCachedQuery$("lidoApr", apiEndpoint, () => fetchLidoApr(apiEndpoint))

export const [useLidoApr] = bindSuspended(lidoApr$)
