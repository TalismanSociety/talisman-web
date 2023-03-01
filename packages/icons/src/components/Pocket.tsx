import * as React from 'react'
import { SVGProps } from 'react'
const SvgPocket = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-20 0V5a2 2 0 0 1 2-2v0Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m8 10 4 4 4-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export default SvgPocket
