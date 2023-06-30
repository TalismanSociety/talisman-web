import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgPenTool = (
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
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m12 19 7-7 3 3-7 7-3-3Z"
      />
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z"
      />
      <path stroke="currentcolor" strokeWidth={2} d="m2 2 7.586 7.586" />
      <circle cx={11} cy={11} r={2} stroke="currentcolor" strokeWidth={2} />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgPenTool)
export default ForwardRef
