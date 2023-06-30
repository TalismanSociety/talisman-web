import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgShieldOff = (
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
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <g stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} clipPath="url(#a)">
        <path d="M19.69 14a6.903 6.903 0 0 0 .31-2V5l-8-3-3.16 1.18" />
        <path d="M4.73 4.73 4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38" />
        <path d="m1 1 22 22" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
const ForwardRef = forwardRef(SvgShieldOff)
export default ForwardRef
