import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgSmartphone = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <path
      d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 18h.01" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
)
const ForwardRef = forwardRef(SvgSmartphone)
export default ForwardRef
