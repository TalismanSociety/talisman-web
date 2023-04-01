import React from 'react'

import { ReactComponent as LogoSvg } from './logo.svg'

export default function Logo(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <LogoSvg />
    </div>
  )
}
