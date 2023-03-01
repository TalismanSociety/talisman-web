import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgNavigation = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <path
      d="m3 11 19-9-9 19-2-8-8-2Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const ForwardRef = forwardRef(SvgNavigation)
export default ForwardRef
