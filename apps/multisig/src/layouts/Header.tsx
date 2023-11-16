import Logo from '@components/Logo'
import { css } from '@emotion/css'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { selectedAccountState } from '../domains/auth'
import { accountsState } from '../domains/extension'
import AccountSwitcher from '../components/AccountSwitcher'
import { useNavigate } from 'react-router-dom'
import { device } from '../util/breakpoints'
import { IconButton } from '@talismn/ui'
import { showMenuState } from './Sidebar'
import { Menu } from '@talismn/icons'

const Header = () => {
  const navigate = useNavigate()
  const selectedAccount = useRecoilValue(selectedAccountState)
  const extensionAccounts = useRecoilValue(accountsState)
  const setShowMenu = useSetRecoilState(showMenuState)

  return (
    <header
      className={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 56px;
        gap: 16px;
        width: 100%;
      `}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Logo
          css={{
            display: 'flex',
            height: 'max-content',
            cursor: 'pointer',
            width: 80,
            [`@media(${device.sm})`]: {
              width: 106,
            },
          }}
          onClick={() => navigate('/')}
        />
        <IconButton
          css={{
            [`@media(${device.sm})`]: {
              display: 'none',
            },
          }}
          onClick={() => setShowMenu(true)}
        >
          <Menu />
        </IconButton>
      </div>

      <div>
        <AccountSwitcher selectedAccount={selectedAccount?.injected} accounts={extensionAccounts} />
      </div>
    </header>
  )
}

export default Header
