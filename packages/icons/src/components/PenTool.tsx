import * as React from 'react'
import { SVGProps } from 'react'
const SvgPenTool = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 19L19 12L22 15L15 22L12 19Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 13L16.5 5.5L2 2L5.5 16.5L13 18L18 13Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M2 2L9.58579 9.58579" stroke="currentColor" strokeWidth={2} />
    <circle cx={11} cy={11} r={2} stroke="currentColor" strokeWidth={2} />
  </svg>
)
export default SvgPenTool