import { Text } from '@talismn/ui'
import type { PropsWithChildren } from 'react'
import { atom, useRecoilValue } from 'recoil'

export const redactBalanceState = atom({ key: ' Widget/RedactBalance', default: false })

export type RedactableBalanceProps = PropsWithChildren<{ redacted?: boolean }>

const RedactableBalance = (props: RedactableBalanceProps) =>
  useRecoilValue(redactBalanceState) || props.redacted ? (
    <Text.Noop.Redacted>{props.children}</Text.Noop.Redacted>
  ) : (
    <>{props.children}</>
  )

export default RedactableBalance
