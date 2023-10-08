import { Eye, PlusCircle, Settings } from '@talismn/icons'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import NewTransactionModal from './Overview/NewTransactionModal'
import { useRecoilValue } from 'recoil'
import { activeMultisigsState } from '../domains/multisig'
import NoVault from './CreateMultisig/NoVault'

export const Layout: React.FC<
  React.PropsWithChildren & { selected?: string; requiresMultisig?: boolean; hideSideBar?: boolean }
> = ({ children, selected, requiresMultisig, hideSideBar }) => {
  const activeMultisigs = useRecoilValue(activeMultisigsState)
  const navigate = useNavigate()

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        gap: 16,
        padding: 24,
        flex: 1,
      }}
    >
      <Header />
      <div css={{ display: 'flex', flex: 1, gap: 16 }}>
        {requiresMultisig && activeMultisigs.length === 0 ? (
          <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
            <NoVault />
          </div>
        ) : (
          <>
            {!hideSideBar && (
              <Sidebar
                selected={selected}
                options={[
                  {
                    name: 'Overview',
                    icon: <Eye />,
                    onClick: () => navigate('/overview'),
                  },
                  {
                    name: 'Transaction',
                    icon: <PlusCircle />,
                    onClick: () => navigate('/overview/new-transaction'),
                  },
                  {
                    name: 'Settings',
                    icon: <Settings />,
                    onClick: () => navigate('/settings'),
                  },
                ]}
              />
            )}
            {children}
          </>
        )}
      </div>
      <Footer />
      <NewTransactionModal />
    </div>
  )
}
