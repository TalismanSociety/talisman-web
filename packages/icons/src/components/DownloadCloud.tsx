import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgDownloadCloud = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <g clipPath="url(#a)" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 17 4 4 4-4" />
      <path d="M12 12v9" />
      <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8.001 8.001 0 0 0 2.532 6.268 8 8 0 0 0 3 16.29" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
const ForwardRef = forwardRef(SvgDownloadCloud)
export default ForwardRef
