import { type PropsWithChildren, type ReactElement } from 'react'

import Loader from '@/assets/icons/loader.svg?react'

export type PendorProps = {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  require?: boolean
  loader?: ReactElement
}

/** @deprecated */
export const Pendor = ({
  prefix = '',
  suffix = '',
  require,
  loader,
  children,
}: PropsWithChildren<PendorProps>): ReactElement => {
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
