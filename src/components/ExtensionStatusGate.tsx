import { useExtension } from '@libs/talisman'
import { PropsWithChildren } from 'react'

type ExtensionStateGateProps = {
  loading?: JSX.Element | null
  unavailable?: JSX.Element | null
  unauthorized?: JSX.Element | null
  noaccount?: JSX.Element | null
}

export default function ExtensionStateGate({
  children,
  loading,
  unavailable,
  unauthorized,
  noaccount,
}: PropsWithChildren<ExtensionStateGateProps>): JSX.Element | null {
  const { status } = useExtension()

  if (status === 'LOADING' && loading !== undefined) return loading
  if (status === 'UNAVAILABLE' && unavailable !== undefined) return unavailable
  if (status === 'UNAUTHORIZED' && unauthorized !== undefined) return unauthorized
  if (status === 'NOACCOUNT' && noaccount !== undefined) return noaccount

  if (!children) return null
  return <>{children}</>
}
