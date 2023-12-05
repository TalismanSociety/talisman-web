import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgWallet = (
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
      viewBox="0 0 20 20"
      ref={ref}
      {...props}
    >
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.75 11.667h.008M2.5 4.167v11.666c0 .92.746 1.667 1.667 1.667h11.666c.92 0 1.667-.746 1.667-1.667V7.5c0-.92-.746-1.667-1.667-1.667H4.167c-.92 0-1.667-.746-1.667-1.666Zm0 0c0-.92.746-1.667 1.667-1.667h10m0 9.167a.417.417 0 1 1-.834 0 .417.417 0 0 1 .834 0Z"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgWallet)
export default ForwardRef
