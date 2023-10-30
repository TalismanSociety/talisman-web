import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { IconButton } from '@talismn/ui'
import { device, size } from '@util/breakpoints'
import { ReactNode } from 'react'
import { useWindowSize } from 'react-use'

const Sidebar = (props: { options: { name: string; icon: ReactNode; onClick?: () => void }[]; selected?: string }) => {
  const theme = useTheme()
  const width = useWindowSize().width

  return (
    <section
      className={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--color-grey800);
        border-radius: 16px;
        padding: 16px 11px;
        gap: 12px;
        width: 70px;
        @media ${device.md} {
          padding: 16px 5px;
          width: 200px;
        }
        @media ${device.lg} {
          padding: 16px;
          width: 248px;
        }
      `}
    >
      {props.options.map(({ name, icon, onClick }) => (
        <div
          key={name}
          onClick={onClick}
          className={css`
            display: flex;
            align-items: center;
            width: 100%;
            color: ${name === props.selected ? theme.color.offWhite : theme.color.lightGrey};
            cursor: pointer;
            transition: 250ms;
            ${name !== props.selected &&
            `:hover {
              filter: brightness(1.2);
            }`}
          `}
        >
          <IconButton
            key={name}
            contentColor={name === props.selected ? theme.color.offWhite : theme.color.lightGrey}
            className={css`
              height: 48px !important;
              width: 48px !important;
              pointer-events: none;
            `}
          >
            {icon}
          </IconButton>
          {width > size.md && <span>{name}</span>}
        </div>
      ))}
    </section>
  )
}

export default Sidebar
