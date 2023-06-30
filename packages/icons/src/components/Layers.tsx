import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgLayers = (
  props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
    size?: number | string
  },
  ref: Ref<SVGSVGElement>
) => {
  const iconContext = React.useContext(IconContext)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? iconContext.size ?? 24}
      height={props.size ?? iconContext.size ?? 24}
      fill="none"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2 2 7l10 5 10-5-10-5Z"
      />
      <path stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m2 17 10 5 10-5" />
      <path stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m2 12 10 5 10-5" />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgLayers)
export default ForwardRef
