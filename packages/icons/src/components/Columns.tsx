import * as React from 'react'
import { SVGProps } from 'react'
const SvgColumns = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 3v18m0-18h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7V3Zm0 0H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7V3Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgColumns
