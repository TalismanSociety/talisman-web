import TalismanHandLikeImg from '@assets/thumbs_up_red.gif'
import { type ImgHTMLAttributes } from 'react'

export const TalismanHandLike = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src={TalismanHandLikeImg} alt="Loading..." width="128px" height="128px" {...props} />
}
