import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgPercent = (
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
      <path stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 5 5 19" />
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      />
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgPercent)
export default ForwardRef
