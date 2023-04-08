import { css } from '@emotion/css'

import { ReactComponent as LogoSvg } from './image.svg'

export default function Plant({ height }: { height?: string }) {
  return (
    <LogoSvg
      className={css`
        height: ${height};
      `}
    />
  )
}
