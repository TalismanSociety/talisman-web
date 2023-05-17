import { accountsState } from '@domains/accounts/recoils'
import { allowExtensionConnectionState } from '@domains/extension/recoils'
import { isWeb3Injected } from '@polkadot/extension-dapp'
import { type PropsWithChildren } from 'react'
import { useRecoilValue } from 'recoil'

type ExtensionStatusGateProps = {
  loading?: JSX.Element | null
  disconnected?: JSX.Element | null
  unavailable?: JSX.Element | null
  unauthorized?: JSX.Element | null
  noaccount?: JSX.Element | null
}

export default function ExtensionStatusGate({
  children,
  unavailable,
  unauthorized,
  noaccount,
}: PropsWithChildren<ExtensionStatusGateProps>): JSX.Element | null {
  const accounts = useRecoilValue(accountsState)
  const allowExtensionConnection = useRecoilValue(allowExtensionConnectionState)

  if (!isWeb3Injected && unavailable !== undefined) return unavailable
  if (!allowExtensionConnection && unauthorized !== undefined) return unauthorized
  if (accounts.length === 0 && noaccount !== undefined) return noaccount

  if (!children) return null
  return <>{children}</>
}
