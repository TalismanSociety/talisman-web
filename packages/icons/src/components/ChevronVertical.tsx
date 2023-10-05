import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'

const SvgChevronVertical = (
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
    >
      <path
        d="M6 15L12 21L18 15"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="1.80556"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 9L12 3L6 9"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="1.80556"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgChevronVertical)
export default ForwardRef
