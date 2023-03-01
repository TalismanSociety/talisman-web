import * as React from 'react'
import { SVGProps } from 'react'
const SvgMusic = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M9 17H5a2 2 0 1 0 0 4h2a2 2 0 0 0 2-2v-2Zm12-2h-4a2 2 0 0 0 0 4h2a2 2 0 0 0 2-2v-2Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 17V5l12-2v12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export default SvgMusic
