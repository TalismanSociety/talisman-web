import * as React from 'react'
import { SVGProps } from 'react'
const SvgCameraOff = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m1 1 22 22" />
      <path d="M9 3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l15 15Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgCameraOff
