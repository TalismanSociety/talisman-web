import type { Ref, SVGProps } from 'react'
import { forwardRef, useContext } from 'react'

import { IconContext } from '../context'

const SvgPlus = (
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
      <path stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14" />
      <path stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgPlus)
export default ForwardRef
