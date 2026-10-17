import { bind } from "@react-rxjs/core"
import type { TokenRateCurrency } from "@talismn/token-rates"
import { z } from "zod"

import { persistedState } from "@/util/persistedState"

export const currencyConfig: Partial<Record<TokenRateCurrency, { symbol: string; name: string }>> =
	{
		usd: { name: "US Dollar", symbol: "$" },
		cny: { name: "Chinese Yuan", symbol: "CN¥" },
		eur: { name: "Euro", symbol: "€" },
		gbp: { name: "British Pound", symbol: "£" },
		cad: { name: "Canadian Dollar", symbol: "C$" },
		aud: { name: "Australian Dollar", symbol: "A$" },
		nzd: { name: "New Zealand Dollar", symbol: "NZ$" },
		jpy: { name: "Japanese Yen", symbol: "JP¥" },
		rub: { name: "Russian Ruble", symbol: "₽" },
		krw: { name: "South Korean Won", symbol: "₩" },
		idr: { name: "Indonesian Rupiah", symbol: "Rp" },
		php: { name: "Philippine Peso", symbol: "₱" },
		thb: { name: "Thai Baht", symbol: "฿" },
		vnd: { name: "Vietnamese Dong", symbol: "₫" },
		inr: { name: "Indian Rupee", symbol: "₹" },
		try: { name: "Turkish Lira", symbol: "₺" },
		sgd: { name: "Singapore Dollar", symbol: "S$" },
		btc: { name: "Bitcoin", symbol: "₿" },
		eth: { name: "Ethereum", symbol: "Ξ" },
		dot: { name: "Polkadot", symbol: "D" },
	}

const selectableCurrencies = [
	"usd",
	"cny",
	"eur",
	"gbp",
	"cad",
	"aud",
	"nzd",
	"jpy",
	"rub",
	"krw",
	"idr",
	"php",
	"thb",
	"vnd",
	"inr",
	"try",
	"sgd",
	"btc",
	"eth",
	"dot",
] as const satisfies ReadonlyArray<Exclude<TokenRateCurrency, "tao">>

export type SelectableCurrency = (typeof selectableCurrencies)[number]

export const selectedCurrency$ = persistedState<SelectableCurrency>(
	"selected-currency",
	z.enum(selectableCurrencies),
	"usd"
)

export const [useSelectedCurrency] = bind(selectedCurrency$)

export const setSelectedCurrency = (currency: SelectableCurrency) =>
	selectedCurrency$.next(currency)
