import type { Ref, SVGProps } from 'react'
import { forwardRef, useContext } from 'react'

import { IconContext } from '../context'

const SvgUnknown = (
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
      viewBox="0 0 11 16"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M3.704 11.288h2.698c0-.317.04-.595.119-.873.178-.654.515-1.17 1.15-1.765 1.23-1.111 2.897-2.143 2.897-4.404C10.568 1.706 8.425 0 5.39 0 1.819 0-.185 2.321.013 5.654H2.95C2.79 3.85 3.684 2.6 5.33 2.6c1.27 0 2.183.774 2.183 1.885 0 1.11-.893 1.686-2.103 2.837-1.072 1.031-1.706 2.023-1.706 3.71v.257zm-.258 4.107H6.64V12.34H3.446v3.055z"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgUnknown)
export default ForwardRef
