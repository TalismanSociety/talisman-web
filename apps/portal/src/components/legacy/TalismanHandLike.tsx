import { type ImgHTMLAttributes } from 'react'

import TalismanHandLikeImg from '@/assets/thumbs_up_red.gif'

/** @deprecated */
export const TalismanHandLike = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src={TalismanHandLikeImg} alt="Loading..." width="128px" height="128px" {...props} />
}
