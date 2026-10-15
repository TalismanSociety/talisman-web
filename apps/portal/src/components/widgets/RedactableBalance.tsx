import type { PropsWithChildren } from "react"
import { atom, useRecoilValue } from "recoil"
import { Text } from "@/ui/atoms/Text"

const redactBalanceState = atom({ key: " Widget/RedactBalance", default: false })

export type RedactableBalanceProps = PropsWithChildren<{ redacted?: boolean }>

export const RedactableBalance = (props: RedactableBalanceProps) =>
	useRecoilValue(redactBalanceState) || props.redacted ? (
		<Text.Noop.Redacted>{props.children}</Text.Noop.Redacted>
	) : (
		<>{props.children}</>
	)
