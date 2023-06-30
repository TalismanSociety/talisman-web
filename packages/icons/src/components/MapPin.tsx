import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgMapPin = (
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
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z"
      />
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgMapPin)
export default ForwardRef
