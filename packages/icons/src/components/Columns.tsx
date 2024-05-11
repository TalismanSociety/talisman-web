import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgColumns = (
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
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v18m0-18h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7zm0 0H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7z"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgColumns)
export default ForwardRef
