import * as React from 'react'
import { SVGProps } from 'react'
const SvgCloud = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)">
      <path
        d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgCloud
