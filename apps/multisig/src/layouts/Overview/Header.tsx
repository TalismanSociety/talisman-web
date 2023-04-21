import { css } from '@emotion/css'

const Header = () => {
  return (
    <header
      className={css`
        grid-area: header;
        background-color: red;
      `}
    >
      header
      <>select wallet btn</>
    </header>
  )
}

export default Header
