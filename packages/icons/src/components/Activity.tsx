import * as React from 'react'
import { SVGProps } from 'react'
const SvgActivity = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M22 12h-4l-3 9L9 3l-3 9H2"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgActivity
