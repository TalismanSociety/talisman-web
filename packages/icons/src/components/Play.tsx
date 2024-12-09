import type { Ref, SVGProps } from 'react'
import { forwardRef, useContext } from 'react'

import { IconContext } from '../context'

const SvgPlay = (
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
      <path stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m5 3 14 9-14 9V3Z" />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgPlay)
export default ForwardRef
