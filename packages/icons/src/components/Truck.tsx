import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgTruck = (
  props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
    size?: number | string
  },
  ref: Ref<SVGSVGElement>
) => {
  const iconContext = React.useContext(IconContext)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? iconContext.size ?? '1em'}
      height={props.size ?? iconContext.size ?? '1em'}
      fill="none"
      viewBox="0 0 24 24"
      display="inline"
      ref={ref}
      {...props}
    >
      <path stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3H1v13h15z" />
      <path stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8h4l3 3v5h-7z" />
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"
      />
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgTruck)
export default ForwardRef
