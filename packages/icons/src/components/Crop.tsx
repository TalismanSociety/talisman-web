import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgCrop = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <g clipPath="url(#a)" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.13 1 6 16a2 2 0 0 0 2 2h15" />
      <path d="M1 6.13 16 6a2 2 0 0 1 2 2v15" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
const ForwardRef = forwardRef(SvgCrop)
export default ForwardRef
