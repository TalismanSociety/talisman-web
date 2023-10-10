import { Eye, PlusCircle, Settings } from '@talismn/icons'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import NewTransactionModal from './Overview/NewTransactionModal'
import NoVault from './CreateMultisig/NoVault'
import { useTeamsBySigner } from '@domains/offchain-data'
import { EyeOfSauronProgressIndicator } from '@talismn/ui'

export const Layout: React.FC<
  React.PropsWithChildren & { selected?: string; requiresMultisig?: boolean; hideSideBar?: boolean }
> = ({ children, selected, requiresMultisig, hideSideBar }) => {
  const teams = useTeamsBySigner()
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
        {requiresMultisig && (!teams || teams.length === 0) ? (
          // loading teams from backend
          !teams ? (
            <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <EyeOfSauronProgressIndicator />
            </div>
          ) : (
            <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
              <NoVault />
            </div>
          )
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
