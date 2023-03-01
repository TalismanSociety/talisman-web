import * as React from 'react'
import { SVGProps } from 'react'
const SvgCloudSnow = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)">
      <path
        d="M20 17.58A5 5 0 0 0 18 8h-1.26A7.998 7.998 0 0 0 2.063 6.005 8 8 0 0 0 4 16.25"
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
export default SvgCloudSnow
