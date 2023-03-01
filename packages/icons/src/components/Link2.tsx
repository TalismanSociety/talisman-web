import * as React from 'react'
import { SVGProps } from 'react'
const SvgLink2 = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12h8" />
      <path d="M15 7h3a5 5 0 1 1 0 10h-3m-6 0H6A5 5 0 1 1 6 7h3" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgLink2
