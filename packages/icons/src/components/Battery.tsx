import * as React from 'react'
import { SVGProps } from 'react'
const SvgBattery = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M17 6H3C1.89543 6 1 6.89543 1 8V16C1 17.1046 1.89543 18 3 18H17C18.1046 18 19 17.1046 19 16V8C19 6.89543 18.1046 6 17 6Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M23 13V11" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export default SvgBattery
