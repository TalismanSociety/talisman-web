import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgZapPlus = (
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
      viewBox="0 0 20 20"
      display="inline"
      ref={ref}
      {...props}
    >
      <path
        fill="currentcolor"
        d="m10.833 1.667.695.087a.7.7 0 0 0-1.232-.535zm-8.333 10-.538-.448a.7.7 0 0 0 .538 1.148zm7.5 0 .693.101a.7.7 0 0 0-.693-.801zm0-3.334-.695-.086a.7.7 0 0 0 .695.786zM9 18.5l-.693-.101a.7.7 0 0 0 1.188.596zm2.495-1.505a.7.7 0 0 0-.99-.99zm4.474-7.95a.7.7 0 1 0 1.063.91zm1.531-.712.532.456a.7.7 0 0 0-.532-1.156zM14.3 17a.7.7 0 1 0 1.4 0zm1.4-6a.7.7 0 1 0-1.4 0zM12 13.3a.7.7 0 1 0 0 1.4zm6 1.4a.7.7 0 1 0 0-1.4zM10.296 1.219l-8.334 10 1.076.896 8.333-10zM2.5 12.367H10v-1.4H2.5zm8.195-3.947.833-6.666-1.39-.174-.833 6.667zm-1.388 3.145-1 6.834 1.386.203 1-6.834zm.188 7.43 2-2-.99-.99-2 2zm7.537-9.04 1-1.166-1.064-.911-1 1.167zM15.7 17v-3h-1.4v3zm0-3v-3h-1.4v3zm-3.7.7h3v-1.4h-3zm3 0h3v-1.4h-3zm2.5-7.067H10v1.4h7.5z"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgZapPlus)
export default ForwardRef
