import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgHeart = (
  props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
    size?: number | string
  },
  ref: Ref<SVGSVGElement>
) => (
  <svg
    width={props.size ?? 24}
    height={props.size ?? 24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.501 5.501 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.501 5.501 0 0 0 0-7.78v0Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const ForwardRef = forwardRef(SvgHeart)
export default ForwardRef
