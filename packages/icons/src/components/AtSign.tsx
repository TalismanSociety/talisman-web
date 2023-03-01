import * as React from 'react'
import { SVGProps } from 'react'
const SvgAtSign = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgAtSign
