import * as React from 'react'
import { SVGProps } from 'react'
const SvgCornerDownLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M9 10L4 15L9 20" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M20 4V11C20 12.0609 19.5786 13.0783 18.8284 13.8284C18.0783 14.5786 17.0609 15 16 15H4"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgCornerDownLeft
