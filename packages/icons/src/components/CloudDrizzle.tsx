import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgCloudDrizzle = (
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
        <path d="M8 19v2" />
        <path d="M8 13v2" />
        <path d="M16 19v2" />
        <path d="M16 13v2" />
        <path d="M12 21v2" />
        <path d="M12 15v2" />
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A7.998 7.998 0 0 0 2.063 5.005 8 8 0 0 0 4 15.25" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
const ForwardRef = forwardRef(SvgCloudDrizzle)
export default ForwardRef
