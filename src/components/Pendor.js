import { ReactComponent as Loader } from '@icons/loader.svg'
import { FC, ReactNode } from 'react'

type PendorProps = {
  prefix?: string | null | false,
  suffix?: string | null | false,
  require?: boolean,
  loader?: ReactNode,
}

const Pendor: FC<PendorProps> = ({ prefix = '', suffix = '', require, loader, children }) => {
  // undefined not set? await children
  // require is explicitly set to false
  return (require === undefined && !children) || require === false ? (
    loader || <Loader />
  ) : (
    <>
      {prefix}
      {children}
      {suffix}
    </>
  )
}

export default Pendor
