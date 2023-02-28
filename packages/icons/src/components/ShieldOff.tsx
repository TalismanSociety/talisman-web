import * as React from 'react'
import { SVGProps } from 'react'
const SvgShieldOff = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_210_1541)">
      <path
        d="M19.69 14C19.891 13.3522 19.9955 12.6783 20 12V5L12 2L8.83997 3.18"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.73 4.73001L4 5.00001V12C4 18 12 22 12 22C14.117 20.8829 16.0197 19.4001 17.62 17.62"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 1L23 23" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_210_1541">
        <rect width={24} height={24} fill="white" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgShieldOff
