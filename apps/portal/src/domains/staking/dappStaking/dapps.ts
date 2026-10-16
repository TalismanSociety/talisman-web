import { bind } from "@react-rxjs/core"
import { useContext, useEffect } from "react"
import { defer, type Observable, shareReplay } from "rxjs"

import { ChainContext } from "@/domains/chains/contexts"
import { assertChain } from "@/domains/chains/utils"

type ChainDapp = {
	contractAddress: string
	stakersCount: number
	registeredAt: string
	registrationBlockNumber: number
	unregisteredAt: string | null
	unregistrationBlockNumber: string | null
}

type SimpleDapp = {
	imagesUrl: string
	address: string
	name: string
	mainCategory: string
	iconUrl: string
	creationTime: number
}

export type DappInfo = SimpleDapp & { stakerCount: number }

const queries = new Map<string, Observable<unknown>>()

const cachedQuery$ = <T>(key: string, query: () => Promise<T>) => {
	const cached = queries.get(key) ?? defer(query).pipe(shareReplay(1))
	queries.set(key, cached)
	return cached as Observable<T>
}

const fetchRegisteredDapps = async (dappStakingApi: string, priorityDapp: string | undefined) => {
	const [chainDapps, simpleDapps] = await Promise.all([
		fetch(new URL("./chaindapps", dappStakingApi)).then(
			async (response) => (await response.json()) as ChainDapp[]
		),
		fetch(new URL("./dappssimple", dappStakingApi.replace("v3", "v1"))).then(
			async (response) => (await response.json()) as SimpleDapp[]
		),
	])

	const dapps = chainDapps.flatMap((chainDapp): DappInfo[] => {
		const simpleDapp = simpleDapps.find(
			(y) => y.address.toLowerCase() === chainDapp.contractAddress.toLowerCase()
		)
		return simpleDapp === undefined ? [] : [{ ...simpleDapp, stakerCount: chainDapp.stakersCount }]
	})

	if (priorityDapp === undefined) return dapps

	const isPriority = (dapp: DappInfo) => dapp.address.toLowerCase() === priorityDapp.toLowerCase()
	return [...dapps.filter(isPriority).slice(0, 1), ...dapps.filter((dapp) => !isPriority(dapp))]
}

export const registeredDapps$ = (dappStakingApi: string, priorityDapp: string | undefined) =>
	cachedQuery$(`registered:${dappStakingApi}:${priorityDapp}`, () =>
		fetchRegisteredDapps(dappStakingApi, priorityDapp)
	)

const [useRegisteredDappsOf] = bind(registeredDapps$)

const useDappStakingChain = () => {
	const chain = useContext(ChainContext)
	assertChain(chain, { hasDappStaking: true })
	return chain
}

export const useRegisteredDapps = () => {
	const chain = useDappStakingChain()
	return useRegisteredDappsOf(chain.dappStakingApi, chain.priorityDapp)
}

export const usePreloadRegisteredDapps = () => {
	const { dappStakingApi, priorityDapp } = useDappStakingChain()
	useEffect(() => {
		const subscription = registeredDapps$(dappStakingApi, priorityDapp).subscribe({
			error: () => {},
		})
		return () => subscription.unsubscribe()
	}, [dappStakingApi, priorityDapp])
}

const earnedRewards$ = (dappStakingApi: string, address: string) =>
	cachedQuery$(`earned:${dappStakingApi}:${address}`, () =>
		fetch(new URL(`./earned/${address}`, dappStakingApi.replace("v3", "v1"))).then(
			async (response) => (await response.json()) as number
		)
	)

export const [useEarnedRewards] = bind(earnedRewards$)
