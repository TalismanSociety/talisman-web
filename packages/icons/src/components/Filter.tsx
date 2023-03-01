import * as React from 'react'
import { SVGProps } from 'react'
const SvgFilter = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgFilter
