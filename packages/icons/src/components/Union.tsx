import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgUnion = (
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
      viewBox="0 0 12 13"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M4.887 9.125c0 .617.497 1.118 1.113 1.125A1.126 1.126 0 0 0 6 8a1.126 1.126 0 0 0-1.113 1.125Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.6 7.187c-.114.248-.45.336-.644.143l-.354-.355A.939.939 0 0 0 .275 8.301l2.867 2.864A3.747 3.747 0 0 0 6 12.5a3.747 3.747 0 0 0 2.858-1.335l2.867-2.864a.937.937 0 1 0-1.327-1.326l-.354.355c-.194.193-.53.105-.644-.143a.371.371 0 0 1-.035-.156V2.75a.938.938 0 0 0-1.877 0v2.167c0 .186-.19.313-.369.257a.272.272 0 0 1-.193-.256v-3.48A.938.938 0 0 0 6 .5a.938.938 0 0 0-.926.937v3.48c0 .119-.08.221-.193.257-.178.056-.37-.07-.37-.257V2.75a.938.938 0 0 0-1.876 0V7.03a.371.371 0 0 1-.035.156ZM6 7.25c-1.652.01-2.99 1.875-2.99 1.875S4.348 10.99 6 11c1.652-.01 2.99-1.875 2.99-1.875S7.652 7.26 6 7.25Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgUnion)
export default ForwardRef
