import { useCallback, useState } from "react"

const MAX_INTEGER_DIGITS = 15

export const isAmountInput = (input: string, decimals: number) =>
	new RegExp(`^\\d{0,${MAX_INTEGER_DIGITS}}(\\.\\d{0,${decimals}})?$`).test(input)

const trimDecimals = (amount: string, decimals: number) => {
	const [integer, fraction] = amount.split(".")
	return fraction === undefined ? amount : `${integer}.${fraction.slice(0, decimals)}`
}

export const useAmountInputState = (decimals: number) => {
	const [amount, setAmount] = useState("")

	const setAmountInput = useCallback(
		(next: string) => {
			if (isAmountInput(next, decimals)) {
				setAmount(next)
			}
		},
		[decimals]
	)

	return [trimDecimals(amount, decimals), setAmountInput] as const
}
