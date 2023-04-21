import { css } from '@emotion/css'

const Sidebar = () => {
  return (
    <section
      className={css`
        grid-area: sidebar;
        background-color: green;
      `}
    >
      sidebar
    </section>
  )
}

export default Sidebar
