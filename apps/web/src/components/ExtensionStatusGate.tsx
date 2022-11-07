import { useExtension } from '@libs/talisman'
import { PropsWithChildren } from 'react'

type ExtensionStatusGateProps = {
  loading?: JSX.Element | null
  disconnected?: JSX.Element | null
  unavailable?: JSX.Element | null
  unauthorized?: JSX.Element | null
  noaccount?: JSX.Element | null
}

export default function ExtensionStatusGate({
  children,
  loading,
  disconnected,
  unavailable,
  unauthorized,
  noaccount,
}: PropsWithChildren<ExtensionStatusGateProps>): JSX.Element | null {
  const { status } = useExtension()

  if (status === 'LOADING' && loading !== undefined) return loading
  if (status === 'DISCONNECTED' && disconnected !== undefined) return disconnected
  if (status === 'UNAVAILABLE' && unavailable !== undefined) return unavailable
  if (status === 'UNAUTHORIZED' && unauthorized !== undefined) return unauthorized
  if (status === 'NOACCOUNT' && noaccount !== undefined) return noaccount

  if (!children) return null
  return <>{children}</>
}
