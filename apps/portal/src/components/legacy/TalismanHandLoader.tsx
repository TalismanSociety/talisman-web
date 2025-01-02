import { type ImgHTMLAttributes } from 'react'

import SpinnyHandFast from '@/assets/spinnyhand-fast.gif'

/** @deprecated */
export const TalismanHandLoader = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src={SpinnyHandFast} alt="Loading..." width="128px" height="128px" {...props} />
}
