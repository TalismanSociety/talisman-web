import { Total } from '@archetypes/Wallet'
import { legacySelectedAccountState } from '@domains/accounts/recoils'
import { AccountValueInfo, BottomBorderNav } from '@talismn/ui'
import { Outlet } from 'react-router'
import { Link, useMatch } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

const Portfolio = () => {
  // useMatch
  const paths = [
    { path: '', name: 'Overview' },
    { path: 'nfts', name: 'NFTs' },
    { path: 'assets', name: 'Assets' },
    { path: 'history', name: 'History' },
  ]

  const account = useRecoilValue(legacySelectedAccountState)

  // get the current path that is after /portfolio/ even if there is something after it
  const currentPath = useMatch('/portfolio/:id/*')?.params.id ?? paths[0]?.path

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '100%',
      }}
    >
      <AccountValueInfo address={account?.address ?? ''} name={account?.name ?? 'All Accounts'} balance={<Total />} />
      <BottomBorderNav>
        {paths.map(path => (
          <BottomBorderNav.Item key={path.path} selected={path.path === currentPath}>
            <Link to={path.path}>{path.name}</Link>
          </BottomBorderNav.Item>
        ))}
      </BottomBorderNav>
      <Outlet />
    </div>
  )
}

export default Portfolio
