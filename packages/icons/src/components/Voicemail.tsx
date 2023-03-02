import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'
const SvgVoicemail = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <path
      d="M5.5 16a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 16a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M5.5 16h13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ForwardRef = forwardRef(SvgVoicemail)
export default ForwardRef
