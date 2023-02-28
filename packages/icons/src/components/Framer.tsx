import * as React from 'react'
import { SVGProps } from 'react'
const SvgFramer = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M5 16H12M5 16V9H19V2H5L19 16H12H5ZM5 16L12 23V16H5Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgFramer
