import * as React from 'react'
import { SVGProps } from 'react'
const SvgDroplet = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m12 2.69 5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgDroplet
