export const COINS_API_URL = "https://coins.talisman.xyz/token-rates"

type CoinsApiRequest = { coingeckoIds: string[]; currencyIds: string[] }

export type CoinsApiPrices = Record<string, Record<string, number>>

export const coinsApiRequestOf = (init: RequestInit | undefined): CoinsApiRequest =>
	JSON.parse(String(init?.body))

export const coinsApiReply = (init: RequestInit | undefined, prices: CoinsApiPrices) => {
	const { coingeckoIds, currencyIds } = coinsApiRequestOf(init)
	const rates = coingeckoIds.map((id) => {
		const price = prices[id]
		return price === undefined
			? null
			: currencyIds.map((currency) =>
					price[currency] === undefined ? null : [price[currency], null, null]
				)
	})
	return new Response(JSON.stringify(rates))
}
