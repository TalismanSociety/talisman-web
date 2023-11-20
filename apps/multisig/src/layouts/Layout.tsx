import { Eye, List, Send, Settings, Share2, Users, Vote, Zap } from '@talismn/icons'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { EyeOfSauronProgressIndicator } from '@talismn/ui'
import { useRecoilValue } from 'recoil'
import { activeMultisigsState } from '@domains/multisig'
import { activeTeamsState } from '../domains/offchain-data'
import { Navigate } from 'react-router-dom'

export const Layout: React.FC<
  React.PropsWithChildren & { selected?: string; requiresMultisig?: boolean; hideSideBar?: boolean }
> = ({ children, selected, requiresMultisig, hideSideBar }) => {
  const multisigs = useRecoilValue(activeMultisigsState)
  const activeTeams = useRecoilValue(activeTeamsState)
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
        {requiresMultisig && (!activeTeams || multisigs.length === 0) ? (
          // loading multisigs from backend
          !activeTeams ? (
            <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <EyeOfSauronProgressIndicator />
            </div>
          ) : (
            <Navigate to="/add-vault" />
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
                    name: 'Send',
                    icon: <Send />,
                    onClick: () => navigate('/send'),
                  },
                  {
                    name: 'Multi-send',
                    icon: <Share2 />,
                    onClick: () => navigate('/multisend'),
                  },
                  {
                    name: 'Voting',
                    icon: <Vote />,
                    onClick: () => navigate('/voting'),
                  },
                  {
                    name: 'Staking',
                    icon: <Zap />,
                    onClick: () => navigate('/staking'),
                  },
                  {
                    name: 'Advanced',
                    icon: <List />,
                    onClick: () => navigate('/advanced'),
                  },
                  {
                    name: 'Address Book',
                    icon: <Users />,
                    onClick: () => navigate('/address-book'),
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
    </div>
  )
}
