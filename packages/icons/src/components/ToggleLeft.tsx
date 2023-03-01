import * as React from 'react'
import { SVGProps } from 'react'
const SvgToggleLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M16 5H8a7 7 0 0 0 0 14h8a7 7 0 1 0 0-14Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgToggleLeft
