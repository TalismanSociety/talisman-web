import { env } from "cloudflare:workers"
import { createServerFn } from "@tanstack/react-start"
import { setResponseHeaders } from "@tanstack/react-start/server"

import { toSubnetPools, toValidators, toValidatorYields, validatorYieldsInput } from "./tda"
import { createTdaClient, TDA_CACHE_SECONDS } from "./tda-client"

const cachedTda = () => {
	setResponseHeaders(new Headers({ "Cache-Control": `public, max-age=${TDA_CACHE_SECONDS}` }))
	return createTdaClient({ apiKey: env.TDA_API_KEY, fetch, cache: caches.default })
}

export const getBittensorValidators = createServerFn({ method: "GET" }).handler(() =>
	cachedTda()("/validators", toValidators)
)

export const getSubnetPools = createServerFn({ method: "GET" }).handler(() =>
	cachedTda()("/pools", toSubnetPools)
)

export const getValidatorYields = createServerFn({ method: "GET" })
	.validator(validatorYieldsInput)
	.handler(({ data }) => cachedTda()(`/subnets/${data.netuid}/validators`, toValidatorYields))
