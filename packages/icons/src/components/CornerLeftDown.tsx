import * as React from 'react'
import { SVGProps } from 'react'
const SvgCornerLeftDown = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14 15L9 20L4 15" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M20 4H13C11.9391 4 10.9217 4.42143 10.1716 5.17157C9.42143 5.92172 9 6.93913 9 8V20"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgCornerLeftDown
