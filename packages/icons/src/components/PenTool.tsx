import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgPenTool = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <path
      d="m12 19 7-7 3 3-7 7-3-3Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m2 2 7.586 7.586" stroke="currentColor" strokeWidth={2} />
    <circle cx={11} cy={11} r={2} stroke="currentColor" strokeWidth={2} />
  </svg>
)
const ForwardRef = forwardRef(SvgPenTool)
export default ForwardRef
