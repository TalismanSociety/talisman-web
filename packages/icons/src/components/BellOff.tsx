import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgBellOff = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <g clipPath="url(#a)" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.56 2.9A7 7 0 0 1 19 9v4m-5.27 8a2 2 0 0 1-3.46 0M17 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 .78-3.22L17 17Z" />
      <path d="m1 1 22 22" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
const ForwardRef = forwardRef(SvgBellOff)
export default ForwardRef
