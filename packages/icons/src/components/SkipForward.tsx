import type { Ref, SVGProps } from 'react'
import { forwardRef, useContext } from 'react'

import { IconContext } from '../context'

const SvgSkipForward = (
  props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
    size?: number | string
  },
  ref: Ref<SVGSVGElement>
) => {
  const iconContext = useContext(IconContext)
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
      <path stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m5 4 10 8-10 8V4Z" />
      <path stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 5v14" />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgSkipForward)
export default ForwardRef
