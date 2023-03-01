import * as React from 'react'
import { SVGProps } from 'react'
const SvgAward = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgAward
