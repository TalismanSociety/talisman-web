import * as React from 'react'
import { SVGProps } from 'react'
const SvgBluetooth = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m6.5 6.5 11 11L12 23V1l5.5 5.5-11 11"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgBluetooth
