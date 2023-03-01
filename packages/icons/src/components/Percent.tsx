import * as React from 'react'
import { SVGProps } from 'react'
const SvgPercent = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19 5 5 19" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgPercent
