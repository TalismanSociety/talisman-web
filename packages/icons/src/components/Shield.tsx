import type { Ref, SVGProps } from 'react'
import { forwardRef, useContext } from 'react'

import { IconContext } from '../context'

const SvgShield = (
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
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgShield)
export default ForwardRef
