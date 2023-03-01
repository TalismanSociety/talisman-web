import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgZap = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <path
      d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const ForwardRef = forwardRef(SvgZap)
export default ForwardRef
