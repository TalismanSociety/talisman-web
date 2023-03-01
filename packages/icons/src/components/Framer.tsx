import * as React from 'react'
import { SVGProps } from 'react'
const SvgFramer = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M5 16h7m-7 0V9h14V2H5l14 14H5Zm0 0 7 7v-7H5Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgFramer
