import { css, useTheme } from '@emotion/react'
import { NavLink } from 'react-router-dom'

export const RootNav = () => {
  const theme = useTheme()

  return (
    <div
      css={css`
        display: flex;
        gap: 1em;
        margin-bottom: 3rem;
        font-size: 1.8rem;
        border-bottom: 1px solid rgba(38, 38, 38, 1);

        > a {
          display: inline-block;
          padding-bottom: 0.4em;
          border-bottom: 1px solid transparent;
          margin-bottom: -1px;
        }

        & > a.active {
          color: ${theme.color.primary};
          border-color: ${theme.color.primary};
        }
      `}
    >
      <NavLink to="/crowdloans/participated" end>
        Participated
      </NavLink>
      <NavLink to="/crowdloans" end>
        Crowdloans
      </NavLink>
    </div>
  )
}
