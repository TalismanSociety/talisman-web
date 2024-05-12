import { IconContext } from '../context'
import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'

const SvgEthereum = (
  props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
    size?: number | string
  },
  ref: Ref<SVGSVGElement>
) => {
  const iconContext = React.useContext(IconContext)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? iconContext.size ?? 24}
      height={props.size ?? iconContext.size ?? 24}
      fill="none"
      viewBox="0 0 8 12"
      ref={ref}
      {...props}
    >
      <g fill="currentcolor">
        <path d="m0 6.156 3.598 2.223 3.598-2.223L3.598 0 0 6.156Z" />
        <path d="m0 6.853 3.598 2.24 3.598-2.24L3.598 12 0 6.853Z" />
      </g>
    </svg>
  )
}
const ForwardRef = forwardRef(SvgEthereum)
export default ForwardRef
