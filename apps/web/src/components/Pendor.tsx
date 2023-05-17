import { ReactComponent as Loader } from '@icons/loader.svg'
import { type PropsWithChildren, type ReactElement } from 'react'

export type PendorProps = {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  require?: boolean
  loader?: ReactElement
}

export default function Pendor({
  prefix = '',
  suffix = '',
  require,
  loader,
  children,
}: PropsWithChildren<PendorProps>): ReactElement {
  // undefined not set? await children
  // require is explicitly set to false
  if ((require === undefined && !children) || require === false) return loader ?? <Loader />

  return (
    <>
      {prefix}
      {children}
      {suffix}
    </>
  )
}
