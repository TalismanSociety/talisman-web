import { Eye, PlusCircle, Settings } from '@talismn/icons'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import NewTransactionModal from './Overview/NewTransactionModal'
import BetaNotice from './Overview/BetaNotice'

export const Layout: React.FC<React.PropsWithChildren & { selected?: string }> = ({ children, selected }) => {
  const navigate = useNavigate()
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        gap: 16,
        padding: 28,
        flex: 1,
      }}
    >
      <Header />
      <div css={{ display: 'flex', flex: 1, gap: 16 }}>
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
        {children}
      </div>
      <Footer />
      <NewTransactionModal />
      <BetaNotice />
    </div>
  )
}
