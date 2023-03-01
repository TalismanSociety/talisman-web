import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgNavigation2 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <path
      d="m12 2 7 19-7-4-7 4 7-19Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const ForwardRef = forwardRef(SvgNavigation2)
export default ForwardRef
