import * as React from 'react'
import { Ref, SVGProps, forwardRef } from 'react'

import { IconContext } from '../context'
const SvgPocket = (
  props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
    size?: number | string
  },
  ref: Ref<SVGSVGElement>
) => {
  const iconContext = React.useContext(IconContext)
  return (
    <svg
      width={props.size ?? iconContext.size ?? 24}
      height={props.size ?? iconContext.size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
      {...props}
    >
      <path
        d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-20 0V5a2 2 0 0 1 2-2v0Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m8 10 4 4 4-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgPocket)
export default ForwardRef
