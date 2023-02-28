import * as React from 'react'
import { SVGProps } from 'react'
const SvgTablet = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 18H12.01M18 22H6C4.89543 22 4 21.1046 4 20L4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4L20 20C20 21.1046 19.1046 22 18 22Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgTablet
