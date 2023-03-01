import * as React from 'react'
import { SVGProps } from 'react'
const SvgZapOff = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.41 6.75 13 2l-2.43 2.92" />
      <path d="M18.57 12.91 21 10h-5.34" />
      <path d="m8 8-5 6h9l-1 8 5-6" />
      <path d="m1 1 22 22" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgZapOff
