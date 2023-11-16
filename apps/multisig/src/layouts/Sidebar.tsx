import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { IconButton } from '@talismn/ui'
import { device } from '@util/breakpoints'
import { ReactNode } from 'react'
import { activeMultisigsState, useSelectedMultisig } from '../domains/multisig'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { MultisigSelect } from '../components/MultisigSelect'

export const showMenuState = atom<boolean>({
  key: 'SHOW_MOBILE_MENU',
  default: false,
})

const Sidebar = (props: { options: { name: string; icon: ReactNode; onClick?: () => void }[]; selected?: string }) => {
  const theme = useTheme()
  const activeMultisigs = useRecoilValue(activeMultisigsState)
  const [selectedMultisig, setSelectedMultisig] = useSelectedMultisig()
  const [showMenu, setShowMenu] = useRecoilState(showMenuState)

  return (
    <>
      <section
        className={css`
          position: fixed;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: var(--color-grey800);
          border-radius: 16px;
          padding: 16px 11px;
          gap: 12px;
          width: 248px;
          z-index: 3;
          left: ${showMenu ? '16px' : '-100%'};
          transform: ${showMenu ? 'scale(1)' : 'scale(0)'};
          transition: 0.3s;
          @media ${device.sm} {
            transform: scale(1);
            position: static;
            padding: 8px;
            width: 200px;
          }
          @media ${device.lg} {
            padding: 16px;
            width: 248px;
          }
        `}
      >
        <MultisigSelect
          multisigs={activeMultisigs}
          selectedMultisig={selectedMultisig}
          onChange={setSelectedMultisig}
        />
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
            <span>{name}</span>
          </div>
        ))}
      </section>
      <div
        css={{
          'pointerEvents': showMenu ? 'all' : 'none',
          'backgroundColor': `rgba(0,0,0,${showMenu ? 0.7 : 0})`,
          'position': 'fixed',
          'top': 0,
          'left': 0,
          'height': '100vh',
          'width': '100vw',
          'zIndex': 2,
          'backdrop-filter': showMenu ? 'blur(4px)' : 'none',
          'transition': '0.3s',
          [`@media(${device.sm})`]: {
            display: 'none',
          },
        }}
        onClick={() => setShowMenu(false)}
      />
    </>
  )
}

export default Sidebar
