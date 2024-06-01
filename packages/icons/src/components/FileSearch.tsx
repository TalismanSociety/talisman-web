import { IconContext } from '../context'
import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'

const SvgFileSearch = (
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
      viewBox="0 0 12 12"
      ref={ref}
      {...props}
    >
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 5.5H4m1 2H4m4-4H4m6 1.75V3.4c0-.84 0-1.26-.163-1.581a1.5 1.5 0 0 0-.656-.656C8.861 1 8.441 1 7.6 1H4.4c-.84 0-1.26 0-1.581.163a1.5 1.5 0 0 0-.656.656C2 2.139 2 2.559 2 3.4v5.2c0 .84 0 1.26.163 1.581a1.5 1.5 0 0 0 .656.656c.32.163.74.163 1.581.163h1.35M11 11l-.75-.75m.5-1.25a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgFileSearch)
export default ForwardRef
