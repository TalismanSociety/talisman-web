import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgCloudLightning = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <g clipPath="url(#a)" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 16.9A5 5 0 0 0 18 7h-1.26A8.001 8.001 0 0 0 1.681 5.757 8 8 0 0 0 5.121 16" />
      <path d="m13 11-4 6h6l-4 6" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
const ForwardRef = forwardRef(SvgCloudLightning)
export default ForwardRef
