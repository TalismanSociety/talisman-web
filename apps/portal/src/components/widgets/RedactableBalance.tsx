import type { PropsWithChildren } from "react"
import { Text } from "@/ui/atoms/Text"

export type RedactableBalanceProps = PropsWithChildren<{ redacted?: boolean }>

export const RedactableBalance = (props: RedactableBalanceProps) =>
	props.redacted ? <Text.Noop.Redacted>{props.children}</Text.Noop.Redacted> : <>{props.children}</>
