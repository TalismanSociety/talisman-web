import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgUmbrella = (
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
      d="M18 19a3 3 0 0 1-6 0v-7m11 0a11.05 11.05 0 0 0-22 0h22Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const ForwardRef = forwardRef(SvgUmbrella)
export default ForwardRef
