import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgMicOff = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <g clipPath="url(#a)" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m1 1 22 22" />
      <path d="M15 9.34V4a3 3 0 0 0-5.94-.6M9 9v3a3 3 0 0 0 5.12 2.12L9 9Z" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .412-.037.824-.11 1.23" />
      <path d="M12 19v4" />
      <path d="M8 23h8" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
const ForwardRef = forwardRef(SvgMicOff)
export default ForwardRef
