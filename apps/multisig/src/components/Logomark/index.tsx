import React from 'react'

import { ReactComponent as LogomarkSvg } from './logomark.svg'

export default function Logomark(props: React.HTMLAttributes<HTMLDivElement> & { size?: number | string }) {
  return (
    <div {...props} style={{ ...props.style, width: props.size, height: props.size }}>
      <LogomarkSvg />
    </div>
  )
}
