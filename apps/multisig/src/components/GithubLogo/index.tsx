import { css } from '@emotion/css'

import { ReactComponent as LogoSvg } from './logo.svg'

export default function Logo({ height }: { height?: string }) {
  return (
    <LogoSvg
      className={css`
        height: ${height};
      `}
    />
  )
}
