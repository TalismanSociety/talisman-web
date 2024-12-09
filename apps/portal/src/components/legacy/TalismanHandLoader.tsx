import { type ImgHTMLAttributes } from 'react'

import TalismanHandLoading from '@/assets/spin_red.gif'

export const TalismanHandLoader = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src={TalismanHandLoading} alt="Loading..." width="128px" height="128px" {...props} />
}
